import sys
import base64
import os
import time

# -------------------------------- imports for testing -------------------------------- #

# ======= Disable Warnings
from importlib.resources import path
from multiprocessing.connection import wait
from time import sleep
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
# import hand_detector as htm
# from sign_confirmer import Confirmer
from click import confirm
import mediapipe as mp

# -------------------------------- imports for testing -------------------------------- #


def main() -> None:
    while True:
        inp = sys.stdin.readline().rstrip('\n')
        time.sleep(3)
        print(f'inp = {inp}, inp[::-1] = {inp[::-1]}\n', end='')
        
        sys.stdout.flush()
        

if __name__ == '__main__':
    main()
