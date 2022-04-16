import cv2
import mediapipe as mp
import time


class handDetector():
    def __init__(self, mode=False, maxHands=2, detectionCon=0.5, trackCon=0.5):
        self.draw = mp.solutions.drawing_utils
        self.drawStyle = mp.solutions.drawing_styles
        self.mode = mode
        self.maxHands = maxHands
        self.detectionCon = detectionCon
        self.trackCon = trackCon

        self.mpPose = mp.solutions.pose
        self.pose = self.mpPose.Pose(self.mode, 0, False, min_detection_confidence = 0.9)
        self.mpHands = mp.solutions.hands
        self.hands = self.mpHands.Hands(self.mode, self.maxHands,
                                        self.detectionCon, self.trackCon)
        self.mpDraw = mp.solutions.drawing_utils

    # Finds the hands in the image
    def findHands(self, img, draw=True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(imgRGB)
        # print(results.multi_hand_landmarks)

        if self.results.multi_hand_landmarks:
            for handLms in self.results.multi_hand_landmarks:
                if draw:
                    self.mpDraw.draw_landmarks(img, handLms,
                                               self.mpHands.HAND_CONNECTIONS)
        return img


    # Returns a positional keys array containing hand landmarks
    def findPosition(self, img, handNo=0, draw=True):

        lmList = []
        if(self.useHandNo == -1): # neglect detected hand
            return None

        if self.results.multi_hand_landmarks:
            myHand = self.results.multi_hand_landmarks[self.useHandNo]
            myHandedness = self.results.multi_handedness[self.useHandNo]
            self.detectedSide = myHandedness.classification[0].label
            for id, lm in enumerate(myHand.landmark):
                # print(id, lm)
                h, w, c = img.shape
                cx, cy = int(lm.x * w), int(lm.y * h)
                # print(id, cx, cy)
                lmList.append([id, cx, cy])
                if draw:
                    cv2.circle(img, (cx, cy), 15, (255, 0, 255), cv2.FILLED)

        return lmList

    # returns a dictionary of the sqaure boundries of the detected hand
    def getHandCoordsByKeys(self, keys, f_height, f_width):
        left_most_key = None
        right_most_key = None
        top_most_key = None
        bottom_most_key = None
        left_most_key_val = f_width
        right_most_key_val = 0
        top_most_key_val = f_height
        bottom_most_key_val = 0
        for k in keys:
            if(k[1] < left_most_key_val):
                left_most_key_val = k[1]
                left_most_key = k
            if(k[1] > right_most_key_val):
                right_most_key_val = k[1]
                right_most_key = k
            if(k[2] < top_most_key_val):
                top_most_key_val = k[2]
                top_most_key = k
            if(k[2] > bottom_most_key_val):
                bottom_most_key_val = k[2]
                bottom_most_key = k
        dict = {'left-key':left_most_key, 'left-val':left_most_key_val,
            'right-key':right_most_key, 'right-val':right_most_key_val,
            'top-key':top_most_key, 'top-val':top_most_key_val,
            'bottom-key':bottom_most_key, 'bottom-val':bottom_most_key_val,
            'valid': left_most_key is not None and 
                right_most_key is not None and 
                bottom_most_key is not None and
                top_most_key is not None}

        return dict


    # when pose is valid, choose the hand that is raised (or most likely)
    def filterHands(self, rightPalmPt, leftPalmPt, w, h):
        lms = self.results.multi_hand_landmarks
        if not lms:
            return True
        rightDiff = abs(lms[0].landmark[0].x*w - rightPalmPt[0]) + abs(lms[0].landmark[0].y*h - rightPalmPt[1])
        leftDiff = abs(lms[0].landmark[0].x*w - leftPalmPt[0]) + abs(lms[0].landmark[0].y*h - leftPalmPt[1])

        if len(lms) == 1:
            if(rightDiff < leftDiff and self.currPose['Right'] == 'down'): # detected hand is right hand
                self.useHandNo = -1 # neglect detection
            elif(leftDiff < rightDiff and self.currPose['Left'] == 'down'): # detected hand is left hand
                self.useHandNo = -1 # neglect detection

        if len(lms) > 1:
            if(rightDiff < leftDiff): # index 0 is right hand
                self.useHandNo = 1 if self.currPose['Right'] == 'down' else 0
            else: # index 0 is left hand
                self.useHandNo = 1 if self.currPose['Left'] == 'down' else 0
            
            if(self.currPose['Right'] == 'down' or self.currPose['Left'] == 'down'): # already filtered
                return True
            else: # needs more filter
                if self.currPose['Right'] == 'unknown' and self.currPose['Left'] == 'unknown':
                    return False # both hands are in the picture, no way to identify which is raised
                else:
                    if(rightDiff < leftDiff): # index 0 is right hand
                        self.useHandNo = 0 if self.currPose['Right'] == 'raised' else 1
                    else: # index 0 is left hand
                        self.useHandNo = 0 if self.currPose['Left'] == 'raised' else 1
        return True
                

    # check if the persons pose is valid, filter if it is, return false if not
    def isPoseValid(self, img):
        self.useHandNo = 0
        self.currPose = {'Right': 'unknown', 'Left':'unknown'}
        image_height, image_width, _ = img.shape
        results = self.pose.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

        if(results.pose_landmarks): # pose detected
            rightElbow, rightPalm = results.pose_landmarks.landmark[14], results.pose_landmarks.landmark[16]
            leftElbow, leftPalm = results.pose_landmarks.landmark[13], results.pose_landmarks.landmark[15]
            right_elb_visible = rightElbow.visibility > 0.985 or rightElbow.y < 1
            left_elb_visible = leftElbow.visibility > 0.985 or leftElbow.y < 1
            if right_elb_visible and rightPalm.visibility > 0.9:
                self.currPose['Right'] = 'raised' if rightPalm.y < rightElbow.y else 'down'
            if left_elb_visible and leftPalm.visibility > 0.9:
                self.currPose['Left'] = 'raised' if leftPalm.y < leftElbow.y else 'down'
            
            if ((self.currPose['Right'] == 'raised' and self.currPose['Left'] == 'raised')
                or (self.currPose['Right'] == 'down' and self.currPose['Left'] == 'down')):
                return False
            else:
                return self.filterHands((rightPalm.x*image_width, rightPalm.y*image_height),
                    (leftPalm.x*image_width, leftPalm.y*image_height),
                    image_width,
                    image_height)
        else: # no pose detected (no person on frame)
            lms = self.results.multi_hand_landmarks
            if lms:
                return len(lms) <= 1
        return True
