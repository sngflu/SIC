import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react'
import axios from 'axios';
import './mainPage.css';
import robot from '../../assets/robot.png';
import cctv from '../../assets/cctv.png';
import hands from '../../assets/hands.png';

const MainPage = () => {
    const fileInputRef = useRef(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const navigate = useNavigate();

    const handleFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleFileSelected = (event) => {
        const selectedFile = event.target.files[0];
        console.log('Selected file: ', selectedFile);
        setIsFileUploaded(true);
        setUploadedFile(selectedFile);
    };

    const sendVideoToBackend = async () => {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            const response = await axios.post('http://127.0.0.1:5173/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response from backend:', response.data);
            navigate('/result', { state: { video_url: response.data.video_url } });
        } catch (error) {
            console.error('Error sending video to backend:', error);
        }
    };

    return (
        <div className="content-main">
            <div className='left'>
                <img src={robot} alt='robot' className='robot'/>
            </div>
            <div className='center'>
                <img src={hands} alt='hands' className='hands' />
                <div>
                    <input
                        type='file'
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileSelected}
                        accept="video/mp4,video/avi,video/quicktime"
                    />
                    {isFileUploaded ? (
                        <div>
                            <div className='buttons'>
                                <button onClick={handleFileUpload}>Upload again</button>
                                <button onClick={sendVideoToBackend}>Detect</button>
                            </div>
                            <p className='file-name'>
                                Uploaded file: {uploadedFile.name}
                            </p>
                        </div>
                    ) : (
                        <button onClick={handleFileUpload}>Open file</button>
                    )}
                </div>
                <p className='center-text'>
                    Upload a video for weapon detection
                </p>
            </div>
            <div className='right'>
                <img src={cctv} alt='cctv' className='cctv'/>
            </div>
        </div>
    );
};

export default MainPage;
