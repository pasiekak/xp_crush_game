import './welcome.css';

const Welcome = (props) => {
    return ( 
        <div className="welcome">
            <h1>Witaj w grze XP Crush!</h1>
            <h3>Zasady</h3>
            <ul>
                <li>
                    Za chwilę zobaczysz planszę o rozmiarach {props.cols} x {props.rows}.
                </li>
                <li>
                    Celem gry jest przesuwanie ikon tak, aby tworzyły rzędy o takich samych ikonach.
                </li>
                <li>
                    Minimalna ilość takich samych ikon w rzędzie to 2.
                </li>
                <li>
                    Rzędy można układać w pionie oraz poziomie.
                </li>
                <li>
                    Za każdy poprawnie ułożony rząd otrzymasz x * 10 punktów (gdzie x to ilość takich samych ikon w danym rzędzie).
                </li>
                <li>
                    Celem gry jest osiągnięcie {props.goal} punktów. Masz na to {props.moves} ruchów.
                </li>
            </ul>
            <div className='start-div'>
                <h3>Powodzenia! :)</h3>
                <button onClick={() => props.showGameBoard()}>Zacznij grę</button>
            </div>
        </div>
    );
}
 
export default Welcome;