from sklearn.preprocessing import OneHotEncoder
from word_detector_dataset_creator import process_word_image, cols
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

def detect_word(img):
    test_df = pd.DataFrame([],[], columns=cols)
    values = process_word_image(img, "Proc Image\\test")
    test_df.loc[len(test_df.index)] = values
    one_handed = test_df["One_Handed"][0]
    X_test = test_df.iloc[:, :-1].drop(columns="One_Handed")
    if one_handed:
        predictions = model_one_handed.predict(X_test)
    else:
        predictions = model_two_handed.predict(X_test)

    return predictions[0]
