import { animate, stagger, svg } from 'animejs';
import { useEffect } from 'react';

export default function AnimatedCheckMark() {
    useEffect(() => {
        const drawable = svg.createDrawable('.line');

        animate(drawable, {
            draw: ['0 0', '0 1', '1 1'],
            stroke: ['#FFD54F', '#FF4081'],
            easing: 'easeInOutSine',
            duration: stagger(1000, { start: 3000 }),
            delay: stagger(100),
            loop: true,
            alternate: true,
        });
    }, []);

    return (
        <div className="flex h-full items-center justify-center bg-black">
            <svg viewBox="0 0 100 100" className="h-32 w-32 text-white" xmlns="http://www.w3.org/2000/svg">
                <g stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8">
                    <path className="line" d="M20 52 L40 72 L80 28" />
                </g>
            </svg>

            <div>
                <h1 className="text-4xl font-bold text-white">Check-In</h1>
                <p className="flex justify-center font-bold text-white">
                    on the lookout
                </p>
            </div>
        </div>
    );
}
