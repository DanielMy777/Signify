from click import confirm
import cv2
import mediapipe as mp
import numpy as np

sign_undetected = ['!']
sign_points = ['D', 'U', 'K', 'Z', 'R']
sign_fists = ['A', 'E', 'M', 'N', 'S', 'T']

class Confirmer:
    def __init__(self, hand='right'):
        self.hand = hand

    def confirm(self, char, keys):
        # cant use torch with python 3.10 /// cant use match with python 3.9
        if char == 'A':
            return self.confirm_a(keys)
        if char == 'B':
            return self.confirm_b(keys)
        if char == 'C':
            return self.confirm_c(keys)
        if char == 'D':
            return self.confirm_d(keys)
        if char == 'E':
            return self.confirm_e(keys)
        if char == 'F':
            return self.confirm_f(keys)
        if char == 'G':
            return self.confirm_g(keys)
        if char == 'H':
            return self.confirm_h(keys)
        if char == 'I':
            return self.confirm_i(keys)
        if char == 'J':
            return self.confirm_j(keys)
        if char == 'K':
            return self.confirm_k(keys)
        if char == 'L':
            return self.confirm_l(keys)
        if char == 'M':
            return self.confirm_m(keys)
        if char == 'N':
            return self.confirm_n(keys)
        if char == 'O':
            return self.confirm_o(keys)
        if char == 'P':
            return self.confirm_p(keys)
        if char == 'Q':
            return self.confirm_q(keys)
        if char == 'R':
            return self.confirm_r(keys)
        if char == 'S':
            return self.confirm_s(keys)
        if char == 'T':
            return self.confirm_t(keys)
        if char == 'U':
            return self.confirm_u(keys)
        if char == 'V':
            return self.confirm_v(keys)
        if char == 'W':
            return self.confirm_w(keys)
        if char == 'X':
            return self.confirm_x(keys)
        if char == 'Y':
            return self.confirm_y(keys)
        if char == 'Z':
            return self.confirm_z(keys)
        else:
            return True

    def confirm_a(self, keys):
        return (((keys[4][1] > keys[7][1] and keys[4][1] > keys[17][1]) or (keys[4][1] < keys[7][1] and keys[4][1] < keys[17][1])) and
        keys[4][2] < keys[3][2] and #thumb is open and beside index (both sides)
        not self.is_finger_2_open(keys) and 
        not self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys))

    def confirm_b(self, keys):
        return (not self.is_finger_1_open(keys) and 
        self.is_finger_2_open(keys) and 
        self.is_finger_3_open(keys) and 
        self.is_finger_4_open(keys) and 
        self.is_finger_5_open(keys)) 

    def confirm_c(self, keys):
        return True #todo

    def confirm_d(self, keys):
        return (not self.is_finger_1_open(keys) and 
        self.is_finger_2_open(keys) and 
        not self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys)) 

    def confirm_e(self, keys):
        return (not self.is_finger_1_open(keys) and 
        not self.is_finger_2_open(keys) and 
        not self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys) and
        keys[3][2] > keys[8][2]) # thumb is lower than index 

    def confirm_f(self, keys):
        return (not keys[8][2] < keys[12][2] and
        not self.is_finger_2_open(keys) and 
        self.is_finger_3_open(keys) and 
        self.is_finger_4_open(keys) and 
        self.is_finger_5_open(keys)) 

    def confirm_g(self, keys):
        return (keys[4][1] < keys[2][1] and     # only thumb and index pointing right
        keys[8][1] < keys[6][1] and
        keys[12][1] > keys[10][1] and
        keys[16][1] > keys[14][1] and
        keys[20][1] > keys[18][1])

    def confirm_h(self, keys):
        return (keys[4][1] < keys[2][1] and     # only thumb, index and middle pointing right
        keys[8][1] < keys[6][1] and
        keys[12][1] < keys[10][1] and
        keys[16][1] > keys[14][1] and
        keys[20][1] > keys[18][1])

    def confirm_i(self, keys):
        return (not self.is_finger_1_open(keys) and 
        not self.is_finger_2_open(keys) and 
        not self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        self.is_finger_5_open(keys) and
        keys[20][2] < keys[3][2]) # differ from j

    def confirm_j(self, keys):
        return (keys[20][2] > keys[3][2]) # tricky todo

    def confirm_k(self, keys):
        return (keys[4][2] < keys[5][2] and #thumb higher than index base
        keys[4][1] < keys[5][1] and keys[4][1] > keys[9][1] and # thumb between index and middle
        self.is_finger_2_open(keys) and 
        self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys)) 

    def confirm_l(self, keys):
        return (self.is_finger_1_open(keys) and 
        self.is_finger_2_open(keys) and 
        not self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys))  

    def confirm_m(self, keys):
        return (keys[20][2] > keys[2][2] and
        not keys[16][2] > keys[2][2] and
        not self.is_finger_2_open(keys) and 
        not self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys)) 

    def confirm_n(self, keys):
        return (keys[4][1] < keys[11][1] and keys[4][1] > keys[15][1] and #thumb between 3 & 4
        keys[4][2] < keys[13][2] and
        not self.is_finger_2_open(keys) and 
        not self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys))  

    def confirm_o(self, keys):
        return True # need circle

    def confirm_p(self, keys):
        return True # good detection, nothing similar 

    def confirm_q(self, keys):
        return True # good detection, nothing similar  

    def confirm_r(self, keys):
        return (not self.is_finger_1_open(keys) and 
        self.is_finger_2_open(keys) and 
        self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys) and
        keys[8][1] < keys[12][1]) # index is left to middle

    def confirm_s(self, keys):
        return (not self.is_finger_1_open(keys) and
        not self.is_finger_2_open(keys) and 
        not self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys) and
        keys[3][2] < keys[12][2] and # thumb is above middle - differ from E
        keys[4][1] > keys[14][1]) # thumb is not far back near pinkie - differ from M

    def confirm_t(self, keys):
        return (keys[4][1] < keys[6][1] and keys[4][1] > keys[10][1] and #thumb between 3 & 4
        not self.is_finger_2_open(keys) and 
        not self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys)) 

    def confirm_u(self, keys):
        return (not self.is_finger_1_open(keys) and 
        self.is_finger_2_open(keys) and 
        self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys) and
        keys[8][1] > keys[12][1]) # index is right to middle

    def confirm_v(self, keys):
        return ((keys[4][2] > keys[5][2] or keys[4][1] < keys[5][2]) and # thumb lower than index base or past it - differ from K
        not self.is_finger_1_open(keys) and 
        self.is_finger_2_open(keys) and 
        self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys))

    def confirm_w(self, keys):
        return (not self.is_finger_1_open(keys) and 
        self.is_finger_2_open(keys) and 
        self.is_finger_3_open(keys) and 
        self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys)) 

    def confirm_x(self, keys):
        return (not self.is_finger_1_open(keys) and 
        keys[8][2] > keys[7][2] and # index tip lower than knuckle 
        keys[8][2] < keys[5][2] and # index tip higher than base 
        keys[4][2] < keys[12][2] and # thumb is up - differ from E
        not self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        not self.is_finger_5_open(keys)) 

    def confirm_y(self, keys):
        return (self.is_finger_1_open(keys) and 
        not self.is_finger_2_open(keys) and 
        not self.is_finger_3_open(keys) and 
        not self.is_finger_4_open(keys) and 
        self.is_finger_5_open(keys))  

    def confirm_z(self, keys):
        index_heights = [keys[8][2], keys[7][2], keys[6][2], keys[5][2]]
        for h in index_heights:
            diff = abs(h-keys[6][2])
            if(diff > 10 or diff < -10):
                return False        # not pointing towards camera
        return (keys[10][1] > keys[9][1] and
        keys[14][1] > keys[13][1] and
        keys[18][1] > keys[17][1]) # pointing at camera and fist closed

    def confirm_space(self, keys):
        heights = [k[2] for k in keys]
        ind = np.argpartition(heights, 3)[:3]
        if 2 in ind and 3 in ind and 4 in ind:
            return True
        return False


    # finger 1 = thumb
    # finger 5 = pinkie

    #right hand only!!
    #spin may be needed

    def is_finger_1_open(self, keys):
        return keys[4][1] > keys[3][1]
    def is_finger_2_open(self, keys):
        return keys[8][2] < keys[6][2]
    def is_finger_3_open(self, keys):
        return keys[12][2] < keys[10][2]
    def is_finger_4_open(self, keys):
        return keys[16][2] < keys[14][2]
    def is_finger_5_open(self, keys):
        return keys[20][2] < keys[18][2]

    

    def semantic_corrent(self, char, keys):
        if(char in sign_undetected): # handle undetecteds
            if(self.confirm_space(keys)):
                return ' '
            if(self.confirm_i(keys)):
                return 'I'
            if(self.confirm_f(keys)):
                return 'F'
            if(self.confirm_x(keys)):
                return 'X'
            if(self.confirm_z(keys)):
                return 'Z'
            if(self.confirm_d(keys)):
                return 'D'
            if(self.confirm_b(keys)):
                return 'B'
            if(self.confirm_e(keys)):
                return 'E'
        elif(char in sign_points):
            if(self.confirm_x(keys)):
                return 'X'
            if(self.confirm_d(keys)):
                return 'D'
            if(self.confirm_r(keys)):
                return 'R'
            if(self.confirm_k(keys)):
                return 'K'
            if(self.confirm_z(keys)):
                #return 'Z'
                return '!'
        elif(char in sign_fists):
            return self.detect_fist(keys)

        return '!'

    
    def detect_angle(self, keys):
        p1 = (keys[5][1], keys[5][2])
        p2 = (keys[17][1], keys[17][2])
        ang1 = np.arctan2(*p1[::-1])
        ang2 = np.arctan2(*p2[::-1])
        return (np.rad2deg((ang1 - ang2) % (2 * np.pi)))


    def rotate_key(self, p, origin, degrees=0):
        angle = np.deg2rad(degrees)
        R = np.array([[np.cos(angle), -np.sin(angle)],
                    [np.sin(angle),  np.cos(angle)]])
        o = np.atleast_2d(origin)
        p = np.atleast_2d(p)
        return np.squeeze((R @ (p.T-o.T) + o.T).T)


    #0 - Thumb, 4 - Pinkie
    def decide_fist(self, fist_keys, tip_heights):
        if (max(tip_heights) == tip_heights[0]):
            return 'E'

        elif (fist_keys[0][1] > fist_keys[1][1] and fist_keys[0][1] > fist_keys[2][1] and
            fist_keys[0][0] > fist_keys[3][0] and fist_keys[0][0] > fist_keys[4][0] and
            fist_keys[0][0] < fist_keys[1][0] and
            abs(fist_keys[0][0] - fist_keys[2][0]) < abs(fist_keys[0][0] - fist_keys[3][0])):
            return 'S'

        elif fist_keys[0][0] > fist_keys[1][0]:
            return 'A'
        elif fist_keys[0][0] > fist_keys[2][0] and fist_keys[0][1] < fist_keys[2][1]:
            return 'T'
        elif fist_keys[0][1] < fist_keys[3][1]:
            return 'N'
        elif fist_keys[0][1] < fist_keys[4][1] and fist_keys[0][1] > fist_keys[3][1]:
            return 'M'
        else:
            return '!'


    def detect_fist(self, keys, imsize = 300):
        angle = Confirmer.detect_angle(None, keys)
        
        fist_keys = []
        tip_heights = []
        base = tuple(np.array((imsize, imsize)) / 2)
        for i in [4, 6, 10, 14, 18]:
            fist_keys.append(Confirmer.rotate_key(None, (keys[i][1], keys[i][2]), base, angle))
        for j in [4, 8, 12, 16, 20]:
            tip_heights.append(keys[j][2])

        return Confirmer.decide_fist(None, fist_keys, tip_heights)



# import hand_detector as htm
# detector = htm.handDetector(detectionCon=1)
# img = cv2.imread("SignifyService/DetectEngine/test/9.jpg")
# marked_img = detector.findHands(img)
# detector.isPoseValid(marked_img)
# keys = detector.findPosition(marked_img, draw=False)

# print(Confirmer.detect_fist(keys))

# angle = Confirmer.detect_angle(None, keys)

# fist_keys = []
# tip_heights = []
# base = image_center = tuple(np.array(img.shape[1::-1]) / 2)
# for i in [4, 6, 10, 14, 18]:
#     fist_keys.append(Confirmer.rotate_key(None, (keys[i][1], keys[i][2]), base, angle))
# for j in [4, 8, 12, 16, 20]:
#     tip_heights.append(keys[j][2])

# print(keys[4], keys[6], keys[10], keys[14], keys[18])
# print(fist_keys)

# print(Confirmer.decide_fist(None, fist_keys, tip_heights))