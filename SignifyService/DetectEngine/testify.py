import cv2
import glob
import os
import sys

import hand_detector as htm
from sign_confirmer import Confirmer
from word_detector import wordDetector
from word_confirmer import wordConfirmer

cv2.namedWindow('out', cv2.WINDOW_NORMAL)
cv2.resizeWindow('out', 500, 600)

abs_dir = os.path.abspath( os.path.dirname( __file__ ))
sys.path.append(abs_dir)


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

letter_detector = htm.handDetector(detectionCon=1)
letter_confirmer = Confirmer(hand='right')
word_detector = wordDetector()
word_confirmer = wordConfirmer()

def get_rect_2_hand(img):
    coords = {'th': 0, 'x1': 0, 'y1': 0, 'h1': 0, 'w1': 0, 'x2': 0, 'y2': 0, 'h2': 0, 'w2': 0, 'v': 1, 'msg': "OK"}
    dst = img.copy()
    h, w, _ = dst.shape
    pose_val = word_detector.detect_pose(dst)
    if not pose_val[0]: # invalid position
        coords['v'] = 0
        coords['msg'] = pose_val[1]
    else:
        num_hands = 2 if word_detector.hand2 is not None else 1
        for i in range(1, num_hands+1):
            keys_dict = word_detector.hand1 if i==1 else word_detector.hand2
            padding = max(get_hand_measures(keys_dict), int(max(w, h) / 64))
            top_left_p = (keys_dict['left-val'] - padding, keys_dict['top-val'] - padding)
            bottom_right_p = (keys_dict['right-val'] + padding, keys_dict['bottom-val'] + padding)
            coords['x' + str(i)] = round(top_left_p[0])
            coords['y' + str(i)] = round(top_left_p[1])
            coords['w' + str(i)] = round((bottom_right_p[0] - top_left_p[0]))
            coords['h' + str(i)] = round((bottom_right_p[1] - top_left_p[1]))
        if num_hands == 2:
            coords['th'] = 1
            if(((coords["x1"] >= coords["x2"] and coords["x1"] <= coords["x2"] + coords["w2"]) or 
                (coords["x2"] >= coords["x1"] and coords["x2"] <= coords["x1"] + coords["w1"])) and
                ((coords["y1"] >= coords["y2"] and coords["y1"] <= coords["y2"] + coords["h2"]) or 
                (coords["y2"] >= coords["y1"] and coords["y2"] <= coords["y1"] + coords["h1"]))): # Overlap
                coords['th'] = 0
                xmin = 1 if min(coords["x1"], coords["x2"]) == coords["x1"] else 2
                ymin = 1 if min(coords["y1"], coords["y2"]) == coords["y1"] else 2
                xmax = 1 if xmin == 2 else 2
                ymax = 1 if ymin == 2 else 2
                x = min(coords["x1"], coords["x2"])
                y =  min(coords["y1"], coords["y2"])
                wid = coords["x" + str(xmax)] - coords["x" + str(xmin)] + coords["w" + str(xmax)]
                hei = coords["y" + str(ymax)] - coords["y" + str(ymin)] + coords["h" + str(ymax)]
                coords["x1"] = x
                coords["y1"] = y
                coords["w1"] = wid
                coords["h1"] = hei

    return coords

file_names = glob.glob(abs_dir + "/../Resources/Words-sml/*.jpg")
num_files = len(file_names)
curr_file = 1


# ===== Main Code
def main():
    global curr_file
    # Add each picure to dataframe to create dataset
    for pic in file_names:
        img = cv2.imread(pic)
        rect = get_rect_2_hand(img)
        if(rect["v"] == 0):
            print(pic, rect["msg"])
        else:
            top_left_p = (rect["x1"], rect["y1"])
            bottom_right_p = (rect["x1"] + rect["w1"], rect["y1"] + rect["h1"])
            dst = cv2.rectangle(img, top_left_p, bottom_right_p, (0,255,0), 2, cv2.LINE_AA)
            if rect["th"] == 1:
                top_left_p = (rect["x2"], rect["y2"])
                bottom_right_p = (rect["x2"] + rect["w2"], rect["y2"] + rect["h2"])
                dst = cv2.rectangle(img, top_left_p, bottom_right_p, (0,255,0), 2, cv2.LINE_AA)
            cv2.imshow("out", dst)
            cv2.waitKey()
        

if __name__ =='__main__':
    main()