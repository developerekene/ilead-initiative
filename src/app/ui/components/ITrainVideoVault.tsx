import React, { useState } from "react";

interface VideoRecord {
    id: string;
    title: string;
    description: string;
    category: "Testimonials" | "University Guides" | "Study Strategy";
    duration: string;
    thumbnailUrl: string;
    videoUrl: string;
    views: number;
    progressPercentage?: number; // Simulates historical view markers
}

const ITrainVideoVault: React.FC = () => {
    // Active filter state matching Acceptance Criterion #1
    const [activeCategory, setActiveCategory] = useState<"All" | "Testimonials" | "University Guides" | "Study Strategy">("All");

    // State to handle which video is currently loaded into the active viewing theater modal
    const [activeTheaterVideo, setActiveTheaterVideo] = useState<VideoRecord | null>(null);

    // Mock dataset satisfying database schema for repository video assets
    const [vaultVideos] = useState<VideoRecord[]>([
        {
            id: "vid-001",
            title: "Overcoming Choice Paralysis: Choosing My Pre-University Skills",
            description: "How a 1-on-1 consultation session helped restructure my secondary milestones before university admissions open houses.",
            category: "Testimonials",
            duration: "12:45",
            thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            views: 142,
            progressPercentage: 100 // Finished indicator
        },
        {
            id: "vid-002",
            title: "Demystifying the Academic Journey: Navigating UK Admissions Systems",
            description: "A comprehensive breakdown of structural university requirements, grade evaluation matrices, and hidden timeline expectations.",
            category: "University Guides",
            duration: "45:20",
            thumbnailUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            views: 529,
            progressPercentage: 45 // In-progress view marker
        },
        {
            id: "vid-003",
            title: "Deep Focus Methodologies & Sustainable High-Yield Study Habits",
            description: "Moving beyond basic flashcards. Learn structural spatial repetition, focus boundaries, and dynamic calibration routines.",
            category: "Study Strategy",
            duration: "28:10",
            thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            views: 311,
            progressPercentage: 0 // Unstarted view marker
        },
        {
            id: "vid-004",
            title: "From 2.8 to 3.8: How I Calibrated My CGPA Projection Models",
            description: "A student case study detailing how utilizing the dynamic GPA prediction tracking layout led to high-impact course recovery.",
            category: "Testimonials",
            duration: "08:15",
            thumbnailUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            views: 198,
            progressPercentage: 85
        }
    ]);

    // Client-side categorization query filtering execution array
    const filteredVideos = activeCategory === "All"
        ? vaultVideos
        : vaultVideos.filter(video => video.category === activeCategory);

    return (
        <section className="w-full min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">

                {/* Vault Section Context Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-purple-950/5 mb-10">
                    <div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-md border border-orange-100">
                            ITRAIN Media Repository
                        </span>
                        <h2 className="text-3xl font-black text-purple-950 tracking-tight mt-3">Video Records Vault</h2>
                        <p className="text-sm text-purple-950/50 font-medium mt-1">
                            Review core academic masterclasses, direct student testimonials, and professional study workshops asynchronously.
                        </p>
                    </div>

                    {/* Category Filter Controls Row (Acceptance Criterion #1) */}
                    <div className="flex flex-wrap gap-2 bg-slate-100/70 p-1.5 rounded-2xl border border-purple-950/[0.02] overflow-x-auto">
                        {(["All", "Testimonials", "University Guides", "Study Strategy"] as const).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${activeCategory === cat
                                        ? "bg-white text-purple-950 shadow-md shadow-purple-950/5"
                                        : "text-purple-950/50 hover:text-purple-950"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Layout Matrix (Acceptance Criterion #2 & #3) */}
                {filteredVideos.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-purple-950/10">
                        <p className="text-sm text-purple-950/40 font-medium">No recorded session components discovered under this taxonomy block.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVideos.map(video => (
                            <article
                                key={video.id}
                                className="group flex flex-col bg-white border border-purple-950/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-950/[0.03] transition-all duration-300"
                            >
                                {/* Thumbnail Frame & View Markers Integration Container */}
                                <div className="relative aspect-video w-full overflow-hidden bg-purple-950/10 shrink-0">
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />

                                    {/* Duration Timestamp Overlay Tag */}
                                    <span className="absolute bottom-2.5 right-2.5 bg-purple-950/90 backdrop-blur-sm text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                        {video.duration}
                                    </span>

                                    {/* Custom View Status Ribbon / Badges */}
                                    <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-white text-purple-950 shadow-sm border border-purple-950/5">
                                        {video.category}
                                    </span>

                                    {/* Simulated Media Play Target overlay Button Grid */}
                                    <button
                                        onClick={() => setActiveTheaterVideo(video)}
                                        className="absolute inset-0 flex items-center justify-center bg-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                        aria-label={`Launch playback view for ${video.title}`}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                                            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </button>

                                    {/* Continuous View Marker Progress Tracker Line (Acceptance Criterion #2) */}
                                    {video.progressPercentage !== undefined && video.progressPercentage > 0 && (
                                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-purple-950/10">
                                            <div
                                                className={`h-full transition-all ${video.progressPercentage === 100 ? "bg-emerald-500" : "bg-orange-500"}`}
                                                style={{ width: `${video.progressPercentage}%` }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Video Meta Specifications Box Content */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-purple-950/40 mb-1.5">
                                            <span>👁️ {video.views} asynchronous views</span>
                                            {video.progressPercentage === 100 && (
                                                <span className="text-emerald-600 font-extrabold flex items-center gap-0.5">
                                                    ● Completed
                                                </span>
                                            )}
                                            {video.progressPercentage !== undefined && video.progressPercentage > 0 && video.progressPercentage < 100 && (
                                                <span className="text-orange-500 font-extrabold flex items-center gap-0.5">
                                                    ● In Progress
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-sm font-black text-purple-950 tracking-tight leading-snug group-hover:text-orange-500 transition-colors line-clamp-2">
                                            {video.title}
                                        </h3>
                                        <p className="text-xs text-purple-950/50 font-medium mt-1.5 line-clamp-2 leading-relaxed">
                                            {video.description}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setActiveTheaterVideo(video)}
                                        className="w-full text-center mt-4 bg-slate-50 hover:bg-purple-950 hover:text-white border border-purple-950/5 text-purple-950 text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-200 cursor-pointer"
                                    >
                                        Launch Presentation
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Lightbox Video Play Theater Modal Overlay Wrapper (Acceptance Criterion #3 - Flawless scaling) */}
                {activeTheaterVideo && (
                    <div className="fixed inset-0 z-50 bg-purple-950/80 backdrop-blur-sm p-4 sm:p-6 md:p-10 flex items-center justify-center animate-fade-in">
                        <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-purple-950/10 flex flex-col max-h-[90vh]">

                            {/* Modal Internal Control Header Layout */}
                            <div className="flex justify-between items-center px-6 py-4 border-b border-purple-950/5 shrink-0 bg-slate-50/50">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">
                                        {activeTheaterVideo.category} Layer
                                    </span>
                                    <h4 className="text-sm font-black text-purple-950 truncate max-w-sm sm:max-w-xl md:max-w-2xl mt-0.5">
                                        {activeTheaterVideo.title}
                                    </h4>
                                </div>
                                <button
                                    onClick={() => setActiveTheaterVideo(null)}
                                    className="w-8 h-8 rounded-xl bg-purple-950/5 hover:bg-rose-500 hover:text-white text-purple-950 text-sm font-black transition-colors flex items-center justify-center cursor-pointer focus:outline-none"
                                    aria-label="Close media view overlay panel"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Responsive Media Video Player Engine Frame (Acceptance Criterion #3) */}
                            <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden min-h-[240px] sm:min-h-[360px]">
                                <video
                                    src={activeTheaterVideo.videoUrl}
                                    controls
                                    autoPlay
                                    className="w-full h-full max-h-[60vh] object-contain"
                                    style={{ outline: "none" }}
                                />
                            </div>

                            {/* Modal Bottom Detail Footing Area */}
                            <div className="p-6 bg-white shrink-0 border-t border-purple-950/5 hidden sm:block">
                                <p className="text-xs sm:text-sm text-purple-950/60 font-medium leading-relaxed">
                                    {activeTheaterVideo.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default ITrainVideoVault;