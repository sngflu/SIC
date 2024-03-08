from ultralytics import YOLO
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from moviepy.editor import *

app = Flask(__name__)
CORS(app)

model = YOLO("yolov8s_plus_e200_bs16.pt")
video_directory = 'runs/detect/predict/'

def convert_avi_to_mp4(input_file, output_file):
    video = VideoFileClip(input_file)
    video.write_videofile(output_file, codec='libx264')

@app.route('/predict', methods=['POST'])
def processing():
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    filename = file.filename
    file.save(filename)

    video_filename = process_video(filename)

    return jsonify({'video_url': video_filename}), 200

def process_video(filename):

    model(filename, save=True)

    video_filename = filename.split('.')[0] + '.avi'
    os.remove(filename)
    convert_avi_to_mp4(os.path.join(video_directory, video_filename), filename.split('.')[0] + '.mp4')
    return filename.split('.')[0] + '.mp4'

@app.route('/video/<path:filename>')
def serve_video(filename):
    return send_from_directory('', filename.split('.')[0] + '.mp4')

if __name__ == '__main__':
    app.run(debug=True, port=5173)
