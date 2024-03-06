import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import './mainPage.css';
import robot from '../assets/robot.png';
import cctv from '../assets/cctv.png';
import hands from '../assets/hands.png';

const MainPage = () => {
    
    const fileInputRef = useRef(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);

    const handleFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleFileSelected = (event) => {
        const selectedFile = event.target.files[0];
        console.log('Selected file: ', selectedFile);
        setIsFileUploaded(true);
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
                        <div className='buttons'>
                            <button onClick={handleFileUpload}>Upload again</button>
                            <Link to='/result'>
                                <button>Detect</button>
                            </Link>
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