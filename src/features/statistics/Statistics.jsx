import './statistics.css'

const Statistics = ({points, moves, goal}) => {
    return ( 
        <div className='statistics'>
            <span className='total'>Wynik:</span><span>{points}</span>
            <span className='moves'>Pozostałe ruchy:</span><span>{moves}</span>
            <span className='goal'>Cel:</span><span>{goal}</span>
        </div>
    );
}
 
export default Statistics;