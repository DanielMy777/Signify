from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import cv2
from base64_convertor import base64ToCv
import sys
#sys.path.append('../Detect Engine')
#import signify

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


    def do_POST(self):
        print('in post request')
        body = self.get_body()
        img_64 = body['img']
        
        self.show_cv_img(base64ToCv(img_64))
        self.write_string(json.dumps('img recived succesfully'))

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
    port = 2718
    server = HTTPServer(('', port), ServiceHandler)
    print(f'Server running on port {port}')
    server.serve_forever()


main()


