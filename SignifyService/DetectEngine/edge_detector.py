from unittest import skipUnless
import cv2
from cv2 import cvtColor
import numpy as np
import glob
from signify import cut_hand, flip_image, get_match, pad_image
import hand_detector as htm


IM_SIZE = 300

cv2.namedWindow('out', cv2.WINDOW_NORMAL)
cv2.resizeWindow('out', 500, 600)

letter_detector = htm.handDetector(detectionCon=1)


file_names = glob.glob('./SignifyService/DetectEngine/model_trainer/original/*')
n = len(file_names)
i = 1
for name in file_names:
    img = cv2.imread(name)

    dst = img.copy()
    h, w, _ = dst.shape
    char = '!'
    marked_img = letter_detector.findHands(img)
    if not letter_detector.isPoseValid(dst): # invalid position
        print(name, "Please raise one hand")
        continue
    keys = letter_detector.findPosition(marked_img, draw=False)
    if(keys is None or len(keys) == 0): # no hand detected
        print(name, "Unable To Read")
        continue
    else:
        keys_dict = letter_detector.getHandCoordsByKeys(keys, h, w)
        cut_img = cut_hand(dst, keys_dict)
        if(cut_img is None): # hand detected, but to close to edges
            print(name, "Please centrelize your hand")
            continue
        else: # good hand positioning
            fixed_img, fixed_keys = flip_image(cut_img, keys, w, letter_detector.detectedSide)
            padded = pad_image(fixed_img)
            gaus = cv2.GaussianBlur(padded, (5,5), 10)
            canny = cv2.Canny(gaus, 60, 120)
            new_path = "./SignifyService/DetectEngine/model_trainer/canny/" + name.split("\\")[-1]
            cv2.imwrite(new_path, canny)
    print(f"Done {i} from {n}")
    i += 1