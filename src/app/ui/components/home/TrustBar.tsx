import React from "react";

const PILLARS = [
    "TECH MENTORSHIP",
    "iSHARE ARCHIVES",
    "SELFLESS GIVING",
    "BUSINESS STRATEGY",
    "iTRAIN WORKSHOPS",
    "CROSS-CLASS EXCHANGE",
    "MUTUAL ELEVATION",
    "DIGITAL LITERACY",
];

const TrustBar: React.FC = () => {
    // Double the array to create a seamless infinite loop
    const displayPillars = [...PILLARS, ...PILLARS];

    return (
        <div className="w-full py-16 bg-white overflow-hidden flex flex-col items-center border-b border-purple-950/5">
            <p className="text-xs font-bold text-purple-950/50 uppercase tracking-[0.2em] mb-12 text-center px-6">
                Our community is anchored by a shared culture of
            </p>

            <div className="flex w-full relative group">
                {/* Visual fade gradient on the sides for a seamless viewport bleed */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* Scroller Track */}
                <div className="flex items-center gap-16 md:gap-28 animate-scroll whitespace-nowrap will-change-transform">
                    {displayPillars.map((name, index) => (
                        <span
                            key={index}
                            className="text-lg md:text-xl font-black text-purple-950/20 tracking-wider transition-all duration-300 cursor-default select-none hover:text-orange-500 hover:scale-105"
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Injecting Tailwind Keyframe Extension for layout injection safety */}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 35s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default TrustBar;