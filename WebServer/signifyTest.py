# %% [markdown]
# # Daniel Malky 318570462

# ======= Disable Warnings
from importlib.resources import path
from multiprocessing.connection import wait
import warnings

from cv2 import waitKey

warnings.filterwarnings("ignore")

# ======= Imports
import sys
import os
from sys import platform
import argparse
from scipy import ndimage
import numpy as np
import torch
import torchvision
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt
import cv2
from glob import glob
import hand_detector as htm
from sign_confirmer import Confirmer
import matplotlib.image as img



# ====== Hand Detector
detector = htm.handDetector(detectionCon=1)
confirmer = Confirmer(hand='right')

# ====== Neural Network
str_device = "cuda" if torch.cuda.is_available() else "cpu"
device = torch.device(str_device)

model = torch.hub.load('ultralytics/yolov5', 'custom', path='../Weights/best.pt')
print('model loaded');

# ====== Results
prev_results = []
identified = None
printed_iden = None
printed_ctr = 0

# %%
# ## Import a video





# %%
# ## Import db images

img_mask = "./db/*.jpg"
img_names = glob(img_mask)
num_images = len(img_names)




def check_identify(char):
    global identified
    if (char == '!'):
        return None
    print(char)
    prev_results.append(char)
    if (len(prev_results) > 20):
        prev_results.pop(0)
    if (prev_results.count(char) > 15):
        identified = char
        prev_results.clear()





def compare_to_db(img):
    best_match = '!'
    best_match_score = 0
    detect = model(img).pandas().xyxy[0]
    for index, row in detect.iterrows():
        if (row['confidence'] > best_match_score):
            best_match = row['name']
            best_match_score = row['confidence']

    return (best_match, best_match_score)


def delete_low_keys(keys, orig_frame_height):
    max_key = keys[0]
    for k in keys:
        if (k[2] > max_key[2]):
            max_key = k

    good_keys = []
    for k in keys:
        if (k[2] < max_key[2] + 300) and (k[2] < orig_frame_height / 2):
            good_keys.append(k)

    if (len(good_keys) != 21):
        return None

    return good_keys


def get_hand_coords(keys, width, height):
    left_most_key = None
    right_most_key = None
    top_most_key = None
    bottom_most_key = None
    left_most_key_val = width
    right_most_key_val = 0
    top_most_key_val = height
    bottom_most_key_val = 0
    for k in keys:
        if (k[1] < left_most_key_val):
            left_most_key_val = k[1]
            left_most_key = k
        if (k[1] > right_most_key_val):
            right_most_key_val = k[1]
            right_most_key = k
        if (k[2] < top_most_key_val):
            top_most_key_val = k[2]
            top_most_key = k
        if (k[2] > bottom_most_key_val):
            bottom_most_key_val = k[2]
            bottom_most_key = k
    dict = {'left-key': left_most_key, 'left-val': left_most_key_val,
            'right-key': right_most_key, 'right-val': right_most_key_val,
            'top-key': top_most_key, 'top-val': top_most_key_val,
            'bottom-key': bottom_most_key, 'bottom-val': bottom_most_key_val,
            'valid': left_most_key is not None and
                     right_most_key is not None and
                     bottom_most_key is not None and
                     top_most_key is not None}

    return dict


def cut_hand(img, keys_dict, scale='big', rotate=None):
    if (scale == 'big'):
        cut = 70
    elif (scale == 'medium'):
        cut = 40
    else:
        cut = 20
    if (rotate == 'left'):
        degrees = 30
    elif (rotate == 'right'):
        degrees = -30
    else:
        degrees = 0

    if not keys_dict['valid']:
        return None
    else:
        dst = img.copy()
        cut_img = dst[keys_dict['top-val'] - cut: keys_dict['bottom-val'] + cut,
                  keys_dict['left-val'] - cut: keys_dict['right-val'] + cut]
        rotated_img = ndimage.rotate(cut_img, degrees)
        return rotated_img


def get_match(img, keys_dict, keys):
    results = []
    sec_char = '!'
    sec_score = 0
    curr_char = '!'
    curr_score = 0
    # no room for a lot of detections. spin the hand so the wrist is up and detect big
    img_big = cut_hand(img, keys_dict, 'big', None)
    img_left = cut_hand(img, keys_dict, 'medium', 'left')

    results.append(compare_to_db(img_big))
    results.append(compare_to_db(img_left))
    for char, score in results:
        if (score > curr_score):
            sec_char = curr_char
            curr_score = score
            curr_char = char
        elif (score > sec_score):
            sec_score = score
            sec_char = char

    main_char = curr_char
    if (not confirmer.confirm(curr_char, keys)):
        curr_char = sec_char
        if (not confirmer.confirm(curr_char, keys)):
            curr_char = '!'

    if (curr_char == '!'):
        curr_char = confirmer.semantic_corrent(main_char, keys)
        if (curr_char == '!'):
            curr_char = confirmer.semantic_corrent(sec_char, keys)
            if (curr_char == '!'):
                curr_char = confirmer.semantic_corrent(curr_char, keys)

    return curr_char


def draw_square(img, keys_dict, letter):
    if not keys_dict['valid']:
        return img
    else:
        dst = img.copy()
        top_left_p = (keys_dict['left-val'] - 30, keys_dict['top-val'] - 30)
        bottom_right_p = (keys_dict['right-val'] + 30, keys_dict['bottom-val'] + 30)
        dst = cv2.rectangle(dst, top_left_p, bottom_right_p, (0, 255, 0), 2, cv2.LINE_AA)
        cv2.putText(
            dst, letter,
            (top_left_p[0], top_left_p[1] - 10),
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 3, cv2.LINE_AA)
        return dst

def detect_sign(img_path):
    cap = cv2.VideoCapture(img_path)
    if (cap.isOpened() == False):
        print("Error opening video file")
        exit(0)
    width = int(cap.get(3))
    height = int(cap.get(4))
    ret, frame = cap.read()
    reframe = process_image(frame, height, width)
    return reframe
    return identified;




def process_image(img,orig_frame_height,orig_frame_width):
    dst = img.copy()
    cropped_img = img[0:int(orig_frame_height / 2), :]
    marked_img = detector.findHands(cropped_img)
    keys = detector.findPosition(marked_img, draw=False)
    if (len(keys) == 0):
        print('no hands in image')
        cv2.putText(
            dst, "Unable To Read",
            (50, 50),
            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3, cv2.LINE_AA)

        return dst
    high_hand_keys = delete_low_keys(keys, orig_frame_height)
    if (high_hand_keys is None):
        print('high hand keys is none')
        cv2.putText(
            dst, "Unable To Read",
            (50, 50),
            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3, cv2.LINE_AA)
    else:
        keys_dict = get_hand_coords(high_hand_keys, orig_frame_width, orig_frame_height)
        char = get_match(dst.copy(), keys_dict, high_hand_keys)
        print(char)
        check_identify(char)
        # confirm
        dst = draw_square(dst, keys_dict, char)
    return dst


