import cv2
import os
import glob
import base64_convertor

def main() -> None:
    paths = glob.glob('../jsWebServer/debug/debug_pictures/*')
    for path in paths:
        img = cv2.imread(path)
        img = cv2.resize(img, (200, 200))
        res = base64_convertor.cvToBase64(img)

        fileName = os.path.basename(os.path.normpath(path)).split('.')[0]
        with open(f'../jsWebServer/debug/base64Images/{fileName}.txt', 'w') as f:
            f.write(res[2: -1])    # hack because python writes byteSting as b''

if __name__ == '__main__':
    main()
