import cv2
import os
from moviepy.editor import *
import model

video_directory = 'runs/detect/predict/'

def convert_avi_to_mp4(input_file, output_file):
    video = VideoFileClip(input_file)
    video.write_videofile(output_file, codec='libx264')

def process_video(filename, confidence_threshold=0.25):
    cap = cv2.VideoCapture(filename)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print("Количество кадров в видео:", total_frames)
    cap.release()

    model.model(filename, save=True, save_txt=True, conf=confidence_threshold)

    video_filename = filename.split('.')[0] + '.avi'
    os.remove(filename)
    convert_avi_to_mp4(os.path.join(video_directory, video_filename), filename.split('.')[0] + '.mp4')
    return filename.split('.')[0] + '.mp4'

def delete_folder_contents(folder_path):
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
