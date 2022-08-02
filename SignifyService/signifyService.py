import sys
import os
import time
import json

abs_dir = os.path.abspath( os.path.dirname( __file__ ))

procNum = 0 if len(args := (sys.argv)) <= 1 else int(args[1])
logger = open(f"{abs_dir}/debug/script_out{procNum}.log", 'w')

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

def createSignObject(img_cv, is_letter: bool):
    start = time.time()
    res2 = signify.process_image(img_cv, is_letter)
    logger.write(f'time for detection = {time.time() - start}\n')
    logger.write(f'detected char = {res2[0]}\n')
    logger.flush()
    sign_obj = {"char": res2[0], "detected": res2[0] != '!', "is_word": not is_letter}
    return sign_obj

def createResponse(img_cv, detectSign: bool, is_letter: bool):
    start = time.time()
    res = signify.get_rect(img_cv,is_letter)
    logger.write(f'time for get_rect = {time.time() - start}\n')
    logger.flush()

    res_object = {"hands": {"handsRect": res}}
    if detectSign:
        res_object = {"hands": {"handsRect": res}, "sign": createSignObject(img_cv, is_letter)}

    return res_object

def main() -> None:
    useCuda = len(args := sys.argv) < 2 or args[2].lower() != 'cpu'
    try:
        signify.setupTorchModel(useCuda)
    except Exception as e:
        logger.write(f'exception at signify.setupTorchModel(useCuda)...\n')
        logger.write(str(e))
        logger.close()
        exit(1)
    detectSign = len(args := sys.argv) < 3 or args[3].lower() != 'nosigndetection'
    logger.write(f'useCuda = {useCuda}\n')
    logger.write(f'detectSign = {detectSign}\n')
    logger.write('starting service\n')
    logger.flush()
    print('ready', end='')      # signals the server that the process is ready
    sys.stdout.flush()
    while True:
        try:
            server_input = sys.stdin.readline().rstrip('\n')
            is_letter = server_input[-1] == '1'
            img_base64 = server_input[:-1]
            logger.write(f'img_base64 length = {len(img_base64)}\n')
            logger.write(f'is_letter = {is_letter}\n')
            logger.flush()
            img_cv = base64ToCv(img_base64)
            res_object = createResponse(img_cv, detectSign, is_letter)
            res_json = json.dumps(res_object)
            logger.write(f'{res_json}\n')
            logger.flush()
            print(f'{res_json}\n', end='')
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
