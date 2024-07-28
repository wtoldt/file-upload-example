from flask import Flask, request, jsonify
import csv
import io
import datetime

app = Flask(__name__)

def tprint(message):
  now = datetime.datetime.now()
  timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
  print(f"[{timestamp}] {message}")

def csv_to_json(csv_file):
    """Converts a CSV file to a JSON object."""
    data = []
    csv_data = csv_file.read().decode('utf-8')
    with io.StringIO(csv_data) as f:
        csv_file = csv.DictReader(f)
        for row in csv_file:
            data.append(row)
    return data

@app.route('/upload', methods=['POST'])
def upload_file():
    tprint("Upload file request received")
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if file and file.filename.endswith('.csv'):
        tprint("File received: " + file.filename)
        try:
            json_data = csv_to_json(file)
            return jsonify({'rows': json_data})
        except csv.Error as e:
          return f"Error parsing CSV: {str(e)}", 400
        except Exception as e:
            return f"Unexpected error: {str(e)}", 500
    else:
        return 'Invalid file type; must end with .csv', 400

if __name__ == '__main__':
    app.run(debug=True)
