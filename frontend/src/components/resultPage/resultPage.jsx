import { Link, useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import './resultPage.css';

const ResultPage = () => {
    const { state } = useLocation();
    const videoUrl = 'http://127.0.0.1:5173/video/' + state.video_url;

    // download handler
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

    // delete video and directory handler
    const handleDelete = () => {
        fetch('http://127.0.0.1:5173/delete_video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ video_filename: state.video_url })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Video and directory deleted');
                } else {
                    console.error('Error deleting video and directory');
                }
            })
            .catch(error => console.error('Error deleting video and directory:', error));
    };

    // return page
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
                <Link to='/' onClick={handleDelete}>
                    <button>Home</button>
                </Link>
                <button onClick={handleDownload}>Download</button>
            </div>
        </div>
    );
};

export default ResultPage;
