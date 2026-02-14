import { useT } from '@/lib/t';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

export default function Contacts() {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.contacts'),
            href: '/contacts',
        },
    ];

    const [clickedFirst, setClickedFirst] = useState(false);
    const [clickedSecond, setClickedSecond] = useState(false);
    const [clickedThird, setClickedThird] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('contacts.title')} />
            <meta name="description" content="Get in touch with us through our contact information" />
            
            <h1 className="flex justify-center font-bold text-5xl">{t('contacts.label')}</h1>

            <div className="flex justify-center">
                <div className="flex w-full flex-col gap-4 p-8 md:flex-row">
                    <div className="flex flex-1 flex-col items-center">
                        <p className="hidden text-2xl md:block">{t('contacts.support')}</p>

                        <div
                            className="relative h-64 w-full cursor-pointer overflow-hidden rounded-lg border shadow-md"
                            onClick={() => setClickedFirst((prev) => !prev)}
                        >
                            <svg
                                viewBox="0 0 300 300"
                                className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${clickedFirst ? 'opacity-0' : 'opacity-100'}`}
                            >
                                <g transform="translate(0,300) scale(0.100000,-0.100000)" className="dark:fill-white" stroke="none">
                                    <path
                                        d="M1489 2317 c-109 -31 -220 -132 -259 -235 -91 -238 50 -486 303 -533
                                                    117 -22 248 21 336 109 120 120 151 294 80 448 -35 74 -131 166 -204 194 -73
                                                    27 -190 35 -256 17z m186 -52 c110 -29 199 -109 240 -217 27 -73 18 -196 -20
                                                    -267 -38 -69 -112 -135 -183 -161 -46 -18 -72 -21 -137 -18 -100 6 -162 35
                                                    -231 111 -195 213 -47 553 246 566 14 1 53 -6 85 -14z"
                                    />
                                    <path
                                        d="M1520 2133 c-56 -50 -50 -147 11 -178 72 -38 161 -1 175 71 20 106
                                                    -106 179 -186 107z m123 -54 c17 -24 18 -30 6 -55 -19 -40 -79 -47 -103 -12
                                                    -21 30 -20 50 5 77 27 29 66 24 92 -10z"
                                    />
                                    <path
                                        d="M1531 1918 c-19 -7 -48 -30 -65 -51 -26 -33 -31 -47 -31 -95 0 -50 2
                                                    -57 20 -57 16 0 21 9 28 51 11 71 51 109 113 109 39 0 50 -5 75 -33 21 -23 29
                                                    -43 29 -70 0 -46 12 -65 36 -60 47 8 18 139 -41 184 -39 30 -115 40 -164 22z"
                                    />
                                    <path
                                        d="M380 1585 c-10 -12 -10 -18 0 -30 9 -11 34 -15 96 -15 l84 0 0 -287
                                                    0 -288 -65 0 -65 0 -2 220 c-3 220 -3 220 -25 223 -13 2 -23 -1 -23 -7 -4 -97
                                                    0 -473 5 -481 4 -6 49 -10 109 -10 117 0 131 7 124 65 l-4 35 73 0 74 0 267
                                                    -152 c147 -83 287 -160 311 -171 87 -39 85 -40 677 289 296 164 551 309 566
                                                    322 54 46 53 124 -2 175 -58 52 -79 45 -386 -125 -208 -114 -274 -156 -274
                                                    -170 0 -10 6 -21 13 -24 8 -3 136 63 284 146 149 82 280 150 292 150 50 0 79
                                                    -72 43 -107 -26 -27 -1086 -612 -1120 -619 -40 -8 -72 7 -377 182 l-260 149
                                                    -88 5 -88 5 0 189 0 188 152 -1 151 0 138 -91 137 -90 271 0 271 0 20 -26 c26
                                                    -33 26 -45 0 -77 l-20 -27 -277 -2 c-262 -3 -277 -4 -280 -22 -2 -10 2 -22 10
                                                    -27 21 -14 517 -10 558 4 66 23 98 104 66 166 -31 59 -40 61 -330 61 l-265 0
                                                    -146 95 -145 95 -158 0 -158 0 4 35 c7 58 -7 65 -123 65 -79 0 -105 -3 -115 -15z"
                                    />
                                </g>
                            </svg>

                            <div
                                className={`absolute inset-0 z-10 flex flex-col justify-center text-center transition-all duration-500 ease-in-out ${clickedFirst ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <p>123-456-789</p>
                                <p>support@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col items-center">
                        <p className="hidden text-2xl md:block">{t('contacts.emails')}</p>

                        <div
                            className="relative h-64 w-full cursor-pointer overflow-hidden rounded-lg border shadow-md"
                            onClick={() => setClickedSecond((prev) => !prev)}
                        >
                            <svg
                                viewBox="0 0 300 300"
                                className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${clickedSecond ? 'opacity-0' : 'opacity-100'}`}
                            >
                                <g transform="translate(0, 250) scale(0.1, -0.1)" className="dark:fill-white" stroke="none">
                                    <path
                                        d="M375 1741 c-48 -22 -79 -54 -100 -103 -13 -32 -15 -120 -15 -660 0
                                            -584 2 -625 19 -663 22 -48 54 -79 103 -100 33 -13 165 -15 1120 -15 1032 0
                                            1085 1 1123 19 48 22 79 54 100 103 23 56 23 1260 0 1316 -21 49 -52 81 -100
                                            103 -38 18 -91 19 -1125 19 -1034 0 -1087 -1 -1125 -19z m2254 -49 c14 -10 34
                                            -31 45 -46 21 -27 21 -37 21 -666 0 -629 0 -639 -21 -666 -11 -15 -33 -37 -48
                                            -48 -27 -21 -32 -21 -1125 -21 l-1097 0 -36 25 c-71 48 -68 22 -68 706 0 520
                                            2 620 15 650 17 41 49 71 88 81 15 5 516 7 1114 6 1040 -2 1088 -3 1112 -21z"
                                    />
                                    <path
                                        d="M423 1676 l-28 -24 21 -29 c21 -29 81 -76 348 -273 86 -63 204 -151
                                            263 -195 348 -259 350 -260 478 -260 112 1 119 4 360 182 648 477 693 511 719
                                            546 l21 29 -28 24 -28 24 -1049 0 -1049 0 -28 -24z m2146 -23 c0 -5 -118 -95
                                            -262 -200 -144 -106 -347 -257 -452 -334 -104 -78 -210 -151 -235 -163 -61
                                            -28 -177 -29 -238 -1 -45 21 -950 684 -951 698 -1 4 481 7 1069 7 589 0 1070
                                            -3 1069 -7z"
                                    />
                                    <path
                                        d="M341 1574 c-21 -26 -21 -35 -21 -578 0 -483 2 -554 16 -574 17 -24
                                            44 -28 77 -10 20 10 143 100 447 327 63 47 120 89 125 94 6 4 40 30 76 57 90
                                            66 111 94 97 125 -11 24 -110 105 -128 105 -6 0 -10 4 -10 8 0 5 -79 67 -175
                                            138 -97 71 -217 160 -268 197 -136 101 -190 137 -204 137 -6 0 -21 -12 -32
                                            -26z m47 -17 c6 -7 178 -137 382 -288 359 -265 370 -274 348 -289 -12 -8 -175
                                            -129 -363 -268 -187 -139 -352 -262 -367 -273 l-28 -20 0 575 c0 324 4 576 9
                                            576 5 0 13 -6 19 -13z"
                                    />
                                    <path
                                        d="M2565 1565 c-28 -19 -61 -43 -75 -52 -92 -64 -617 -459 -628 -472
                                            -36 -46 -36 -50 15 -99 46 -45 664 -506 711 -531 33 -17 71 -6 82 25 6 15 10
                                            244 10 568 0 534 0 544 -21 570 -11 14 -26 26 -32 26 -7 0 -35 -16 -62 -35z
                                            m75 -571 l0 -575 -27 20 c-16 11 -182 134 -370 274 -188 140 -352 260 -363
                                            268 -21 14 -20 16 42 60 190 138 666 493 683 510 11 10 23 19 27 19 5 0 8
                                            -259 8 -576z"
                                    />
                                    <path
                                        d="M1177 941 c-26 -15 -67 -41 -90 -59 -23 -19 -67 -51 -97 -74 -30 -22
                                            -66 -49 -80 -59 -14 -11 -72 -54 -130 -96 -58 -42 -109 -81 -115 -85 -5 -5
                                            -64 -48 -131 -97 -137 -101 -169 -134 -154 -162 28 -52 -29 -49 1122 -49
                                            l1068 0 32 29 c31 28 31 29 16 53 -22 33 -25 36 -476 370 -155 115 -301 220
                                            -324 233 -44 25 -50 24 -118 -15 -119 -70 -280 -72 -390 -5 -74 44 -82 45
                                            -133 16z m95 -41 c129 -93 339 -90 467 7 23 18 38 23 47 17 59 -39 813 -600
                                            813 -605 1 -4 -9 -9 -21 -13 -30 -8 -2126 -8 -2155 0 -13 4 -23 9 -22 13 0 7
                                            810 609 822 610 4 1 26 -13 49 -29z"
                                    />
                                </g>
                            </svg>

                            <div
                                className={`absolute inset-0 z-10 flex flex-col justify-center text-center transition-all duration-500 ease-in-out ${clickedSecond ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <p>official@gmail.com</p>
                                <p>check-in@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col items-center">
                        <p className="hidden text-2xl md:block">{t('contacts.data')}</p>

                        <div
                            className="relative h-64 w-full cursor-pointer overflow-hidden rounded-lg border shadow-md"
                            onClick={() => setClickedThird((prev) => !prev)}
                        >
                            <svg
                                viewBox="0 0 300 300"
                                className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${clickedThird ? 'opacity-0' : 'opacity-100'}`}
                            >
                                <g transform="translate(0, 300) scale(0.1, -0.1)" className="dark:fill-white" stroke="none">
                                    <path
                                        d="M1351 2604 c-88 -23 -171 -74 -246 -149 -114 -114 -172 -247 -180
                                                -419 -4 -77 -6 -81 -31 -88 -69 -18 -94 -70 -94 -195 0 -80 4 -104 20 -130 19
                                                -31 65 -63 92 -63 8 0 22 -16 33 -36 24 -46 86 -99 148 -127 26 -12 47 -25 47
                                                -28 0 -4 21 -35 46 -69 62 -84 56 -92 -116 -149 -248 -83 -436 -193 -519 -304
                                                -82 -110 -111 -205 -111 -372 l0 -100 1060 0 1060 0 0 100 c0 168 -36 283
                                                -119 384 -86 105 -274 213 -511 292 -162 54 -178 69 -132 126 38 48 96 156
                                                112 208 7 22 26 53 42 69 46 46 61 85 66 169 3 55 0 90 -11 120 -11 29 -15 77
                                                -15 157 2 180 -31 278 -125 377 -83 88 -207 133 -367 133 -160 0 -284 -45
                                                -367 -133 -94 -99 -125 -194 -128 -387 -1 -74 -7 -139 -15 -158 -16 -43 -9
                                                -176 12 -217 9 -17 29 -43 44 -59 29 -28 69 -116 54 -116 -14 0 -87 64 -110
                                                98 -23 32 -23 37 -22 284 2 264 4 292 29 373 52 165 178 299 338 356 85 31
                                                245 31 330 0 184 -67 317 -227 356 -426 5 -27 10 -167 11 -311 l1 -260 41 6
                                                c99 15 126 56 126 193 0 125 -25 177 -94 195 -25 7 -27 11 -31 88 -8 172 -66
                                                305 -180 419 -77 77 -159 126 -250 150 -74 19 -222 19 -294 -1z m352 -173 c75
                                                -29 134 -75 174 -135 53 -77 66 -134 69 -291 2 -101 7 -150 18 -177 33 -76 14
                                                -178 -43 -237 -20 -21 -44 -63 -57 -98 -23 -65 -67 -143 -116 -205 -55 -70
                                                -16 -116 147 -173 238 -82 357 -143 459 -236 111 -102 156 -209 156 -371 l0
                                                -88 -1010 0 -1010 0 0 88 c0 295 163 454 630 613 99 33 144 64 154 105 5 19
                                                -3 37 -33 77 -22 28 -36 54 -30 56 6 2 35 -9 65 -24 44 -22 64 -27 104 -23 93
                                                9 133 66 73 105 -37 24 -139 25 -176 0 -20 -13 -37 -16 -68 -11 -37 6 -43 11
                                                -60 51 -11 25 -22 56 -25 70 -4 14 -23 42 -43 62 -60 60 -80 174 -42 249 15
                                                31 17 53 13 129 -13 262 82 420 289 478 83 23 286 15 362 -14z m-778 -676 c0
                                                -85 -3 -155 -7 -155 -4 0 -22 13 -39 28 -27 24 -32 36 -36 94 -3 36 -2 83 1
                                                103 7 36 47 85 70 85 8 0 11 -49 11 -155z m1198 131 c31 -29 41 -74 35 -163
                                                -4 -59 -7 -69 -36 -94 -18 -16 -36 -29 -40 -29 -4 0 -7 70 -7 155 0 106 3 155
                                                11 155 6 0 23 -11 37 -24z m-699 -502 c32 -12 3 -24 -59 -24 -60 0 -91 12 -63
                                                23 19 8 104 8 122 1z"
                                    />
                                </g>
                            </svg>

                            <div
                                className={`absolute inset-0 z-10 flex flex-col justify-center text-center transition-all duration-500 ease-in-out ${clickedThird ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <p>protection@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
