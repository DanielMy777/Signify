from sklearn.preprocessing import OneHotEncoder
from word_detector_dataset_creator import process_word_image, get_real_lms, cols
import sys
import os
import glob
import cv2
import mediapipe as mp
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV

abs_dir = os.path.abspath( os.path.dirname( __file__ ))
sys.path.append(abs_dir)                 # path will contain this dir no matter the script exec point

# import the data
data = pd.read_csv(abs_dir + "/../Resources/WordData.csv")

# Transform the data
one_handed_data = data[data["One_Handed"] == 1]
two_handed_data = data[data["One_Handed"] == 0]

X_one_handed = one_handed_data.iloc[:,:-1].drop(columns="One_Handed")
Y_one_handed = one_handed_data["Word"]

X_two_handed = two_handed_data.iloc[:,:-1].drop(columns="One_Handed")
Y_two_handed = two_handed_data["Word"]

# Create ML model
model_one_handed = RandomForestClassifier(random_state=42, criterion='entropy', max_features=None)
model_two_handed = RandomForestClassifier(random_state=42, criterion='entropy', max_features=None)
model_one_handed.fit(X_one_handed, Y_one_handed)
model_two_handed.fit(X_two_handed, Y_two_handed)


class wordDetector:
    def __init__(self):
        self.model_one_handed = model_one_handed
        self.model_two_handed = model_two_handed


    def detect_word(self, img):
        test_df = pd.DataFrame([],[], columns=cols)
        try:
            values = process_word_image(img, "Proc Image\\test", False)
        except: 
            return '!'
        test_df.loc[len(test_df.index)] = values
        one_handed = test_df["One_Handed"][0]
        X_test = test_df.iloc[:, :-1].drop(columns="One_Handed")
        if one_handed:
            predictions = self.model_one_handed.predict(X_test)
        else:
            predictions = self.model_two_handed.predict(X_test)

        return predictions[0]


    def get_hands_coords(self, h, w, hand_no, hand_lms):
        coords_x = [get_real_lms(h, w, lm)[0] for lm in hand_lms.multi_hand_landmarks[hand_no].landmark]
        coords_y = [get_real_lms(h, w, lm)[1] for lm in hand_lms.multi_hand_landmarks[hand_no].landmark]
        vals = {'left-val': min(coords_x), 'right-val': max(coords_x),
            'top-val': min(coords_y), 'bottom-val': max(coords_y)}
        
        return vals

    
    def detect_pose(self, img):
        try:
            h, w, _ = img.shape
            hand_lms, pose_lms = process_word_image(img, "Proc Image\\check", True)
            if len(hand_lms.multi_hand_landmarks) < 2:
                hand_no = 0
            else:
                hand_no = 0 if hand_lms.multi_hand_landmarks[0].landmark[0].x < hand_lms.multi_hand_landmarks[1].landmark[0].x else 1
            self.pose = [get_real_lms(h, w, lm) for lm in pose_lms.pose_landmarks.landmark]
            self.hand = [get_real_lms(h, w, lm) for lm in hand_lms.multi_hand_landmarks[hand_no].landmark]
            self.hand1 = self.get_hands_coords(h, w, 0, hand_lms)
            if len(hand_lms.multi_hand_landmarks) > 1:
                self.hand2 = self.get_hands_coords(h, w, 1, hand_lms)
            else:
                self.hand2 = None

            return (True, "OK")
        except Exception as e:
            return (False, str(e))

