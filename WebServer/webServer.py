import os
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import datetime
import cv2
import time
from base64_convertor import base64ToCv, cvToBase64
import base64
import sys
sys.path.append('../DetectEngine')
from signify import get_rect,process_image,setupTorchModel

number = 0
setupTorchModel(useCuda = True)

def remove_files_from_folder(fname):
    images_names = os.listdir(fname)
    for image_name in images_names:
        os.remove(f'{fname}\\{image_name}')

def remove_file(fname):
    try:
        os.remove(fname)
    except:
        pass

remove_files_from_folder('images')
remove_files_from_folder('recivedimages')
remove_file('log.txt')
remove_file('currchar.txt')



def calculate_time(fun):
    start_time = datetime.datetime.now()
    fun()
    end_time = datetime.datetime.now()
    time_diff = (end_time - start_time)
    execution_time = time_diff.total_seconds() * 1000
    return execution_time





class ServiceHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('content-type', 'text/html')
        self.end_headers()
        self.wfile.write('get orik'.encode())


    def show_img(self, path):
        img = cv2.imread(path)
        cv2.imshow('image', img)
        cv2.waitKey(500)
        cv2.destroyAllWindows()

    def show_cv_img(self, img):
        cv2.imshow('image', img)
        cv2.waitKey(500)
        cv2.destroyAllWindows()

    def write_log(self,log):
        log_file = open('log.txt','a')
        log_file.write('\n')
        log_file.write(log)
        log_file.close()

    def get_call_number(self):
        global number
        number+=1
        return number

    def get_request_type(self):
        self.HANDS1 = "Hands1"
        self.HANDS2 = "Hands2"
        self.Word = "Word"
        self.Letter = "Letter"
        detectSign = "Sign" in self.path or "Word" in self.path
        detectType = self.HANDS1
        if "Sign" in self.path:
            detectType = self.Letter
        elif "Word" in self.path:
            detectType = self.Word
        elif "2Hands" in self.path:
            detectType = self.HANDS2
        return detectSign,detectType


    def do_POST(self):
        detectSign,detectType = self.get_request_type()
        body = self.get_body()
        img_64 = body['img']
        img_cv = base64ToCv(img_64)
        #self.show_cv_img(img_cv)
        print('in post request')
        print(f'request = {detectType}')
        #return
        start_time = time.time()
        hand_rectangle = get_rect(img_cv,detectType == self.Letter or detectType == self.HANDS1)
        print(f'time process get_rect = {time.time() - start_time}')
        #res,res_img = process_image(img_cv) if detectSign else [['!'],None]
        res,res_img = ['!'],None
        if detectSign:
            res,res_img = process_image(img_cv,detectType == self.Letter)

        if detectSign and hand_rectangle['msg'] == 'OK':
            print('time to process ',time.time()-start_time)
            self.write_log(f'detected text = {res}')
            cv2.imwrite(f'images\\{self.get_call_number()}.jpeg',res_img)
        detect_obj = {"char": res, "detected": res !='!',"is_word": detectType == self.Word}

        res_object = {"hands": {"handsRect": hand_rectangle}, "sign": detect_obj if detectSign else None}
        self.write_json(res_object)

    def write_json(self, obj):
        self.write_string(json.dumps(obj))

    def save_img(self, i_img, path):
        image_result = open(path, 'wb')  # create a writable image and write the decoding result
        image_result.write(i_img)
        image_result.close()

    def write_response(self, content):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(content)

        print(self.headers)
        print(content.decode('utf-8'))

    def get_body(self):
        content_length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(content_length)
        body = body.decode('utf-8')
        body_dict = json.loads(body)
        return body_dict

    def write_string(self, content):
        self.send_response(200)
        self.send_header('content-type', 'application/json')
        self.end_headers()
        self.wfile.write(content.encode())


def main():
    port = 3000
    server = HTTPServer(('', port), ServiceHandler)
    print(f'Server running on port {port}')
    server.serve_forever()


main()


