import sys
import base64


def main() -> None:
    image_64_decode = base64.b64decode(sys.argv[1])
    print(image_64_decode)

if __name__ == '__main__':
    main()
