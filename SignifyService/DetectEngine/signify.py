# %% [markdown]
# # Epsilon Team

import sys
import os

abs_dir = os.path.abspath( os.path.dirname( __file__ ))
sys.path.append(abs_dir)                                # path will contain this dir no matter the script exec point

# ======= Disable Warnings
import warnings
from cv2 import waitKey
warnings.filterwarnings("ignore")

# ======= Imports
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
FISTS = ['A', 'S', 'T', 'N', 'N', 'E'] # HARD

# ====== Hand Detector
detector = htm.handDetector(detectionCon=1)
confirmer = Confirmer(hand='right')

# ====== Neural Network
model = None
device = None
def setupTorchModel(useCuda: bool) -> None:       # if imported the importing module has to call setupTorchModel
    global model
    global device
    str_device = "cuda" if torch.cuda.is_available() and useCuda else "cpu"
    device = torch.device(str_device)
    model = torch.hub.load('ultralytics/yolov5', 'custom', path=(abs_dir + '/../Weights/best.pt'))

# ====== Results
prev_results = []
identified = None
printed_iden = None
printed_ctr = 0


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
    h, w, _ = img.shape
    if(char is not None):
        printed_iden = char
    if(printed_iden is not None):
        mid_wid = int(w / 2)
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
    if(height >= 300 or width >= 300):
        img = cv2.resize(img, (300,300))
        height, width, channels = img.shape
    dst = np.full((IM_SIZE,IM_SIZE, channels), (0,0,0), dtype=np.uint8)
    x_center = int((IM_SIZE - width) / 2)
    y_center = int((IM_SIZE - height) / 2)
    dst[y_center:y_center+height, 
       x_center:x_center+width] = img
    
    return dst

# ====== Recieve image and hand keys, Flip an image horizontally, and the keys accordingly
def flip_image(img, keys, orig_width, handType):
    if handType == 'Right':
        img = cv2.flip(img, 1)
        for k in keys:
            k[1] = orig_width - k[1]
    return (img, keys)


# ====== Recieve hand keys, return 30% of hand size
def get_hand_measures(keys_dict):
    width = keys_dict['right-val'] - keys_dict['left-val']
    height = keys_dict['bottom-val'] - keys_dict['top-val']
    res = max(int(width*0.3), int(height*0.3))
    return res

# ====== Recieve image and hand keys, return sub-image containing the hand in proportional size
def cut_hand(img, keys_dict):
    h, w, _ = img.shape
    if not keys_dict['valid']:
        return None
    else:
        padding = get_hand_measures(keys_dict)
        top_left_point = (keys_dict['left-val'] - padding, keys_dict['top-val'] - padding)
        bottom_right_point = (keys_dict['right-val'] + padding, keys_dict['bottom-val'] + padding)
        # check if out of bounds
        if any(x < 0 for x in set(top_left_point)) or bottom_right_point[0] >= w or bottom_right_point[1] >= h:
            return None
        
        dst = img.copy()[top_left_point[1] : bottom_right_point[1], top_left_point[0] : bottom_right_point[0]]
        return dst

# ====== Recieve image and hand keys, return the best match detection for this image
def get_match(img, keys):
    sec_char = '!'

    img = pad_image(img)
    
    curr_char = compare_to_db(img)[0]

    if curr_char in FISTS:
        curr_char = confirmer.detect_fist(keys)
    elif(not confirmer.confirm(curr_char, keys)):
        sec_char = curr_char
        curr_char = '!'

    if(curr_char == '!'):
        curr_char = confirmer.semantic_corrent(sec_char, keys)
        if(curr_char == '!'):
            curr_char = confirmer.semantic_corrent(curr_char, keys)

    return curr_char

# ====== Recieve image, hand keys, and letter. Draws these results on the image
def draw_square(img, keys_dict, letter):
    h, w, _ = img.shape
    if not keys_dict['valid']:
        return img
    else:
        dst = img.copy()
        padding = max(get_hand_measures(keys_dict), int(max(w, h) / 64))
        top_left_p = (keys_dict['left-val'] - padding, keys_dict['top-val'] - padding)
        bottom_right_p = (keys_dict['right-val'] + padding, keys_dict['bottom-val'] + padding)
        dst = cv2.rectangle(dst, top_left_p, bottom_right_p, (0,255,0), 2, cv2.LINE_AA)
        cv2.putText(
            dst, letter,
            (top_left_p[0], top_left_p[1]-10), 
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 3, cv2.LINE_AA)
        return dst


# ====== Get the bounding rectange coordinates for the detected hand
def get_rect(img):
    coords = {'x': 0, 'y': 0, 'h': 0, 'w': 0, 'v': 1, 'msg': "OK"}
    dst = img.copy()
    h, w, _ = dst.shape
    marked_img = detector.findHands(dst)
    if not detector.isPoseValid(dst): # invalid position
        coords['v'] = 0
        coords['msg'] = "Please raise one hand"
    else:
        keys = detector.findPosition(marked_img, draw=False)
        if(keys is None or len(keys) == 0): # no hand detected
            coords['v'] = 0
            coords['msg'] = "No hand detected"
        else:
            keys_dict = detector.getHandCoordsByKeys(keys, h, w)
            cut_img = cut_hand(dst, keys_dict)
            if(cut_img is None): # hand detected, but to close to edges
                coords['v'] = 0
                coords['msg'] = "Please centralize your hand"
            padding = max(get_hand_measures(keys_dict), int(max(w, h) / 64))
            top_left_p = (keys_dict['left-val'] - padding, keys_dict['top-val'] - padding)
            bottom_right_p = (keys_dict['right-val'] + padding, keys_dict['bottom-val'] + padding)
            coords['x'] = round((top_left_p[0] / w) * 100)
            coords['y'] = round((top_left_p[1] / h) * 100)
            coords['w'] = round(((bottom_right_p[0] - top_left_p[0]) / w) * 100)
            coords['h'] = round(((bottom_right_p[1] - top_left_p[1]) / h) * 100)

    return coords

            

# ====== Write a message on the frame
def write_message(src, message, type):
    cv2.putText(
            src, message,
            (50,50), 
            cv2.FONT_HERSHEY_SIMPLEX, 1, type, 3, cv2.LINE_AA)


# ====== Process a single image (or video frame)
def process_image(img):
    dst = img.copy()
    h, w, _ = dst.shape
    char = '!'
    marked_img = detector.findHands(img)
    if not detector.isPoseValid(dst): # invalid position
        write_message(dst, "Please raise one hand", WARNING)
        return (char, dst)
    keys = detector.findPosition(marked_img, draw=False)
    if(keys is None or len(keys) == 0): # no hand detected
        write_message(dst, "Unable To Read", ERROR)
    else:
        keys_dict = detector.getHandCoordsByKeys(keys, h, w)
        cut_img = cut_hand(dst, keys_dict)
        if(cut_img is None): # hand detected, but to close to edges
            write_message(dst, "Please centrelize your hand", ERROR)
        else: # good hand positioning
            fixed_img, fixed_keys = flip_image(cut_img, keys, w, detector.detectedSide)
            char = get_match(fixed_img, fixed_keys)
            check_identify(char)
            dst = draw_square(dst, keys_dict, char)
    return (char, dst)


# ===== Main code snippet
def main():
    global identified
    # setup torch
    setupTorchModel(useCuda=True)

    # create and resize windows for visual debugging
    cv2.namedWindow('out', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('out', 500, 600)
    cv2.namedWindow('outi', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('outi', IM_SIZE, IM_SIZE)

    # load a video file (0 for webcam)
    cap = cv2.VideoCapture(0)
    if (cap.isOpened() == False):
        print("Error opening video file")
    orig_frame_width = frame_width = int(cap.get(3))
    orig_frame_height = frame_height = int(cap.get(4))

    # create an output file
    out = cv2.VideoWriter('output1.avi', cv2.VideoWriter_fourcc('M', 'J', 'P', 'G'), 30,
                          (orig_frame_width, orig_frame_height))

    # send the input stream frame by frame for detection
    while (cap.isOpened()):
        ret, frame = cap.read()

        if ret == True:
            char, reframe = process_image(frame)
            reframe = print_identify(reframe, identified)
            if (identified is not None):
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


if __name__ =='__main__':
    main()


