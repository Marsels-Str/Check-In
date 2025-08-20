import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 font-medium">Let's get started</h1>
                            <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]">
                                Check-In was made to make managing workers and projects easier.
                                <br />
                                We suggest starting with the following.
                            </p>
                            <ul className="mb-4 flex flex-col lg:mb-6">
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>
                                        Fill in all the information about youreself.
                                    </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>
                                        Then get to know the App and all its features.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="relative -mb-px w-full shrink-0 overflow-hidden rounded-t-lg lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg">
                        
                                <svg version="1.1" viewBox="0 0 2048 1635" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                                    <path transform="translate(0)" d="m0 0h2048v1635h-2048z"/>
                                    <path transform="translate(892,820)" d="m0 0h18l41 3h36l11-1h28l16 1 56 1 19 3 15 6 14 8 3 5 1 11 4-5 6 1 10 6v2l12 4h14l10-3 10-5 8-6 9-7 7-4 14-7 17-5 22-3h36l16 2 21 6 16 8 10 9 8 11 7 15 4 19 2 20v20l-2 21-6 19-5 10-8 10-5 5-6 5-15 7-13 4-10 2-16 1-43-4-20-4-21-9-15-8-15-9-8-3-11-1-11 3-11 6-6 5-6 4-11 7-12 5-9 3-15 3-53 1-19 1-9 1-15 1h-26l-21-2h-25l-22 3-18 1-33-2-34-4-29-1h-43l-1 1-31 3-4 1h-23l-23-6-8-4-12-9-5-4-13-18-7-16-4-16-2-16v-24l3-21 5-17 6-12 8-11 13-12 16-8 20-4h30l37 3h37l26-1 40-4z" fill="#2D1F00"/>
                                    <path transform="translate(892,820)" d="m0 0h18l41 3h36l11-1h28l16 1 56 1 19 3 15 6 14 8 3 5 1 6-3 1h-18l-2-6-5-2-9-3-20-3-77-2-42 2-14 1-46-3-22-1h-17l-21 3-18 2-18 1-4 1-15 1-6-1h-14l-14-2-26-2h-31l-14 2-12 4-10 7h-2v2h-2l-2 4-8 13-6 13-3 13-1 9v27l3 20 6 16 6 10 5 5 7 9 11 7 5 3 18 4 17-1 36-5 19-2 4-1 10 1 44 1 16 3 39 4h14l36-5h15l38 5h19l38-4 54-1 15-3 5-3v-7l2-1h22l-15-33-17-37-4-8 1-6 13-20 12-19 6-9h3l3-4 6 1 10 6v2l12 4h14l10-3 10-5 8-6 9-7 7-4 14-7 17-5 22-3h36l16 2 21 6 16 8 10 9 8 11 7 15 4 19 2 20v20l-2 21-6 19-5 10-8 10-5 5-6 5-15 7-13 4-10 2-16 1-43-4-20-4-21-9-15-8-15-9-8-3-11-1-11 3-11 6-6 5-6 4-11 7-12 5-9 3-15 3-53 1-19 1-9 1-15 1h-26l-21-2h-25l-22 3-18 1-33-2-34-4-29-1h-43l-1 1-31 3-4 1h-23l-23-6-8-4-12-9-5-4-13-18-7-16-4-16-2-16v-24l3-21 5-17 6-12 8-11 13-12 16-8 20-4h30l37 3h37l26-1 40-4z" fill="#231800"/>
                                    <path transform="translate(1382,508)" d="m0 0h59v28l-3 29-5 26-7 24-10 24-11 20-10 14-9 11-7 8-11 9-10 8-14 9-17 8-23 7-22 4-11 1h-28l-31-3-27-5-33-9-32-11-28-12 5-12 10-19 11-17 12-16 11-13 11-12 13-13 8-7 16-13 24-16 12-7h2l-4 21-1 7v33l3 21 5 20 9 24 8 16 3 5v2l3-1 8-16 6-13 7-19 5-20 3-20v-26l-3-22-6-24-3-9 30-10 19-5 28-5 22-3z" fill="#F69338"/>
                                    <path transform="translate(620,507)" d="m0 0h15l31 1 28 3 35 6 25 7 23 8-2 9-5 17-4 24v32l3 21 5 19 6 17 8 18 6 11v2l3-1 10-19 8-20 6-19 4-20 1-9v-31l-4-25-1-5 10 5 17 11 16 12 14 12 13 12 11 11 9 11 10 12 12 17 12 21 8 16 1 5-10 5-28 11-28 9-26 7-28 5-28 3h-28l-21-2-25-6-17-6-17-9-12-8-11-9-10-9-9-10-11-15-10-17-9-19-8-23-6-24-4-27-1-12v-34z" fill="#F69338"/>
                                    <path transform="translate(1e3 852)" d="m0 0h13l10 3 8 5 9 8 5-1 3-3 11-2h5l3 1 2-1 1-7 2-1h21l1 46 26-39 5-7h23l-2 5-11 17-12 19-7 11 1 6 12 25 15 33 7 15v2h-25l-7-14v-2h-4l-3 9-3 1-14 1-1 6h-23l-1-1-1-9-5-1-1 1h-10l-8-1-4-6h-2l-2 5-9 8-11 5-3 1h-15l-11-4-9-6-6-8-2-4v-3l-7-1-1 5-2 1h-12l-8-1v18h-64v-133h63l1 1 1 16 11-2h9l4 4v2l5 1 1-5 6-8 9-7z" fill="#513801"/>
                                    <path transform="translate(1309,839)" d="m0 0h11l17 1 14 3 5 4v6h12l5 1 1 7-1 126h-21l-4-5-2-5-4 2-4 4-15 2h-2l-1 3h-23l-2-13-4 1-7 1-7-3-5-5-1 1-1 18h-22l-2-3-1-21-4-3-4-1-7-3v-2h-2l-9-14-2-8-41-1-1-1v-20l1-1h41l1 10 1-18 5-9 6-7 6-4 5 1 4 3 1-30 2-2 5-1h17l1-6 5-3 16-4z" fill="#523902"/>
                                    <path transform="translate(702,852)" d="m0 0h14l12 4 8 6 7 6v2h7l2-1 12-1 3 1 4 4 1-3 1-16h23v54l31-1 1-53h22v133h-22l-1-56h-30l-1 56h-23l-1-17-5 1-4 2h-11l-7-4-3 5-5 5-10 7-11 4h-13l-10-3-10-6-6-7-4-8-2-16v-66l2-9 5-9 7-7 10-5z" fill="#513801"/>
                                    <path transform="translate(1382,508)" d="m0 0h59v28l-3 29-5 26-2 5-5-3-2-1-2 3-3-1 1-5-1-1h-7l-3 1 3 3 4 5-9 1h-11l-3-1 1-4 1-2h-7l-1-1h-5v-2l-18 1v-1h-30l-22-1-8-3h-12l-3 1-1 8-1 2-4 1-4-31-6-24-3-9 30-10 19-5 28-5 22-3z" fill="#FDC95A"/>
                                    <path transform="translate(620,507)" d="m0 0h15l31 1 28 3 35 6 25 7 23 8-2 9-5 17-5 30-1 8-3-1-6-7-6-1-2-2-1 2-15 2h-23l-4-1h-11l-9 1h-33l-6-1v2l-13-2-3-1v-2h-8l-2 11v8l-2-2-6-26-3-22-1-12v-34z" fill="#FDC95A"/>
                                    <path transform="translate(878,854)" d="m0 0h63l1 1 1 16 11-2h9l4 4v2l4 1-1 14v59l1 16-6-1-1 5-2 1h-12l-8-1v18h-64z" fill="#513801"/>
                                    <path transform="translate(1235,864)" d="m0 0h5l3 3 3 1v19l-7-4-4 1-5 2-2 4-7 9-1 3-1 18-1 6h-1v-16l-41 1v20l41 1 3 9 7 11 1 3h2v2l7 2 7 3 2 2v16l-3-2-9-1-11-6-4-5-11-7-9-4h-14l-9 7-4 4h-2v2h-2l-2 4-4 5-4 2-8-1-1 3-30-65-3-6 1-6 13-20 12-19 1 2 9-1 5 3 4 5 4 3v2h2l7 8 3 3 3 1h13l16-6 9-7 7-7z" fill="#2E1F00"/>
                                    <path transform="translate(1267,532)" d="m0 0 4 1 5 15 5 22 2 17v26l-4 25-7 24-8 19-8 16-3 5h-3l-6-10-10-23-7-21-5-24-1-10v-33l4-23 2-7 23-12z" fill="#050300"/>
                                    <path transform="translate(1298,854)" d="m0 0h19l3 5 18 41 13 31v-21l1-56h21l1 7-1 126h-21l-8-16-17-40-6-15-1 63-1 8h-21z" fill="#F69338"/>
                                    <path transform="translate(774,854)" d="m0 0h22v54l31-1 1-53h22v133h-22l-1-56h-30l-1 56h-22z" fill="#F69338"/>
                                    <path transform="translate(1073,854)" d="m0 0h21l1 46 26-39 5-7h23l-2 5-11 17-12 19-7 11 1 6 12 25 15 33 7 15v2h-25l-12-25-13-30-2-1-5 10-1 46h-21l-1-38v-94z" fill="#F69338"/>
                                    <path transform="translate(1248,854)" d="m0 0h21v133h-22l-1-2-1-21-4-3-4-1-7-3v-2h-2l-9-14-2-8-41-1-1-1v-20l1-1h41l1 10 1-18 5-9 6-7 6-4 5 1 4 3 1-30z" fill="#392701"/>
                                    <path transform="translate(878,854)" d="m0 0h63l1 1v20l-1 1h-41v32h38v22l-37 1v34l40 1 1 10v11h-64z" fill="#F69338"/>
                                    <path transform="translate(1e3 852)" d="m0 0h13l10 3 8 5 7 7 5 11 1 5v16h-22l-1-17-4-5-4-2h-14l-6 4-2 6v72l3 7 6 3h13l6-4 2-3 1-17 1-1h20l1 1v12l-2 11-5 10-9 8-11 5-3 1h-15l-11-4-9-6-6-8-4-11-1-12v-59l2-14 5-10 9-8 8-4z" fill="#F69338"/>
                                    <path transform="translate(702,852)" d="m0 0h14l12 4 8 6 6 7 4 11 1 9v9l-1 1h-21l-1-16-3-5-5-3h-14l-5 3-3 5v76l4 6 5 2h12l7-4 2-4 1-17h21l1 1-1 18-4 11-6 8-11 7-9 3h-13l-10-3-10-6-6-7-4-8-2-16v-66l2-9 5-9 7-7 10-5z" fill="#F69338"/>
                                    <path transform="translate(1396,556)" d="m0 0 6 1 10-1h9l7 1 4 8 1 4h2l2-2-1 10-4 18h-3l-5-3-2 3-3-1 1-5-1-1h-7l-3 1 3 3 4 5-9 1h-11l-3-1 1-4 1-2h-7l-1-1h-5v-2l-18 1v-1h-30l-22-1-8-3h-12l-3 1-1 8-1 2-4 1-1-17 3-11 1-8 3-2 8 1 3 1 2-1 21-1h19l11 1 14-2z" fill="#FCBC54"/>
                                    <path transform="translate(750,556)" d="m0 0 6 1 4 5 1 3 1 16 3 2-1 13-3-1-6-7-6-1-2-2-1 2-15 2h-23l-4-1h-11l-9 1h-33l-6-1v2l-13-2-3-1v-2h-8l-2 11v8l-2-2-4-17 2-15 2-11 4-1 24 2 9-2h13l12 2 4-1h46l9-2z" fill="#FCBC54"/>
                                    <path transform="translate(877,854)" d="m0 0h1v133h64v1h-65l-2-5-3-1-7 2-9-3-4-3-1 8h-1v-131l2 4v2l13-3 7 1 3 3h1z" fill="#523902"/>
                                    <path transform="translate(1144,875)" d="m0 0 4 1 9 14 9 17 1 17v11l-2 7-6 14-6 9-9 1-1 2-18-39-9-19 1-6 13-20 5-8z" fill="#392701"/>
                                    <path transform="translate(1248,854)" d="m0 0h21v133h-21l-1-95v-37z" fill="#F69338"/>
                                    <path transform="translate(1309,839)" d="m0 0h11l17 1 14 3 5 4v6h12v1h-16v78l-3-3-16-38-15-35-1-1-20-1-1 11-11-1-8 3-1 1h-5l-1-13-17-1v-1h17l1-6 5-3 16-4z" fill="#2E2000"/>
                                    <path transform="translate(1e3 852)" d="m0 0h13l10 3 8 5 7 7 5 11 1 5v16h-22l-1-17-4-5-4-2h-14l-6 4-3 8-1 16-3 1-4-4v-2l-6 2-4 2v2l-3-1v-23l4-11 8-9 8-5z" fill="#FDC759"/>
                                    <path transform="translate(702,852)" d="m0 0h14l12 4 8 6 6 7 4 11 1 9v9l-1 1h-21l-1-16-3-5-5-3h-14l-5 3-4 2-1 5-1 14-2 4-4-2-1-2h-5l-1 4h-3v-3l-2-2v-23l5-9 7-7 10-5z" fill="#FDC759"/>
                                    <path transform="translate(878,854)" d="m0 0h63l1 1v20l-1 1h-41v25l-4-1-3-5-4-1-5 4-2 3-3-1-1-16z" fill="#FDC85A"/>
                                    <path transform="translate(1272,968)" d="m0 0 5 5 9 3 9-2 1 1 1 13 23-1 3-3 15-2 5-5h3l3 5v2l3 1v2h21v1l-16 2 3 3v5l-5 3-7 2-9 1h-13l-32-3-16-2-5-3-3-4-1-4 1-18z" fill="#2D1F00"/>
                                    <path transform="translate(791,564)" d="m0 0h10l9 4 6 7 3 8v7l-2 7-8 9-9 4h-9l-10-5-6-7-2-6v-10l5-10 7-6z" fill="#FDC95A"/>
                                    <path transform="translate(1247,564)" d="m0 0h8l10 4 6 7 3 7v10l-5 10-8 6-6 2h-7l-9-3-6-5-4-7-1-4v-8l4-10 8-7z" fill="#FDC95A"/>
                                    <path transform="translate(1057,848)" d="m0 0h12l4 4h21l5-2 17 1 5 3v2l4-1-2 5-8 11-16 25-5 5v-47l-23 1v7l-5 2-1-1-18 2-1 3-5 1-10-9-3-3 2-1 1-5 4-2h12z" fill="#3A2701"/>
                                    <path transform="translate(797,930)" d="m0 0h30l1 1v56h-1v-13l-7 3-7 1-15-3-1 12h-1v-56z" fill="#523902"/>
                                    <path transform="translate(1373,861)" d="m0 0 2 4 1 17h2l1 2 3 1 2 5 3 1 4 13 2 8v25l-3 15-6 12-3 3-3 1-2 5-1 13-2 1z" fill="#392701"/>
                                    <path transform="translate(796,854)" d="m0 0h1l2 11 16-2 6 2 6 4v-15h1v53l-1 1h-31z" fill="#523902"/>
                                    <path transform="translate(1129,886)" d="m0 0 11 2 6 11 3 13 1 10-4 22-4 6-3 2-2 3-17-37-4-8 1-6z" fill="#523902"/>
                                    <path transform="translate(1375,865)" d="m0 0 10 3 7 8 5 12 4 15 1 14v14l-2 19-5 17-6 10-4 5-8 5-3-1 1-13 3-6 5-3 6-12 3-15v-25l-5-19-5-6v-2l-4-1v-2h-2l-1-2z" fill="#2D1F00"/>
                                    <path transform="translate(1298,854)" d="m0 0h19l3 5 12 27 2 10-1 1-27-1-6 5h-1l-1-12z" fill="#FCBB54"/>
                                    <path transform="translate(1351,854)" d="m0 0h1v78l-3-3-16-38-14-32 1-3 1 4 7 1v-2l11 1 7 3 4 2v-10z" fill="#523902"/>
                                    <path transform="translate(1126,854)" d="m0 0h23l-2 5-11 17-12 19-7 11-3 1-2-10h-10v-2l-3 1 2-5 20-30z" fill="#FDC759"/>
                                    <path transform="translate(828,854)" d="m0 0h21v46h-4v-2l-4-2-5 1-6 5-2-1z" fill="#FDC85A"/>
                                    <path transform="translate(1247,855)" d="m0 0h21v33l-2 10-5-2-4-1-5 12h-2l-1 2-2-17z" fill="#FDC95A"/>
                                    <path transform="translate(1352,854)" d="m0 0h21l-1 42-3 4-7-2-5 4-3 1-1-1-1-12z" fill="#FDC759"/>
                                    <path transform="translate(1176,910)" d="m0 0h39l1 1v20l-1 1h-39l-1-1v-20z" fill="#F69338"/>
                                    <path transform="translate(776,854)" d="m0 0h19v48h-3v-2l-4-2-3-1-8 3-1-1-1-7v-37z" fill="#FDC859"/>
                                    <path transform="translate(1100,931)" d="m0 0 3 1 16 36v3h-3l-3 9-3 1-14 1-1 6h-21v-1h20v-46z" fill="#523902"/>
                                    <path transform="translate(1073,855)" d="m0 0h20v40l-4 3-9 1-5 3-2-4z" fill="#FECA5B"/>
                                    <path transform="translate(1225,553)" d="m0 0h2l-4 21-3 20-4-4-3-9-6-1-24 8-9 7-10 5-19 19v-3l20-20 8-7 16-13 24-16z" fill="#FCBC54"/>
                                    <path transform="translate(745,968)" d="m0 0 7 4h11l7-3 3 3v15h23v1l-27 1-6 2-18 2h-10l-2-1 1-9-2-1 6-5 5-6z" fill="#3A2701"/>
                                    <path transform="translate(965,964)" d="m0 0 7 1 6 13h-2l3 8v3l-5 2h-20l-12-4v-18l4-1 4 1h12l2-1z" fill="#392701"/>
                                    <path transform="translate(1042,970)" d="m0 0 4 5v2h18l5-1 2 2 1 9 1 2-4 1v2l-17 2h-23l-2-2 1-4 2-6 7-6 3-5z" fill="#392701"/>
                                    <path transform="translate(762,851)" d="m0 0 7 1 2 4 2 1v13l-2 4-4-3v-2l-15 1-6 1-3-1-5-5-5-6 2-1 1-3h2l1-3z" fill="#392701"/>
                                    <path transform="translate(966,851)" d="m0 0h9l3 2v12l-5 8-1 3-5-1-2-5h-13l-9 2-1-1v-15l2 2 6-4z" fill="#392701"/>
                                    <path transform="translate(1299,855)" d="m0 0h19l7 15 4 10v4l-5-1-4-5-3-1-9 1-8 7h-1z" fill="#FDC759"/>
                                    <path transform="translate(821,553)" d="m0 0 10 5 17 11 16 12 14 12 13 12 8 8-1 2-5-4v-2l-6-3v-2l-4-1-8-7-15-10-7-4-13-7-5 1-1-4-6-2-3 1-4-16z" fill="#FCBA53"/>
                                    <path transform="translate(1094,854)" d="m0 0 2 1v7h13l7 6-2 5-18 27-2 1z" fill="#523902"/>
                                    <path transform="translate(878,864)" d="m0 0h1l1 14 4 1 2-7 4-2v2h6v2l4 2v25l-4-1-3-5-4-1-5 4-2 3-3-1-1-16z" fill="#FCBB54"/>
                                    <path transform="translate(674,873)" d="m0 0h1v5l5 1 3-4h6l2 2 7-1-3 4h-2l-1 5-1 14-2 4-4-2-1-2h-5l-1 4h-3v-3l-2-2v-23z" fill="#FCBB54"/>
                                    <path transform="translate(1247,855)" d="m0 0h1l1 29 1 5 6-12 2-1h6l2-2 1-8h1v22l-2 10-5-2-4-1-5 12h-2l-1 2-2-17z" fill="#FCB952"/>
                                    <path transform="translate(1073,856)" d="m0 0h1l1 28 3-1 1-4 3-4 5 1 2 4 2 1 1-16h1v30l-4 3-9 1-5 3-2-4z" fill="#FDBD55"/>
                                    <path transform="translate(983,875)" d="m0 0h6v3 8l1 2v15l-3 1-4-4v-2l-6 2-4 2v2l-3-1v-23h1l1 5 5-3 4-6z" fill="#FCBC54"/>
                                    <path transform="translate(837,872)" d="m0 0 7 6v3h2v2l3-1v18h-4v-2l-4-2-5 1-6 5-2-1v-18l4-1z" fill="#FDBD55"/>
                                    <path transform="translate(797,974)" d="m0 0 17 3 7-2 6-1v13h23v1h-26l-5 1h-13l-9-2z" fill="#3A2801"/>
                                    <path transform="translate(1033,877)" d="m0 0 8 6 2-5h1l1 5v16h-22v-17h6l2-4z" fill="#FCB952"/>
                                    <path transform="translate(1116,971)" d="m0 0h4l7 14-1 2h-4l-4 4-6 2h-14l-3-5 1-6 2-1 15-1z" fill="#3A2701"/>
                                    <path transform="translate(1121,878)" d="m0 0 3 1v7l-1 5 2 2-8 13-3 1-2-10h-10v-2l-3 1 2-5 6-9 7 1 5-4z" fill="#FCBA53"/>
                                    <path transform="translate(1272,968)" d="m0 0 5 5 9 3 9-2 1 1 1 13-1 1h-15l-11-3v-16z" fill="#392701"/>
                                    <path transform="translate(775,867)" d="m0 0h1l1 15 6-2 1-4 4 1 3 7 3-1 1 1v18h-3v-2l-4-2-3-1-8 3-1-1-1-7z" fill="#FDBD55"/>
                                    <path transform="translate(734,878)" d="m0 0 4 2 3 4 1 4 3 1v-9h1l1 9v9l-1 1h-21l-1-18 8 2 1-4z" fill="#FCB851"/>
                                    <path transform="translate(1343,977)" d="m0 0h3l3 5v2l3 1v2h21v1l-21 1-8 4-9 2-12-2-4-4 2-4 2-1 15-2z" fill="#3A2801"/>
                                    <path transform="translate(1362,874)" d="m0 0h2l2 4h4 2v18l-3 4-7-2-5 4-3 1-1-1v-12l3-1 4-10z" fill="#FDBD55"/>
                                    <path transform="translate(671,878)" d="m0 0h1v72l2 16 1 5-3-4-2-7-2-21-3-4h-1l-1-9v-18l2-2 4-15z" fill="#382600"/>
                                    <path transform="translate(1373,861)" d="m0 0 2 4 1 38 2 16v14l-2 23-1 30-2 1z" fill="#523902"/>
                                    <path transform="translate(815,852)" d="m0 0 7 1 5 2v14l-5-2-2-2-8-1-13 1-2-4v-6l8-1z" fill="#392701"/>
                                    <path transform="translate(866,848)" d="m0 0h7l2 5h66v1h-64v8l-2 2v-2l-3-1v-2h-8l-7 2h-5l-2-7 6-3z" fill="#3E2A01"/>
                                    <path transform="translate(1327,850)" d="m0 0h12l7 1 4 4v10l-6-2-5-2-9-1-2-1v2l-7-1-1-4-3-1 2-2z" fill="#392701"/>
                                    <path transform="translate(1290,851)" d="m0 0 7 3-1 11-11-1-8 3-1 1h-5v-9l9-6z" fill="#392701"/>
                                    <path transform="translate(851,976)" d="m0 0 1 2 4 2 9 3 8-2 4 3v6l-1 2-3 1h-13l-5-2v-2l-5-2z" fill="#392701"/>
                                    <path transform="translate(1246,856)" d="m0 0h1l1 36v95l-2-2-1-72z" fill="#523902"/>
                                    <path transform="translate(1225,553)" d="m0 0h2l-4 21-2 2-2-11-7 1-5 1-1 3-9 3 2-4 19-12z" fill="#FDC658"/>
                                    <path transform="translate(671,878)" d="m0 0h1v72l2 16 1 5-3-4-2-7-1-9v-60z" fill="#523902"/>
                                    <path transform="translate(1177,933)" d="m0 0h35l-3 4-11 1h-13l-7-2z" fill="#231800"/>
                                    <path transform="translate(831,559)" d="m0 0 10 5 18 13 9 7-1 2-8-4-4-4-7-4-15-10v-2h-2z" fill="#FDC457"/>
                                    <path transform="translate(1185,905)" d="m0 0h9l12 3v1h-25z" fill="#231800"/>
                                    <path transform="translate(741,893)" d="m0 0 4 2 1 4h-17v-2l9-2z" fill="#FDC457"/>
                                    <path transform="translate(782,988)" d="m0 0h10l-1 5h-7l-3-3z" fill="#231800"/>
                                    <path transform="translate(710,875)" d="m0 0h8l4 3v5l-6-3-6-4z" fill="#3B2801"/>
                                    <path transform="translate(933,988)" d="m0 0h5l-4 4h-8l-9-2v-1z" fill="#231800"/>
                                    <path transform="translate(821,553)" d="m0 0 8 4v2l-6 1z" fill="#FCBF54"/>
                                </svg>
                            
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
