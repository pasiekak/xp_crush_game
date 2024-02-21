import './tile.css';

const Tile = (props) => {
    return ( 
        <div className='tile'>
            {props.image && props.imageName && <img 
            src={props.image} 
            alt={props.imageName}
            position={props.position}
            className={props.crushing ? 'crushing' : ''}
            onDragStart={props.handleDragStart}
            onDragEnd={props.handleDragEnd}
            onDrop={props.handleDragDrop}

            onTouchStart={props.handleTouchStart}
            onTouchMove={props.handleTouchMove}
            onTouchEnd={props.handleTouchEnd}

            onDragOver={props.preventDefaultBehaviour}
            onDragEnter={props.preventDefaultBehaviour}
            onDragLeave={props.preventDefaultBehaviour}

            draggable={props.draggable}/>}
            {props.crushing && 
            <div className='crush_animation'>
            </div>}
        </div>
    );
}
 
export default Tile;