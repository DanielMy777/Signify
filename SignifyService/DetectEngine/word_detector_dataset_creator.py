import sys
import os
import glob
import cv2
import mediapipe as mp
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
import copy

# cv2.namedWindow('out', cv2.WINDOW_NORMAL)
# cv2.resizeWindow('out', 500, 600)

abs_dir = os.path.abspath( os.path.dirname( __file__ ))
sys.path.append(abs_dir)                 # path will contain this dir no matter the script exec point

# Prepare mediapipe
mp_draw = mp.solutions.drawing_utils
mp_drawStyle = mp.solutions.drawing_styles
mp_mode = True
mp_maxHands = 2
mp_detectionCon = 0.5
mp_trackCon = 0.5

mp_mpPose = mp.solutions.pose
mp_pose = mp_mpPose.Pose(mp_mode, 1, False, min_detection_confidence = 0.9)
mp_mpHands = mp.solutions.hands
mp_hands = mp_mpHands.Hands(mp_mode, mp_maxHands,
                                1, mp_detectionCon)
mpDraw = mp.solutions.drawing_utils

# Extract all pictures
file_names = glob.glob(abs_dir + "/../Resources/Words-sml/*.jpg")
num_files = len(file_names)
curr_file = 1

# Create initial dataframe to hold data
cols = ["One_Handed", "Face_Hand_X", "Face_Hand_Y", "Hand_Elbow_X", "Hand_Elbow_Y" ,"Tip_1_X", "Tip_1_Y",
"Tip_2_X", "Tip_2_Y", "Tip_3_X", "Tip_3_Y", "Tip_4_X", "Tip_4_Y", "Tip_5_X", "Tip_5_Y", "Word"]
data = pd.DataFrame([],[], columns=cols)

# Funcs
def get_real_lms(h, w, lm):
    return int(lm.x * w), int(lm.y * h)

def extract_data(file, w, h, hand_lms, pose_lms):
    y_norm = h // (pose_lms[24][1] - pose_lms[12][1])
    x_norm = w // (pose_lms[11][0] - pose_lms[12][0])
    values = []
    values.append(1 if (pose_lms[24][1] < pose_lms[22][1] or pose_lms[24][1] < pose_lms[21][1]) else 0)
    face_hand = (pose_lms[0][0] - pose_lms[16][0], pose_lms[0][1] - pose_lms[16][1])
    hand_elb = (pose_lms[16][0] - pose_lms[14][0], pose_lms[16][1] - pose_lms[14][1])
    values.append(face_hand[0] // x_norm)
    values.append(face_hand[1] // y_norm)
    values.append(hand_elb[0] // x_norm)
    values.append(hand_elb[1] // y_norm)
    for tip_ind in [4, 8, 12, 16, 20]:
        values.append((hand_lms[tip_ind][0] - hand_lms[0][0]) // x_norm)
        values.append((hand_lms[tip_ind][1] - hand_lms[0][1]) // y_norm)
    
    values.append(file.split("-")[0])
    
    return values
    

def process_word_image(img, file_name, is_check):
    h, w, _ = img.shape
    pose_results = mp_pose.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    hand_results = mp_hands.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

    if not pose_results.pose_landmarks:
        raise Exception(f"Undetected body")
    
    pose_vis = [lm.visibility for lm in pose_results.pose_landmarks.landmark][:23]
    if(any(np.array(pose_vis) < 0.5)):
        raise Exception(f"Invalid pose")

    if not hand_results.multi_hand_landmarks:
        raise Exception(f"Undetected hands")

    pose_lms = [get_real_lms(h, w, lm) for lm in pose_results.pose_landmarks.landmark]
    pose_per = ((pose_lms[24][1] - pose_lms[12][1]) / h) * 100
    if (pose_per > 40):
        raise Exception("Please move further")  
    if (pose_per < 20):
        raise Exception("Please move closer")
    
    left_down = pose_lms[22][1] > pose_lms[24][1]
    right_down = pose_lms[21][1] > pose_lms[23][1]
    if(left_down and right_down):
        raise Exception("Please raise a hand")
    
    hand_rect_res = copy.copy(hand_results)
    if len(hand_results.multi_hand_landmarks) == 2:
        hand0x = hand_results.multi_hand_landmarks[0].landmark[4].x
        hand1x = hand_results.multi_hand_landmarks[1].landmark[4].x
        leftx = pose_results.pose_landmarks.landmark[22].x
        left_hand_num = 0 if abs(hand0x - leftx) < abs(hand1x - leftx) else 1
        
        if left_down:
            hand_rect_res.multi_hand_landmarks[0] = hand_results.multi_hand_landmarks[1-left_hand_num]
            del hand_rect_res.multi_hand_landmarks[1]
        elif right_down:
            hand_rect_res.multi_hand_landmarks[0] = hand_results.multi_hand_landmarks[left_hand_num]
            del hand_rect_res.multi_hand_landmarks[1]

    if(len(hand_rect_res.multi_hand_landmarks) == 1 and
        hand_rect_res.multi_hand_landmarks[0].landmark[4].y > pose_results.pose_landmarks.landmark[23].y):
        raise Exception("Please retry")

    if is_check:
        return (hand_rect_res, pose_results)

    hand_no = 0 if (len(hand_results.multi_hand_landmarks) == 1 or 
        hand_results.multi_handedness[0].classification[0].label == "Left") else 1
    hand_lms = [get_real_lms(h, w, lm) for lm in hand_results.multi_hand_landmarks[hand_no].landmark]

    values = extract_data(file_name.split("\\")[-1], w, h, hand_lms, pose_lms)

    return values # OK

# ===== Main Code
def main():
    global curr_file
    # Add each picure to dataframe to create dataset
    for pic in file_names:
        img = cv2.imread(pic)
        
        try:
            values = process_word_image(img, pic, False)
        except Exception as e:
            print(pic, str(e))
            continue
        if(values is not None):
            data.loc[len(data.index)] = values
            print(f"Processed file {curr_file} out of {num_files}\n")
            curr_file += 1

    # Turn dataset to excel format
    data.to_csv(abs_dir + "/../Resources/WordData.csv", index=False)

if __name__ =='__main__':
    main()