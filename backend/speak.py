import sys
from gtts import gTTS
from playsound import playsound
import os

def main():
    if len(sys.argv) < 3:
        print("Usage: python speak.py \"text\" \"lang_code\"")
        sys.exit(1)

    text = sys.argv[1]
    lang = sys.argv[2]

    try:
        tts = gTTS(text=text, lang=lang)
        filename = "voice.mp3"
        tts.save(filename)
        playsound(filename)
        os.remove(filename)
    except Exception as e:
        print(f"Error in speech synthesis: {e}")

if __name__ == "__main__":
    main()
