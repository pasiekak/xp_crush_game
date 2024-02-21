import './endgame.css';
import Rating from './rating/rating';
import SoundPlayer from '../soundPlayer/SoundPlayer';
import { useEffect } from 'react';
const Endgame = ({restart, score, goal}) => {
    const soundPlayer = new SoundPlayer()

    useEffect(() => {
        soundPlayer.playSound('endGame')
    }, [])

    return ( 
        <div className="endgame">
            <div>
                <span className='end-title'>Koniec gry</span>
            </div>
            <div>
                <span>Wynik:</span>
                <span>{score}</span>
            </div>
            <Rating score={score} goal={goal}/>
            <div>
                <button onClick={() => restart()}>Spróbuj jeszcze raz</button>
            </div>
        </div>
    );
}
 
export default Endgame;