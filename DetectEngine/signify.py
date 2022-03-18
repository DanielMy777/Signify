# %% [markdown]
# # Epsilon Team

# ======= Disable Warnings
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

# ====== Constants
IM_SIZE = 300
ERROR = (0, 0, 255)
WARNING = (255, 255, 0)

# ====== Hand Detector
detector = htm.handDetector(detectionCon=1)
confirmer = Confirmer(hand='right')

# ====== Neural Network
str_device = "cuda" if torch.cuda.is_available() else "cpu"
device = torch.device(str_device)
model = torch.hub.load('ultralytics/yolov5', 'custom', path='./Weights/best.pt')

# ====== Results
prev_results = []
identified = None
printed_iden = None
printed_ctr = 0

# %%
# ====== Debugging tools
cv2.namedWindow('out',cv2.WINDOW_NORMAL)
cv2.resizeWindow('out', 500,600)

cv2.namedWindow('outi',cv2.WINDOW_NORMAL)
cv2.resizeWindow('outi', IM_SIZE,IM_SIZE)

# ====== Import a video (0 for webcam)
cap = cv2.VideoCapture('media/input-main.mp4')
if (cap.isOpened() == False):
  print("Error opening video file")

orig_frame_width = frame_width = int(cap.get(3))
orig_frame_height = frame_height = int(cap.get(4))

# %%

# ========= identification - currently for testing use only ==========
def check_identify(char):
    global identified
    if(char == '!'):
        return None 
    prev_results.append(char)
    if(len(prev_results) > 20):
        prev_results.pop(0)
    if(prev_results.count(char) > 15):
        identified = char
        prev_results.clear()

def print_identify(img, char):
    global printed_iden
    global printed_ctr
    if(char is not None):
        printed_iden = char
    if(printed_iden is not None):
        mid_wid = int(orig_frame_width / 2)
        cv2.putText(
                img, printed_iden,
                (50, 100), 
                cv2.FONT_HERSHEY_SIMPLEX, 3, (0,255,255), 15, cv2.LINE_AA)
        cv2.putText(
                img, "Identified",
                (130, 100), 
                cv2.FONT_HERSHEY_SIMPLEX, 2, (255,0,255), 5, cv2.LINE_AA)

        printed_ctr += 1
        if(printed_ctr == 15):
            printed_ctr = 0
            printed_iden = None
            
    return img
# ========= END ==========


# ====== Prevent false detection of un-raised hand (Temporary solution)
def delete_low_keys(keys):
    if(len(keys) == 0):
        return None

    max_key = keys[0]
    for k in keys:
        if(k[2] > max_key[2]):
            max_key = k

    good_keys = []
    for k in keys:
        if(k[2] < max_key[2] + 300) and (k[2] < orig_frame_height/2):
            good_keys.append(k)

    if(len(good_keys) != 21):
        return None

    return good_keys


# ====== Recieve a normalized image, send it to detection and return the letter detected
def compare_to_db(img):
    best_match = '!'
    best_match_score = 0
    detect = model(img).pandas().xyxy[0]
    for index, row in detect.iterrows():
        if(row['confidence'] > best_match_score):
            best_match = row['name']
            best_match_score = row['confidence']

    return (best_match, best_match_score)

# ====== Recieve an image, pad it into an IM_SIZExIM_SIZE picture with black border
def pad_image(img):
    height, width, channels = img.shape
    dst = np.full((IM_SIZE,IM_SIZE, channels), (0,0,0), dtype=np.uint8)
    x_center = int((IM_SIZE - width) / 2)
    y_center = int((IM_SIZE - height) / 2)
    dst[y_center:y_center+height, 
       x_center:x_center+width] = img
    
    return dst

# ====== Recieve hand keys, return 30% of hand size
def get_hand_measures(keys_dict):
    width = keys_dict['right-val'] - keys_dict['left-val']
    height = keys_dict['bottom-val'] - keys_dict['top-val']
    res = max(int(width*0.3), int(height*0.3))
    return res

# ====== Recieve image and hand keys, return sub-image containing the hand in proportional size
def cut_hand(img, keys_dict):
    if not keys_dict['valid']:
        return None
    else:
        padding = get_hand_measures(keys_dict)
        top_left_point = (keys_dict['left-val'] - padding, keys_dict['top-val'] - padding)
        bottom_right_point = (keys_dict['right-val'] + padding, keys_dict['bottom-val'] + padding)
        # check if out of bounds
        if any(x < 0 for x in set(top_left_point)) or bottom_right_point[0] >= orig_frame_width or bottom_right_point[1] >= orig_frame_height:
            return None
        
        dst = img.copy()[top_left_point[1] : bottom_right_point[1], top_left_point[0] : bottom_right_point[0]]
        return dst

# ====== Recieve image and hand keys, return the best match detection for this image
def get_match(img, keys):
    sec_char = '!'

    img = pad_image(img)
    cv2.imshow('outi',img)
    
    curr_char = compare_to_db(img)[0]

    if(not confirmer.confirm(curr_char, keys)):
        sec_char = curr_char
        curr_char = '!'

    if(curr_char == '!'):
        curr_char = confirmer.semantic_corrent(sec_char, keys)
        if(curr_char == '!'):
            curr_char = confirmer.semantic_corrent(curr_char, keys)

    return curr_char

# ====== Recieve image, hand keys, and letter. Draws these results on the image
def draw_square(img, keys_dict, letter):
    if not keys_dict['valid']:
        return img
    else:
        dst = img.copy()
        padding = max(get_hand_measures(keys_dict), int(max(orig_frame_width, orig_frame_height) / 64))
        top_left_p = (keys_dict['left-val'] - padding, keys_dict['top-val'] - padding)
        bottom_right_p = (keys_dict['right-val'] + padding, keys_dict['bottom-val'] + padding)
        dst = cv2.rectangle(dst, top_left_p, bottom_right_p, (0,255,0), 2, cv2.LINE_AA)
        cv2.putText(
            dst, letter,
            (top_left_p[0], top_left_p[1]-10), 
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 3, cv2.LINE_AA)
        return dst

# ====== Write a message on the frame
def write_message(src, message, type):
    cv2.putText(
            src, message,
            (50,50), 
            cv2.FONT_HERSHEY_SIMPLEX, 1, type, 3, cv2.LINE_AA)

# ====== Process a single image (or video frame)
def process_image(img):
    dst = img.copy()
    cropped_img = img[0:int(orig_frame_height/2), :]
    marked_img = detector.findHands(cropped_img)
    keys = detector.findPosition(marked_img, draw=False)
    high_hand_keys = delete_low_keys(keys)
    if(high_hand_keys is None): # no hand detected
        write_message(dst, "Unable To Read", ERROR)
    else:
        keys_dict = detector.getHandCoordsByKeys(high_hand_keys, orig_frame_height, orig_frame_width)
        cut_img = cut_hand(dst, keys_dict)
        if(cut_img is None): # hand detected, but to close to edges
            write_message(dst, "Please centrelize your hand", ERROR)
        else: # good hand positioning
            char = get_match(cut_img, high_hand_keys)
            check_identify(char)
            dst = draw_square(dst, keys_dict, char)
    return dst

# %%
# ## -Main code snippet-
# ## Read each frame of the source video, process it, and paste it on the output video.
out = cv2.VideoWriter('output1.avi',cv2.VideoWriter_fourcc('M','J','P','G'), 30, (orig_frame_width,orig_frame_height))
while(cap.isOpened()):
    ret, frame = cap.read()

    if ret == True:
        reframe = process_image(frame)
        reframe = print_identify(reframe, identified)
        if(identified is not None):
            identified = None
    else:
        break

    out.write(reframe)
    cv2.imshow('out', reframe)

    if cv2.waitKey(10) & 0xFF == ord('q'):
        break



cap.release()
out.release()
cv2.destroyAllWindows()

# %%
