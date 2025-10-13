import { animate } from 'animejs';
import { Check } from 'lucide-react';
import { SVGAttributes, useEffect, useRef, useState } from 'react';

export default function AppLogo(props: SVGAttributes<SVGElement>) {
    const [hovered, setHovered] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const hover1 = useRef<SVGStopElement>(null);
    const hover2 = useRef<SVGStopElement>(null);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const sidebar = document.querySelector('[data-state]');
            if (sidebar) setCollapsed(sidebar.getAttribute('data-state') === 'collapsed');
        });

        observer.observe(document.body, { attributes: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!hover1.current || !hover2.current) return;

        animate([hover1.current, hover2.current], {
            stopColor: hovered ? ['#FFD54F', '#FF4081'] : ['#FF4081', '#FFD54F'],
            easing: 'easeInOutSine',
            duration: 600,
        });
    }, [hovered]);

    if (collapsed) {
        return (
            <div className="flex w-full items-center justify-center group-data-[collapsible=icon]:overflow-hidden">
                <Check className="h-6 w-6 origin-center" strokeWidth={2.5} />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-2" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <svg {...props} viewBox="0 0 100 100" className="h-10 w-10" xmlns="http://www.w3.org/2000/svg">
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

            <span className="text-sm leading-tight font-semibold">Check-In</span>
        </div>
    );
}
