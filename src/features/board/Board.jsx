import { useCallback, useEffect, useState } from 'react';

import { verifyMove, prepareBoard, matching, crushing, getNewRandomTile } from '../../utils/utils';

import SoundPlayer from '../soundPlayer/SoundPlayer';
import Tile from './tile/Tile';
import Spinner from '../spinner/Spinner';

import './board.css';


const Board = ({cols, rows, startGame, showSpinner, addPoints, moves, decMoves, endGame, isGameStarting, refreshRatio, scoreMultiplier}) => {
    const [board, setBoard] = useState([]);
    const [haveBoardEmptyTiles, setHaveBoardEmptyTiles] = useState(false);
    const [startDragPosition, setStartDragPosition] = useState(null);
    const [replaceDragPosition, setReplaceDragPosition] = useState(null);
    const style = {
        gridTemplateColumns: `repeat(${cols}, 40px)`,
        gridTemplateRows: `repeat(${rows}, 40px)`
    };
    const soundPlayer = new SoundPlayer();

    useEffect(() => {
        setBoard(prepareBoard(cols,rows))
    }, [isGameStarting, cols, rows])

    useEffect(() => {
        if(moves === 0 && !haveBoardEmptyTiles) {
            endGame()
        }
    }, [moves, haveBoardEmptyTiles, endGame])

    const crushMatch = useCallback((match) => {
        addPoints(match.count * scoreMultiplier);
        const tilesToCrush = crushing.getTilesToCrush(match,cols);
        board.forEach((tile, index) => {
            if(tilesToCrush.includes(index)) {
                tile.crushing = true;
            }
            setTimeout(() => {
                if (tilesToCrush.includes(index)) {
                    tile.data = '';
                    tile.name = '';
                    setHaveBoardEmptyTiles(true);
                    tile.crushing = false;
                }
            }, 800);
        })
    },[cols, board, addPoints, scoreMultiplier]);

    const checkRows = useCallback(() => {
        const matches = matching.horizontal.findMatches(board, rows, cols)
        return matches;
    }, [board,rows,cols]);
    
    const checkColumns = useCallback(() => {
        const matches = matching.vertical.findMatches(board, rows, cols)
        return matches;
    }, [board,rows,cols]);

    const checkBoard = useCallback(() => {
            const matches = []
            checkRows().forEach(match => matches.push(match))
            checkColumns().forEach(match => matches.push(match))
            const sortedMatches = matches.sort((matchA, matchB) => matchB.count - matchA.count);

            if (sortedMatches.length > 0) {
                sortedMatches.forEach(match => crushMatch(match))
            } else if (sortedMatches.length === 0 && !haveBoardEmptyTiles) {
                startGame();
            }

    }, [checkRows, checkColumns, crushMatch, startGame, haveBoardEmptyTiles])

    const correctBoard = useCallback(() => {
        // Crushing tiles and moving down
        for(let i = 0; i < board.length - cols; i++) {
            const firstRow = Array.from({ length: cols }, (_, index) => index);
            const isFirstRow = firstRow.includes(i);
            if(isFirstRow && (board[i].data === '' && board[i].name === '')) {
                const newTile = getNewRandomTile()
                board[i].name = newTile.name;
                board[i].data = newTile.data;
            } else if(board[i+cols].name === '' && board[i+cols].data === '') {
                board[i+cols].name = board[i].name
                board[i+cols].data = board[i].data
                board[i].name = ''
                board[i].data = ''
            }
        }
    }, [cols, board])

    const handleDragStart = (e) => {
        const startPosition = parseInt(e.target.getAttribute('position'));
        setStartDragPosition(startPosition)
    }

    const handleDragEnd = (e) => {
        const isMoveOk = verifyMove(startDragPosition, replaceDragPosition, cols, rows, board)
        if(isMoveOk && !haveBoardEmptyTiles) {
            soundPlayer.playSound('move');
            setTimeout(() => soundPlayer.playSound('crush'), 800)
            const tempTile = {
                name: board[startDragPosition].name,
                data: board[startDragPosition].data
            };
            board[startDragPosition].name = board[replaceDragPosition].name;
            board[startDragPosition].data = board[replaceDragPosition].data;
            board[replaceDragPosition].name = tempTile.name;
            board[replaceDragPosition].data = tempTile.data;
            decMoves();
        }
    }

    const handleDragDrop = (e) => {
        const replacePosition = parseInt(e.target.getAttribute('position'));
        setReplaceDragPosition(replacePosition)
    }

    const preventDefaultBehaviour = (e) => {
        e.preventDefault();
    }
    
    const handleTouchStart = (e) => {
        const rect = e.target.getBoundingClientRect();
        e.target.setAttribute('elementTop', rect.top + window.scrollY)
        e.target.setAttribute('elementLeft', rect.left + window.scrollX)
        
    }

    const handleTouchMove = (e) => {
        const element = e.target;
        if(element.getAttribute('draggable') === "true") {
            element.style.position = "absolute";
            const elementTop = parseInt(element.getAttribute('elementTop'));
            const elementLeft = parseInt(element.getAttribute('elementLeft'));
            const newLeft = e.touches[0].clientX - elementLeft - element.clientWidth/2;
            const newTop = e.touches[0].clientY - elementTop - element.clientHeight/2;
            element.style.zIndex = 9999;
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
        }
    }

    const handleTouchEnd = (e) => {
        const element = e.target; 
        const startPosition = parseInt(element.getAttribute('position'));
        const lastTouch = e.changedTouches[e.changedTouches.length - 1];
        const elementsUnderCursor = document.elementsFromPoint(lastTouch.clientX, lastTouch.clientY);
        const eventImgs = elementsUnderCursor.filter(element => element.tagName.toLowerCase() === 'img');
        if(eventImgs.length === 2) {
            const replacePosition = parseInt(eventImgs[1].getAttribute('position'));
            const isMoveOk = verifyMove(startPosition, replacePosition, cols, rows, board)
            if(isMoveOk && !haveBoardEmptyTiles) {
                soundPlayer.playSound('move');
                setTimeout(() => soundPlayer.playSound('crush'), 800)
                const tempTile = {
                    name: board[startPosition].name,
                    data: board[startPosition].data
                };
                board[startPosition].name = board[replacePosition].name;
                board[startPosition].data = board[replacePosition].data;
                board[replacePosition].name = tempTile.name;
                board[replacePosition].data = tempTile.data;
                decMoves();
            }
        }
        element.style.position = null;
        element.style.left = null;
        element.style.top = null;
        element.style.zIndex = null;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            if(!haveBoardEmptyTiles && !board.find(tile => tile.crushing === true)) {
                checkBoard();
            } else if(haveBoardEmptyTiles) {
                correctBoard();
            }
            setBoard((prevBoard) => {
                const newBoard = [...prevBoard];
                const haveEmpties = newBoard.some(tile => tile.name === '' && tile.data === '');
                setHaveBoardEmptyTiles(haveEmpties);
                return newBoard;
            })
        }, refreshRatio);
        return () => clearInterval(timer);
    }, [checkBoard, correctBoard, board, haveBoardEmptyTiles, refreshRatio])

    return (
        <div className='board' style={style}>
            {showSpinner && <Spinner/>}
            {board.map((tile, index) => <Tile 
            key={index}
            position={index}
            image={tile.data}
            imageName={tile.name}
            crushing={tile.crushing}
            draggable={!haveBoardEmptyTiles && moves > 0}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
            handleDragStart={handleDragStart}
            handleDragDrop={handleDragDrop}
            handleDragEnd={handleDragEnd}
            preventDefaultBehaviour={preventDefaultBehaviour}
            />)}
        </div>
    )
}

export default Board;
