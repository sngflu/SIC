from flask import Blueprint, request, jsonify, send_from_directory, make_response
import os
import video_processing

bp = Blueprint('routes', __name__, url_prefix='')

@bp.route('/predict', methods=['POST'])
def processing():
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    filename = file.filename
    file.save(filename)

    confidence_threshold = 0.6
    video_filename, frame_objects, fps = video_processing.process_video(filename, confidence_threshold)
    return jsonify({'video_url': video_filename, 'frame_objects': frame_objects, 'fps': fps}), 200

@bp.route('/video/<path:filename>')
def serve_video(filename):
    return send_from_directory('', filename.split('.')[0] + '.mp4')

@bp.route('/delete_video', methods=['POST'])
def delete_video():
    video_filename = request.json.get('video_filename')

    video_path = os.path.join('', video_filename)
    if os.path.exists(video_path):
        os.remove(video_path)
    else:
        return make_response(jsonify({'message': 'Видеофайл не найден'}), 404)

    folder_path = 'runs'
    if os.path.exists(folder_path):
        video_processing.delete_folder_contents(folder_path)
    else:
        return make_response(jsonify({'message': 'Папка не найдена'}), 404)

    try:
        os.rmdir(folder_path)
    except OSError as e:
        print(e)
        return make_response(jsonify({'message': 'Ошибка при удалении папки'}), 500)

    return jsonify({'message': 'Видео и содержимое папки успешно удалены'}), 200
