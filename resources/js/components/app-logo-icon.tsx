import { animate } from 'animejs';
import { useEffect, useRef, useState } from 'react';
import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    const [hovered, setHovered] = useState(false);
    const hover1 = useRef<SVGStopElement>(null);
    const hover2 = useRef<SVGStopElement>(null);

    useEffect(() => {
        if (!hover1.current || !hover2.current) return;

        animate([hover1.current, hover2.current], {
            stopColor: hovered ? ['#FFD54F', '#FF4081'] : ['#FF4081', '#FFD54F'],
            easing: 'easeInOutSine',
            duration: 600,
        });
    }, [hovered]);

    return (
        <div className="flex h-full items-center justify-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <svg {...props} viewBox="0 0 100 100" className="h-32 w-32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop ref={hover1} offset="0%" stopColor="#FFD54F" />
                        <stop ref={hover2} offset="100%" stopColor="#FF4081" />
                    </linearGradient>
                </defs>

                <path
                    d="M20 52 L40 72 L80 28"
                    stroke="url(#checkGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>
        </div>
    );
}
