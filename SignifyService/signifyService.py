import sys
import os
import time
import json

procNum = 0 if len(args := (sys.argv)) <= 1 else int(args[1])
logger = open(f"debug/script_out{procNum}.log", 'w')

abs_dir = os.path.abspath( os.path.dirname( __file__ ))
sys.path.append(abs_dir)                                # path will contain this dir no matter the script exec point

logger.write(f'script {procNum} starting.\n')
logger.flush()

try:
    import DetectEngine.signify as signify
    from base64_convertor import base64ToCv
except ImportError as ie:
    logger.write('import error...\n')
    logger.write(ie.msg)
    logger.close()
    exit(1)

logger.write('after imports\n')
logger.flush()

def main() -> None:
    print('ready', end='')      # signals the server that the process is ready
    sys.stdout.flush()
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
            res_object = {"hands":{"handsRect":res},"sign":{"char":"!","detected":False}}
            print(f'{json.dumps(res_object)}\n', end='')
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
