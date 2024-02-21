import AnimatedCloud from "./cloud/AnimatedCloud";

import './sky.css';

const Sky = ({framesPerSecond}) => {
    return (
        <div className="sky">
            <AnimatedCloud speedMultiplier={0.5} framesPerSecond={framesPerSecond}/>
            <AnimatedCloud speedMultiplier={1} framesPerSecond={framesPerSecond}/>
            <AnimatedCloud speedMultiplier={1.2} framesPerSecond={framesPerSecond}/>
        </div>
    )
}

export default Sky;