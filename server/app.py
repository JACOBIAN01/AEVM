from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import face_recognition
import firebase_admin
from firebase_admin import credentials, firestore
import random
import base64

app = Flask(__name__)
CORS(app)



# Firebase setup
cred = credentials.Certificate("./firebase-key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


def gen4():
    return f"{random.randint(0, 9999):04d}"


def get_enrolled_faces():
    encodings, ids = [], []
    docs = db.collection("Voters").stream()
    for doc in docs:
        data = doc.to_dict()
        if "EncodedData" in data:
            encodings.append(np.array(data["EncodedData"], dtype=np.float32))
            ids.append(data["ID"])
    return encodings, ids


def decode_base64_image(base64_str):
    image_data = base64.b64decode(base64_str.split(",")[1])
    np_arr = np.frombuffer(image_data, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

@app.route("/enroll", methods=["POST"])
def enroll():
    data = request.get_json()
    if not data or "image" not in data:
        return jsonify({"status": "No image received"})

    name = data.get("name", "Unknown")
    img = decode_base64_image(data["image"])
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    locations = face_recognition.face_locations(rgb)
    encs = face_recognition.face_encodings(rgb, locations)

    if not encs:
        return jsonify({"status": "No face detected"})

    encodings, ids = get_enrolled_faces()
    for e in encs:
        matches = face_recognition.compare_faces(encodings, e, tolerance=0.5)
        if True in matches:
            return jsonify({"status": "Face already registered"})

        vid = gen4()
        db.collection("Voters").document(vid).set({
            "ID": vid,
            "Name": name,
            "EncodedData": e.tolist(),
            "Vote_Eligible": True
        })
        return jsonify({"status": f"New voter '{name}' registered with ID: {vid}"})

@app.route("/verify", methods=["POST"])
def verify():
    data = request.get_json()
    img = decode_base64_image(data["image"])

    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    locations = face_recognition.face_locations(rgb)
    encs = face_recognition.face_encodings(rgb, locations)

    if not encs:
        return jsonify({"status": "No face detected"})

    encodings, ids = get_enrolled_faces()
    for e in encs:
        matches = face_recognition.compare_faces(encodings, e, tolerance=0.5)
        if True in matches:
            i = matches.index(True)
            vid = ids[i]
            voter_doc = db.collection("Voters").document(vid).get()
            if voter_doc.exists:
                voter_data = voter_doc.to_dict()
                control_ref = db.collection("Control").document("VoteTrigger")
                control_ref.set({
                "trigger": "on",
                "vid": vid,
                "timestamp": firestore.SERVER_TIMESTAMP})
                return jsonify({"status": "Verified", "voter": voter_data})
            else:
                return jsonify({"status": "Record not found"})
    return jsonify({"status": "Face not recognized"})



if __name__ == "__main__":
    from waitress import serve # type: ignore
    import os

    port = int(os.environ.get("PORT", 5000))
    print(f"Server running on port {port}")
    serve(app, host="0.0.0.0", port=port)
