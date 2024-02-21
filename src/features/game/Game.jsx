import { useState } from 'react';

import Board from '../board/Board';
import Statistics from '../statistics/Statistics';
import Endgame from '../endgame/Endgame';
import SoundPlayer from '../soundPlayer/SoundPlayer';

import './game.css'
import Welcome from '../welcome-page/Welcome';

const Game = () => {
    const [points, setPoints] = useState(0);
    const [moves, setMoves]  = useState(10);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameEnded, setIsGameEnded] =  useState(false);
    const [isGameStarting, setIsGameStarting] = useState(false);
    const [showGame, setShowGame] = useState(false);
    const [backgroundPlayer, setBackgroundPlayer] = useState(null);
    const [backgroundMuted, setBackgroundMuted] = useState(false);

    const cols = 8;
    const rows = 10;
    const goal = 2500;
    const refreshRatio = 100; // as miliseconds
    const scoreMultiplier = 10;
    const soundPlayer = new SoundPlayer();

    const startGame = () => {
        if(!isGameStarted) {
            setIsGameStarted(true);
        }
    }

    const restart = () => {
        setIsGameStarting(!isGameStarting);
        setIsGameEnded(false);
        setIsGameStarted(false);
        setMoves(10);
        setPoints(0);
    }

    const showGameBoard = () => {
        setShowGame(true);
        const freshBackgroundPlayer = soundPlayer.getBackgroundPlayer();
        freshBackgroundPlayer.volume = 0.03;
        freshBackgroundPlayer.loop = true;
        freshBackgroundPlayer.play();
        setBackgroundPlayer(freshBackgroundPlayer);
        soundPlayer.playSound('startGame');
    }

    const endGame = () => {
        setIsGameEnded(true);
    }

    const addPoints = (points) => {
        if(isGameStarted) setPoints(prevPoints => prevPoints + points);
    }

    const decMoves = () => {
        setMoves(prev => prev-1);
    }

    return (
        <div className="game gradient-background">
            {showGame ? <>
            <button 
                className='volume-button'
                onClick={() => {
                    setBackgroundPlayer(prev => {
                        prev.volume = prev.volume === 0 ? 0.03 : 0
                        setBackgroundMuted(prev => !prev);
                        return prev
                    })
                }}>
                {backgroundMuted ?
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89z"/>
                    <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                }
            </button>
            <span id='gametitle'>XP CRUSH</span>
            <Statistics points={points} moves={moves} goal={goal}/>
            <Board cols={cols} rows={rows} 
            refreshRatio={refreshRatio}
            moves={moves}
            scoreMultiplier={scoreMultiplier}
            startGame={startGame} 
            showSpinner={!isGameStarted} 
            addPoints={addPoints} 
            decMoves={decMoves} 
            endGame={endGame}
            isGameStarting={isGameStarting}/>
            {isGameEnded && <Endgame score={points} restart={restart} goal={goal}/>}
            </> : 
            <Welcome cols={cols} rows={rows} goal={goal} moves={moves} showGameBoard={showGameBoard} playBackground/>}
        </div>
    );
}
 
export default Game;