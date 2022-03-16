import cv2
import mediapipe as mp
import time


class handDetector():
    def __init__(self, mode=False, maxHands=2, detectionCon=0.5, trackCon=0.5):
        self.mode = mode
        self.maxHands = maxHands
        self.detectionCon = detectionCon
        self.trackCon = trackCon

        self.mpHands = mp.solutions.hands
        self.hands = self.mpHands.Hands(self.mode, self.maxHands,
                                        self.detectionCon, self.trackCon)
        self.mpDraw = mp.solutions.drawing_utils

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

    def findPosition(self, img, handNo=0, draw=True):

        lmList = []
        if self.results.multi_hand_landmarks:
            myHand = self.results.multi_hand_landmarks[handNo]
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


def main():
    pTime = 0
    cTime = 0
    cap = cv2.VideoCapture(1)
    detector = handDetector()
    while True:
        success, img = cap.read()
        img = detector.findHands(img)
        lmList = detector.findPosition(img)
        if len(lmList) != 0:
            print(lmList[4])

        cTime = time.time()
        fps = 1 / (cTime - pTime)
        pTime = cTime

        cv2.putText(img, str(int(fps)), (10, 70), cv2.FONT_HERSHEY_PLAIN, 3,
                    (255, 0, 255), 3)

        cv2.imshow("Image", img)
        cv2.waitKey(1)


if __name__ == "__main__":
    main()