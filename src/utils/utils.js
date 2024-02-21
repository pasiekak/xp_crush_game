const images = require.context('../../public/images/tile-icons/', true);
const imageList = images.keys().map(image => {
const imageName = image.split('/').pop(); // Pobierz nazwę pliku z pełnej ścieżki
const imageUrl = images(image);
    return {
        name: imageName,
        data: imageUrl
    };
});

const getRandomWindowWidth = () => {
    const x = Math.floor(Math.random() * window.innerWidth);
    return x;
}

const getRandomWindowSkyHeight = () => {
    const y = Math.floor(Math.random() * (window.innerHeight / 3));
    return y;
}

const verifyMove = (startPosition, endPosition, cols, rows, board) => {
    const tempBoard = JSON.parse(JSON.stringify(board))
    const validMoves = [
        startPosition + 1,
        startPosition - 1,
        startPosition - cols,
        startPosition + cols
    ]
    if(validMoves.includes(endPosition)) {
        const tempTile = {
            name: tempBoard[startPosition].name,
            data: tempBoard[startPosition].data
        };
        tempBoard[startPosition].name = tempBoard[endPosition].name;
        tempBoard[startPosition].data = tempBoard[endPosition].data;
        tempBoard[endPosition].name = tempTile.name;
        tempBoard[endPosition].data = tempTile.data;

        const verticalMatches = matching.vertical.findMatches(tempBoard, rows, cols);
        const horizontalMatches = matching.horizontal.findMatches(tempBoard, rows, cols);
        if(verticalMatches.length > 0 || horizontalMatches.length > 0) {
            return true;
        } else {
            return false;
        }
    };
    return false;
}

const prepareBoard = (cols, rows) => {
    const board = [];
    for(let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const imageID = Math.floor(Math.random() * 4)
            board.push({
                data: imageList[imageID].data,
                name: imageList[imageID].name
            })
        }
    }
    return board;
}

const getNewRandomTile = () => {
    const imageID = Math.floor(Math.random() * 4)
    return {
        data: imageList[imageID].data,
        name: imageList[imageID].name
    }
}
const crushing = {
    getTilesToCrush: (match, cols) => {
        let tilesToCrush = []
        if(match.type === 'vertical') {
            for (let i = 0; i < match.count; i++) {
                const tileIndex = match.startIndex + i*cols;
                tilesToCrush.push(tileIndex);
            }
        } else if (match.type === 'horizontal') {
            for (let i = 0; i < match.count; i++) {
                const tileIndex = match.startIndex + i;
                tilesToCrush.push(tileIndex);
            }
        }
        return tilesToCrush
    }
}
const rating = {
    calculateStars: (score, goal) => {
        const percentage = (score / goal) * 100;
        if (percentage >= 75) {
            return 3; // Jeśli uzyskano co najmniej 75% wyniku, przyznaj 3 gwiazdki
        } else if (percentage >= 50) {
            return 2; // Jeśli uzyskano co najmniej 50% wyniku, przyznaj 2 gwiazdki
        } else if (percentage >= 25) {
            return 1; // Jeśli uzyskano co najmniej 25% wyniku, przyznaj 1 gwiazdkę
        } else {
            return 0; // W przeciwnym razie przyznaj 0 gwiazdek
        }
    }
}

const matching = {
    horizontal: {
        findMatches: (board, rows, cols) => {
            const matches = [];
            for(let i = 0; i < rows; i++) {
                const row = board.slice(i*cols, i*cols+cols)
                const match = {
                    count: 1,
                    type: 'horizontal'
                }
                for(let j = 1; j < row.length; j++) {
                    let tile = row[j];
                    let prevTile = row[j-1];
                    if(tile.name === prevTile.name && tile.name !== '') {
                        match.count += 1;
                        match.name = tile.name
                        if(j+1 === row.length && match.count > 2) matches.push({
                            startIndex: (j-match.count+1)+(i*8),
                            count: match.count,
                            name: match.name,
                            type: match.type
                        })
                    } else {
                        if (match.count > 2) matches.push({
                            startIndex: (j-match.count)+(i*8),
                            count: match.count,
                            name: match.name,
                            type: match.type
                        })
                        match.count = 1;
                        match.name = tile.name
                    }
                }
            }
            return matches;
        }
    },
    vertical: {
        findMatches: (board, rows, cols) => {
            const matches = [];
            for(let i = 0; i < cols; i++) {
                const column = board.map((tile, index) => ({ ...tile, index })).filter((newTile, index) => index % cols === i);
                const match = {
                    count: 1,
                    type: 'vertical'
                }
                for(let j = 1; j < column.length; j++) {
                    let tile = column[j];
                    let prevTile = column[j-1];
                    if(tile.name === prevTile.name && tile.name !== '') {
                        match.count += 1;
                        match.name = tile.name
                        if(j+1 === column.length && match.count > 2) matches.push({
                            startIndex: tile.index-cols*(match.count-1),
                            count: match.count,
                            name: match.name,
                            type: match.type
                        })
                    } else {
                        if (match.count > 2) matches.push({
                            startIndex: tile.index-cols*match.count,
                            count: match.count,
                            name: match.name,
                            type: match.type
                        })
                        match.count = 1;
                        match.name = tile.name
                    }
                }
            }
            return matches;
        }
    }
}

export {
    getRandomWindowSkyHeight,
    getRandomWindowWidth,
    getNewRandomTile,
    verifyMove,
    prepareBoard,
    matching,
    crushing,
    rating
}