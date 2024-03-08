import { Link, useLocation } from 'react-router-dom';
import './resultPage.css';
import ReactPlayer from 'react-player';

const ResultPage = () => {
    const { state } = useLocation();
    const videoUrl = 'http://127.0.0.1:5173/video/' + state.video_url;

    const handleDownload = () => {
        fetch(videoUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', state.video_url);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(error => console.error('Error downloading the video:', error));
    };

    return (
        <div className='content-result'>
            <div className='player-wrapper'>
                <ReactPlayer
                    url={videoUrl}
                    width="45vw"
                    height="50vh"
                    controls
                    className='react-player'
                />
            </div>
            <div className='buttons'>
                <Link to='/'>
                    <button>Home</button>
                </Link>
                <button onClick={handleDownload}>Download</button>
            </div>
        </div>
    );
};

export default ResultPage;
