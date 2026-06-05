import React from 'react';
import { Link } from 'react-router-dom';

interface HeroInterface {
    badge: string,
    firstTitle: string,
    secondTitle: string,
    thirdTitle: string,
    desc: string,
    buttonOneText: string,
    buttonTwoText: string,
    btnOneNavigation: string,
    btnTwoNavigation: string
}

const Hero = ({
    badge,
    firstTitle,
    secondTitle,
    thirdTitle,
    desc,
    buttonOneText,
    buttonTwoText,
    btnTwoNavigation,
    btnOneNavigation
}: HeroInterface) => {
    return (
        <section className="bg-white-500 w-full min-h-screen flex items-center justify-center pt-18 pb-16 relative overflow-hidden">

            {/* Expanded Center Container to stretch across the viewport sides */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 w-full flex flex-col items-center text-center relative z-10">

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 mb-8 tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    {badge}
                </div>

                {/* Widened Heading Box */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tight text-purple-950 leading-[1.12] mb-8 w-full max-w-4xl">
                    {firstTitle}{' '}
                    <br className="hidden sm:inline" />
                    {secondTitle} <span className="relative inline-block text-orange-500">
                        {thirdTitle}.
                        <span className="absolute bottom-1.5 left-0 w-full h-[6px] sm:h-[12px] bg-orange-100 rounded-sm -z-10" />
                    </span>
                </h1>

                {/* Widened Paragraph Box for a more comfortable reading line-length */}
                <p className="text-base sm:text-lg md:text-xl text-purple-950/70 font-medium max-w-3xl leading-relaxed tracking-wide mb-12">
                    {desc}
                </p>

                {/* Grounded Button Row with generous tracking widths */}
                <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center items-center">
                    <Link to={btnOneNavigation} className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-orange-500 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 hover:shadow-purple-700/20 cursor-pointer text-base whitespace-nowrap">
                            {buttonOneText}
                        </button>
                    </Link>
                    <Link to={btnTwoNavigation} className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-transparent text-purple-950 border-2 border-purple-100 hover:border-purple-950 hover:bg-purple-50/50 font-bold px-10 py-4 rounded-xl transition-all duration-300 cursor-pointer text-base whitespace-nowrap">
                            {buttonTwoText}
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;