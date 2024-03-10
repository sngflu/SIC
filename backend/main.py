from ultralytics import YOLO
from ultralytics.engine import results
from flask import Flask, request, jsonify, send_from_directory, make_response
from flask_cors import CORS
import os
from moviepy.editor import *
import cv2

app = Flask(__name__)
CORS(app)

model = YOLO("yolov8s_plus_e200_bs16.pt", verbose=False)

video_directory = 'runs/detect/predict/'

# convert output video to .mp4
def convert_avi_to_mp4(input_file, output_file):
    video = VideoFileClip(input_file)
    video.write_videofile(output_file, codec='libx264')

# process video file uploaded by the user 
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

# process the video file to apply model
def process_video(filename):
    cap = cv2.VideoCapture(filename)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print("Количество кадров в видео:", total_frames)
    cap.release()

    model(filename, save=True, save_txt=True)

    video_filename = filename.split('.')[0] + '.avi'
    os.remove(filename)
    convert_avi_to_mp4(os.path.join(video_directory, video_filename), filename.split('.')[0] + '.mp4')
    return filename.split('.')[0] + '.mp4'

# serve the processed video file
@app.route('/video/<path:filename>')
def serve_video(filename):
    return send_from_directory('', filename.split('.')[0] + '.mp4')

# delete all data
@app.route('/delete_video', methods=['POST'])
def delete_video():
    video_filename = request.json.get('video_filename')

    # delete video
    video_path = os.path.join('', video_filename)
    if os.path.exists(video_path):
        os.remove(video_path)
    else:
        return make_response(jsonify({'message': 'Видеофайл не найден'}), 404)

    # delete contents of the folder
    folder_path = 'runs'
    if os.path.exists(folder_path):
        delete_folder_contents(folder_path)
    else:
        return make_response(jsonify({'message': 'Папка не найдена'}), 404)

    # delete folder
    try:
        os.rmdir(folder_path)
    except OSError as e:
        print(e)
        return make_response(jsonify({'message': 'Ошибка при удалении папки'}), 500)

    return jsonify({'message': 'Видео и содержимое папки успешно удалены'}), 200

def delete_folder_contents(folder_path):
    # delete all files inside the folder
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path): 
                delete_folder_contents(file_path)
                os.rmdir(file_path)
        except Exception as e:
            print(e)

if __name__ == '__main__':
    app.run(debug=True, port=5173)