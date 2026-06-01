import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
    const location = useLocation();

    // Check if the current route is the community sign-up section
    const isJoinCommunityPage = location.pathname === '/join-our-commnity';

    return (
        <footer className="w-full bg-white max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-16">

            {/* Conditionally render the Final CTA Card Section */}
            {!isJoinCommunityPage && (
                <div className="w-full bg-purple-950 px-6 py-16 md:py-20 rounded-[2.5rem] text-center text-white mb-20 relative overflow-hidden shadow-2xl shadow-purple-950/20">
                    {/* Ambient interior vector layer accents */}
                    <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-purple-900/40 blur-3xl -z-10" />
                    <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl -z-10" />

                    <div className="max-w-3xl mx-auto flex flex-col items-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] mb-6">
                            Lift as you climb. Build with <span className="text-orange-500">purpose</span>.
                        </h2>
                        <p className="text-base sm:text-lg text-purple-100/80 font-medium max-w-2xl leading-relaxed mb-10">
                            True leadership isn't about standing alone at the top; it's about holding the door open for others.
                            Bring your skills, share your journey, and anchor yourself in an ecosystem built on collective growth.
                        </p>
                        <Link to="/join-our-commnity" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-orange-500 hover:bg-white hover:text-purple-950 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 cursor-pointer text-base whitespace-nowrap">
                                Join the Ecosystem
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Footer Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-purple-100">

                {/* Left Identity Column */}
                <div className="lg:col-span-4 flex flex-col items-start">
                    <h3 className="font-black text-2xl tracking-tight text-purple-950 mb-4">
                        iLEAD<span className="text-orange-500">.</span>
                    </h3>
                    <p className="text-sm sm:text-base text-purple-950/60 font-medium leading-relaxed max-w-xs mb-6">
                        A self-sustaining circle of mentorship where tech expertise, business strategy, and unconditional support meet to bridge social divides and elevate humanity.
                    </p>
                    <div className="flex gap-3">
                        <a href="#" className="w-10 h-10 rounded-full bg-purple-50 hover:bg-orange-500 text-purple-950 hover:text-white flex items-center justify-center font-bold text-sm transition-all duration-300">𝕏</a>
                        <a href="#" className="w-10 h-10 rounded-full bg-purple-50 hover:bg-orange-500 text-purple-950 hover:text-white flex items-center justify-center font-bold text-sm transition-all duration-300">in</a>
                        <a href="#" className="w-10 h-10 rounded-full bg-purple-50 hover:bg-orange-500 text-purple-950 hover:text-white flex items-center justify-center font-bold text-sm transition-all duration-300">IG</a>
                    </div>
                </div>

                {/* Right Navigation Columns */}
                <div className="lg:col-span-2 lg:col-start-6 flex flex-col">
                    <h4 className="text-purple-950 font-bold text-sm uppercase tracking-wider mb-5">Mentorship Hub</h4>
                    <div className="flex flex-col gap-3.5">
                        <Link to="/tech-mentorship" className="text-sm font-medium text-purple-950/60 hover:text-orange-500 transition-colors duration-200">Tech Mentorship</Link>
                        <Link to="/business-strategy" className="text-sm font-medium text-purple-950/60 hover:text-orange-500 transition-colors duration-200">Business Strategy</Link>
                        <Link to="/peer-exchange" className="text-sm font-medium text-purple-950/60 hover:text-orange-500 transition-colors duration-200">Cross-Class Interaction</Link>
                        <Link to="/itrain" className="text-sm font-medium text-purple-950/60 hover:text-orange-500 transition-colors duration-200">iTrain Workshops</Link>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col">
                    <h4 className="text-purple-950 font-bold text-sm uppercase tracking-wider mb-5">Our Philosophy</h4>
                    <div className="flex flex-col gap-3.5">
                        <Link to="/vision" className="text-sm font-medium text-purple-950/60 hover:text-orange-500 transition-colors duration-200">The iLEAD Vision</Link>
                        <Link to="/selfless-giving" className="text-sm font-medium text-purple-950/60 hover:text-orange-500 transition-colors duration-200">Culture of Giving</Link>
                        <Link to="/impact-stories" className="text-sm font-medium text-purple-950/60 hover:text-orange-500 transition-colors duration-200">Human Impact Stories</Link>
                        <Link to="/support" className="text-sm font-medium text-purple-950/60 hover:text-orange-500 transition-colors duration-200">Get Involved</Link>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col">
                    <h4 className="text-purple-950 font-bold text-sm uppercase tracking-wider mb-5">Ecosystem</h4>
                    <div className="flex flex-col gap-3.5">
                        <Link to="/ishare" className="text-sm font-medium text-purple-950/60 hover:text-orange-500 transition-colors duration-200">iShare Knowledge</Link>
                        <Link to="/community-guidelines" className="text-sm font-medium text-purple-950/60 hover:text-orange-500 transition-colors duration-200">Honor Code</Link>
                        <Link to="/privacy" className="text-sm font-medium text-purple-950/60 hover:text-orange-500 transition-colors duration-200">Privacy Charter</Link>
                    </div>
                </div>

            </div>

            {/* Copyright Disclaimer Row */}
            <div className="pt-8 text-center text-xs sm:text-sm font-medium text-purple-950/40">
                &copy; {new Date().getFullYear()} iLEAD Ecosystem. Grounded in selflessness, driven by collaboration, and dedicated to elevating one another.
            </div>
        </footer>
    );
};

export default Footer;