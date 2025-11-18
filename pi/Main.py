import RPi.GPIO as GPIO
from RPLCD.i2c import CharLCD
import time, sys, firebase_admin
from firebase_admin import credentials, firestore
import serial

# ---------------- CONFIG ----------------
CONSTITUENCY = "Vijaywada"
TRIGGER_DOC = "VoteTrigger"
CANDIDATES = {1001: "Kunal", 1002: "Akhshat"}

Current_Voter = {}

# ---------------- LCD Setup ----------------
def init_lcd():
    try:
        lcd = CharLCD(i2c_expander="PCF8574", address=0x27, port=1, cols=16, rows=2)
        lcd.clear()
        lcd.backlight_enabled = True
        return lcd
    except Exception as e:
        print("[ERROR] LCD init failed:", e)
        return None

def lcd_update(lcd, msg):
    if lcd:
        lcd.clear()
        lcd.write_string(msg)
    else:
        print("[LCD MESSAGE]", msg)

# ---------------- GPIO Setup ----------------
def init_gpio():
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)

    pins = {"Green": 23, "White": 25, "Button1": 27, "Button2": 5}

    for led in ["Green", "White"]:
        GPIO.setup(pins[led], GPIO.OUT)
        GPIO.output(pins[led], False)

    for btn in ["Button1", "Button2"]:
        GPIO.setup(pins[btn], GPIO.IN, pull_up_down=GPIO.PUD_UP)

    return pins

# ---------------- Firebase Setup ----------------
def init_firebase():
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate("firebase-key.json")
            firebase_admin.initialize_app(cred)
        print("[INFO] Firebase initialized successfully")
        return firestore.client()
    except Exception as e:
        print("[ERROR] Firebase init failed:", e)
        return None

# ---------------- Upload Vote ----------------
def upload_vote(db, constituency, candidate, retries=3):
    for attempt in range(retries):
        try:
            db.collection("votes").document(constituency).set(
                {candidate: firestore.Increment(1)}, merge=True
            )
            print(f"[INFO] Vote for {candidate} uploaded.")
            return True
        except Exception as e:
            print(f"[WARN] Upload attempt {attempt+1} failed:", e)
            time.sleep(1)
    return False


# ---------------- FINGERPRINT SETUP ----------------
FP_LED_PIN = 17
PORT = "/dev/serial0"
BAUD = 57600

GPIO.setup(FP_LED_PIN, GPIO.OUT, initial=GPIO.LOW)
ser = serial.Serial(PORT, BAUD, timeout=0.2)

GENIMG = b'\xEF\x01\xFF\xFF\xFF\xFF\x01\x00\x03\x01\x00\x05'

def finger_detected():
    ser.write(GENIMG)
    resp = ser.read(12)
    return (len(resp) >= 12 and resp[9] == 0x00)


# ---------------- WAIT FOR TRIGGER + FINGERPRINT ----------------
def wait_for_trigger(db, lcd):
    lcd_update(lcd, "Waiting for face...")
    doc_ref = db.collection("Control").document(TRIGGER_DOC)

    while True:
        try:
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()

                if data.get("trigger") == "on":
                    vid = data.get("vid")
                    print("[TRIGGER] Face verified for VID:", vid)
                    lcd_update(lcd, "Face OK! Finger")

                    # ----------- ADD FINGERPRINT VALIDATION -------------
                    start = time.time()
                    detected = False

                    lcd_update(lcd, "Place Finger...")

                    while time.time() - start < 10:
                        if finger_detected():
                            detected = True
                            print("[FP] Finger detected")
                            GPIO.output(FP_LED_PIN, True)
                            time.sleep(1)
                            GPIO.output(FP_LED_PIN, False)
                            break
                        time.sleep(0.1)

                    if not detected:
                        print("[FP] No Finger detected")
                        lcd_update(lcd, "No Finger! ")
                        doc_ref.update({"trigger": "off"})
                        time.sleep(2)
                        return False

                    # IF FINGER OK → GET VOTER DATA
                    voter_ref = db.collection("Voters").document(vid)
                    voter_data = voter_ref.get()

                    if not voter_data.exists:
                        lcd_update(lcd, "No Record")
                        doc_ref.update({"trigger": "off"})
                        return False

                    voter = voter_data.to_dict()

                    if voter["Vote_Eligible"]:
                        voter_ref.update({"Vote_Eligible": False})
                        Current_Voter["Name"] = voter["Name"]
                        Current_Voter["VID"] = voter["ID"]
                        Current_Voter["Eligible"] = True
                        doc_ref.update({"trigger": "off"})
                        return True
                    else:
                        lcd_update(lcd, "Already Voted!")
                        doc_ref.update({"trigger": "off"})
                        return False

            time.sleep(0.5)

        except Exception as e:
            print("[ERROR] Trigger Check:", e)
            time.sleep(2)

# ---------------- BUTTON VOTING ----------------
def wait_for_button_press(pins):
    while True:
        if GPIO.input(pins["Button1"]) == GPIO.LOW:
            return CANDIDATES[1001]
        elif GPIO.input(pins["Button2"]) == GPIO.LOW:
            return CANDIDATES[1002]
        time.sleep(0.05)

def vote(lcd, pins, db):
    lcd_update(lcd, "Please Vote ->")
    candidate = wait_for_button_press(pins)
    lcd_update(lcd, "-> " + candidate)

    if upload_vote(db, CONSTITUENCY, candidate):
        GPIO.output(pins["Green"], True)
        lcd_update(lcd, "Vote Uploaded!")
        time.sleep(3)
        GPIO.output(pins["Green"], False)
    else:
        lcd_update(lcd, "DB Error Retry")
        time.sleep(2)

# ---------------- CLEANUP ----------------
def cleanup(lcd, pins):
    try:
        for led in ["Green", "White"]:
            GPIO.output(pins[led], False)
        GPIO.output(FP_LED_PIN, False)

        if lcd:
            lcd_update(lcd, "Thank You!")
            time.sleep(2)
            lcd.clear()
            lcd.backlight_enabled = False

        GPIO.cleanup()
    except Exception as e:
        print("[CLEANUP ERROR]", e)

# ---------------- MAIN ----------------
def main():
    lcd = None
    try:
        db = init_firebase()
        if db is None:
            print("[FATAL] Firebase failed")
            return

        pins = init_gpio()
        lcd = init_lcd()

        GPIO.output(pins["White"], True)

        while True:
            if wait_for_trigger(db, lcd):
                vote(lcd, pins, db)
                lcd_update(lcd, "Next Voter...")
                time.sleep(2)
            else:
                lcd_update(lcd, "Rejected")
                time.sleep(3)

    except KeyboardInterrupt:
        cleanup(lcd, pins)

if __name__ == "__main__":
    main()
