import { useEffect, useRef, useState } from 'react';
import { Cloud } from './cloud';
import { getRandomWindowSkyHeight, getRandomWindowWidth } from '../../../utils/utils';

import cloud1 from './clouds-pngs/cloud-1.png'
import cloud2 from './clouds-pngs/cloud-2.png'
import cloud3 from './clouds-pngs/cloud-3.png'
import cloud4 from './clouds-pngs/cloud-4.png'
import cloud5 from './clouds-pngs/cloud-5.png'

import './cloud.css';

const clouds = [cloud1,cloud2,cloud3,cloud4,cloud5]

const AnimatedCloud = ({ speedMultiplier, framesPerSecond }) => {
    const [cloud, setCloud] = useState(new Cloud(getRandomWindowWidth(), getRandomWindowSkyHeight(), cloud1));
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const windowWidth = window.innerWidth;

    const animateCloud = (time) => {
        if (!previousTimeRef.current) {
            previousTimeRef.current = time;
        }

        const deltaTime = time - previousTimeRef.current;

        if (deltaTime > 1000 / framesPerSecond) {
            setCloud((prevCloud) => {
                let x = prevCloud.getX() + 1 * speedMultiplier;
                let y = prevCloud.getY();
                let image = prevCloud.getImage();
                if (x > windowWidth) {
                    x = -Math.floor(windowWidth * 0.20);
                    y = getRandomWindowSkyHeight();
                    image = clouds[Math.floor(Math.random() * 5)];
                }
                const newCloud = new Cloud(x, y, image);
                return newCloud;
            });
            previousTimeRef.current = time;
        }

        requestRef.current = requestAnimationFrame(animateCloud);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animateCloud);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div className="cloud" style={{ top: `${cloud.getY()}px`, left: `${cloud.getX()}px` }}>
            <img src={cloud.getImage()} alt='' />
        </div>
    );
};

export default AnimatedCloud;
