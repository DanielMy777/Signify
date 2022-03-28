import sys
import base64
import os
import time

procNum = 0 if len(args := (sys.argv)) <= 1 else int(args[1])
logger = open(f"debug/script_out{procNum}.log", 'w')

# -------------------------------- imports for testing -------------------------------- #

# ======= Disable Warnings
from importlib.resources import path
from multiprocessing.connection import wait
from time import sleep
import warnings
logger.write('after first imports\n')
logger.flush()

from cv2 import waitKey
warnings.filterwarnings("ignore")

# ======= Imports
import sys
import os
from sys import platform
import argparse
from scipy import ndimage
import numpy as np
logger.write('after numpy imports\n')
logger.flush()
import torch
import torchvision
import torch.nn as nn
import torch.optim as optim
logger.write('after torch imports\n')
logger.flush()
import matplotlib.pyplot as plt
import cv2
logger.write('after cv2 imports\n')
logger.flush()
from glob import glob
# import hand_detector as htm
# from sign_confirmer import Confirmer
from click import confirm
import mediapipe as mp
import json

import sys
sys.path.append('../DetectEngine')
try:
    import signify
except ImportError as ie:
    logger.write('import error at signify\n')
    logger.write(ie.msg)
    logger.close()
    exit(1)

logger.write('after signify imports\n')
logger.flush()
from base64_convertor import base64ToCv 

def main() -> None:
    logger.write('starting service\n')
    logger.flush()
    while True:
        try:
            img_base64 = sys.stdin.readline().rstrip('\n')
            logger.write(f'img_base64 length = {len(img_base64)}\n')
            logger.flush()
            img_cv = base64ToCv(img_base64)
            start = time.time()
            res = signify.get_rect(img_cv)
            logger.write(f'time for get_rect = {time.time() - start}\n')
            res2 = signify.process_image(img_cv)
            logger.write(f'time for detection = {time.time() - start}\n')
            logger.write(f'detected char = {res2[0]}\n')
            logger.flush()
            print(f'{json.dumps(res)}\n', end='')
        except KeyboardInterrupt:
            logger.write('keyBoardInterrupt...\n')
            logger.close()
            exit(1)
        except Exception as e:
            logger.write(str(e) + '\n')
            logger.flush()
            print('error\n',end='')
        sys.stdout.flush()

        
        

if __name__ == '__main__':
    main()
