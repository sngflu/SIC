import { Link } from 'react-router-dom';
import './resultPage.css'
import ReactPlayer from 'react-player'
import vid from './sample-5s.mp4'

const ResultPage = () => {
    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = vid;
        a.download = 'result.mp4';
        a.click();
    };

    return (
        <div className='content-result'>
            <div className='player-wrapper'>
                <ReactPlayer url={vid} width="45vw" height="50vh"
                    controls className='react-player' />
            </div>
            <div className='buttons'>
                <Link to='/'>
                    <button>Home</button>
                </Link>
                <button onClick={handleDownload}>Download</button>
            </div>
        </div>
    )
} 

export default ResultPage;
