import RPi.GPIO as GPIO # type: ignore
from RPLCD.i2c import CharLCD
import time, sys, firebase_admin
from firebase_admin import credentials, firestore

# ---------------- CONFIG ----------------
CONSTITUENCY = "Vijaywada"
TRIGGER_DOC = "VoteTrigger"  # Firestore document name
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


# ---------------- Wait for Trigger ----------------
def wait_for_trigger(db, lcd):
    lcd_update(lcd, "Waiting for face")
    doc_ref = db.collection("Control").document(TRIGGER_DOC)

    while True:
        try:
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()
                if data.get("trigger") == "on":
                    print("[TRIGGER] Face verified! Starting vote...")
                    lcd_update(lcd, "Face Verified ")
                    doc_ref.update({"trigger": "off"})
                    vid = data.get("vid")
                    voter_ref = db.collection("Voters").document(vid)
                    voter_data = voter_ref.get()
                    Current_Voter = {
                        "Name":voter_data.get("Name"),
                        "VID":voter_data.get("ID"),
                        "Eligible":voter_data.get("Vote_Eligible")
                    }
                    if(voter_data.get("Vote_Eligible")):
                        voter_ref.update({"Vote_Eligible":False})
                        return True
                    else:
                        return False
            time.sleep(1)
        except Exception as e:
            print("[ERROR] Trigger check failed:", e)
            time.sleep(2)

# ---------------- Button Voting ----------------
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
        lcd_update(lcd, "DB Error! Retry")
        time.sleep(2)

# ---------------- Cleanup ----------------
def cleanup(lcd, pins):
    try:
        for led in ["Green", "White"]:
            GPIO.output(pins[led], False)
        if lcd:
            lcd_update(lcd, "Thank You!")
            time.sleep(2)
            lcd.clear()
            lcd.backlight_enabled = False
        GPIO.cleanup()
    except Exception as e:
        print("[CLEANUP ERROR]", e)

# ---------------- Main ----------------
def main():
    lcd = None
    try:
        db = init_firebase()
        if db is None:
            print("[FATAL] Firebase not initialized. Exiting.")
            return

        pins = init_gpio()
        lcd = init_lcd()
        GPIO.output(pins["White"], True)

        while True:
            if wait_for_trigger(db, lcd):
                
                vote(lcd, pins, db)
                lcd_update(lcd, "Waiting next voter")
                time.sleep(2)
            else:
                lcd_update(lcd,"Duplicate Voter Found!")
                time.sleep(5)
                lcd_update(lcd,"Waiting next Voter")

    except KeyboardInterrupt:
        cleanup(lcd, pins)
    except Exception as e:
        print("[MAIN ERROR]", e)
        cleanup(lcd, pins)

if __name__ == "__main__":
    main()


    # LCD (16x2) connected via I2C module (PCF8574)
    # I2C Connections:
    # ----------------------------------------
    # LCD SDA -> Pi SDA (GPIO2, Physical Pin 3)
    # LCD SCL -> Pi SCL (GPIO3, Physical Pin 5)
    # VCC (LCD) -> 5V (Physical Pin 2)
    # GND (LCD) -> GND (Physical Pin 6)
    # ----------------------------------------
    # Address may vary: 0x27 or 0x3F

    # Raspberry Pi GPIO Pin Mapping:
    # -------------------------------------------------------
    # Component     | GPIO No. | Physical Pin | Direction
    # -------------------------------------------------------
    # Green LED     | GPIO 23  | Pin 16       | Output
    # White LED     | GPIO 25  | Pin 22       | Output
    # Button 1      | GPIO 27  | Pin 13       | Input (Pull-up)
    # Button 2      | GPIO 5   | Pin 29       | Input (Pull-up)
    # -------------------------------------------------------