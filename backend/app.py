from flask import Flask, request, jsonify
import pdfplumber
import spacy

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        text = extract_text_from_pdf(file)
        details = extract_details(text)
        return jsonify(details), 200

def extract_text_from_pdf(file):
    with pdfplumber.open(file) as pdf:
        text = ''
        for page in pdf.pages:
            text += page.extract_text()
    return text

def extract_details(text):
    doc = nlp(text)
    details = {"name": "", "phone_number": "", "address": ""}
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            details["name"] = ent.text
        elif ent.label_ == "PHONE_NUMBER":
            details["phone_number"] = ent.text
        elif ent.label_ == "GPE":
            details["address"] = ent.text
    return details

if __name__ == '__main__':
    app.run(debug=True)
