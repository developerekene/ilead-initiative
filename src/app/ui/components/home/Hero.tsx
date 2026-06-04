import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
    return (
        <section className="bg-white-500 w-full min-h-screen flex items-center justify-center pt-28 pb-16 relative overflow-hidden">

            {/* Expanded Center Container to stretch across the viewport sides */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 w-full flex flex-col items-center text-center relative z-10">
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 mb-8 tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    A Cross-Disciplinary Talent Ecosystem
                </div>

                {/* Widened Heading Box */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tight text-purple-950 leading-[1.12] mb-8 w-full max-w-4xl">
                    Cultivate potential.{' '}
                    <br className="hidden sm:inline" />
                    Without the <span className="relative inline-block text-orange-500">
                        isolation.
                        <span className="absolute bottom-1.5 left-0 w-full h-[6px] sm:h-[12px] bg-orange-100 rounded-sm -z-10" />
                    </span>
                </h1>

                {/* Widened Paragraph Box for a more comfortable reading line-length */}
                <p className="text-base sm:text-lg md:text-xl text-purple-950/70 font-medium max-w-3xl leading-relaxed tracking-wide mb-12">
                    True progress does not happen in a vacuum. iLEAD brings together builders,
                    thinkers, and creators across backgrounds and disciplines to exchange insight,
                    bridge the opportunity gap, and build real-world digital literacy together.
                </p>

                {/* Grounded Button Row with generous tracking widths */}
                <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center items-center">
                    <Link to="/community" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-orange-500 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 hover:shadow-purple-700/20 cursor-pointer text-base whitespace-nowrap">
                            Join the Ecosystem
                        </button>
                    </Link>
                    <Link to="/ishare" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-transparent text-purple-950 border-2 border-purple-100 hover:border-purple-950 hover:bg-purple-50/50 font-bold px-10 py-4 rounded-xl transition-all duration-300 cursor-pointer text-base whitespace-nowrap">
                            Learn More
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;