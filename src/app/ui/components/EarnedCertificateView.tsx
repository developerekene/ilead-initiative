import React, { useState } from "react";

interface CertificateMetadata {
    certificateId: string;
    recipientName: string;
    trackName: string;
    roleCompleted: "Learner" | "Consultant/Instructor";
    issueDate: string;
    signatureHash: string;
    verificationUrl: string;
}

const EarnedCertificateOrangeView: React.FC = () => {
    // Simulated credential state payload matched against the unique verification route parameters
    const [certificateData] = useState<CertificateMetadata>({
        certificateId: "ILEAD-TRN-2026-8841F",
        recipientName: "Ekene Okoli",
        trackName: "Advanced CGPA Target Projections & University Preparation",
        roleCompleted: "Learner",
        issueDate: "June 03, 2026",
        signatureHash: "0x7A9D...2E1C4",
        verificationUrl: "https://ilead.org/verify/ILEAD-TRN-2026-8841F"
    });

    const [copied, setCopied] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(certificateData.verificationUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error("Failed to write token routing string to clipboard:", err);
        }
    };

    // Satisfies immediate high-resolution PDF download rule via native layout compiler pipeline
    const handleDownloadPDF = () => {
        window.print();
    };

    return (
        <section className="w-full min-h-screen bg-orange-500 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden print:bg-white print:p-0 print:min-h-0">
            
            {/* Ambient Background Grid Patterns - Hidden during PDF export */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none print:hidden" />
            
            {/* Floating Top Control Panel - Hidden from compiled documents via 'print:hidden' */}
            <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl print:hidden">
                <div className="text-left w-full sm:w-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-100 block">
                        iTrain Security Token
                    </span>
                    <h2 className="text-xs font-bold text-white mt-0.5 tracking-tight">
                        Public Ledger Record: {certificateData.certificateId}
                    </h2>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs rounded-xl tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        {copied ? "✓ Link Copied" : "🔗 Copy Verification Link"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleDownloadPDF}
                        className="flex-1 sm:flex-none px-5 py-2.5 bg-white hover:bg-purple-950 text-orange-600 hover:text-white font-black text-xs rounded-xl tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        📥 Download Certificate
                    </button>
                </div>
            </div>

            {/* High-Contrast Document Canvas Wrapper */}
            <div className="w-full max-w-4xl bg-white text-purple-950 rounded-[2.5rem] p-8 sm:p-14 md:p-16 relative shadow-2xl overflow-hidden print:p-0 print:shadow-none print:border-0 print:my-0">
                
                {/* Dual-Border Classic Cert Framing Structure */}
                <div className="absolute inset-4 border-2 border-orange-500/20 rounded-[2rem] pointer-events-none print:inset-0 print:border-orange-500/40" />
                <div className="absolute inset-6 border border-purple-950/5 rounded-[1.8rem] pointer-events-none print:inset-2" />

                {/* Micro Accents */}
                <div className="absolute -top-10 -left-10 w-28 h-28 border-4 border-orange-500/5 rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-28 h-28 border-4 border-purple-950/5 rounded-full pointer-events-none" />

                {/* Main Content Layout Container */}
                <div className="relative z-10 flex flex-col items-center text-center">
                    
                    {/* Brand Identity Stamp Block */}
                    <div className="mb-6">
                        <span className="font-black text-2xl tracking-tight text-purple-950 block">
                            iLEAD<span className="text-orange-500 text-3xl leading-none">.</span>
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-purple-950/30 block mt-0.5">
                            Ecosystem Training Ecosystem
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-purple-950 tracking-tight uppercase max-w-xl leading-none">
                        Certificate of Achievement
                    </h1>
                    
                    <div className="w-12 h-1 bg-orange-500 my-6 rounded-full" />

                    <p className="text-xs font-bold tracking-widest text-purple-950/40 uppercase">
                        This document serves as verification that
                    </p>
                    
                    <h2 className="text-3xl sm:text-5xl font-black text-orange-500 my-4 tracking-tight drop-shadow-sm">
                        {certificateData.recipientName}
                    </h2>

                    <p className="text-sm sm:text-base text-purple-950/70 font-semibold max-w-xl leading-relaxed">
                        has completed all rigorous core modules and shared learning milestones required to graduate 
                        the specialized consultative track:
                    </p>
                    
                    {/* Dynamic Course Payload Layer */}
                    <div className="my-6 p-5 bg-orange-50/50 border border-orange-500/10 rounded-2xl max-w-xl w-full">
                        <span className="text-base font-black text-purple-950 block leading-snug">
                            {certificateData.trackName}
                        </span>
                        <span className="text-[10px] font-black text-white bg-purple-950 border border-purple-900 px-2.5 py-0.5 rounded-md uppercase tracking-wider mt-2.5 inline-block">
                            Verified Role: {certificateData.roleCompleted}
                        </span>
                    </div>

                    <p className="text-xs text-purple-950/50 font-medium max-w-md leading-relaxed">
                        Honoring our core mandate: to cultivate individual potential, learn institutional limitations by teaching others, and always lift as we climb.
                    </p>

                    {/* Validation Ledger Footer */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 pt-8 border-t border-purple-950/5 items-end text-left sm:text-center">
                        
                        {/* Meta Pillar 1: Temporal Validation */}
                        <div className="order-2 sm:order-1 flex flex-col sm:items-center">
                            <span className="text-[9px] font-black text-purple-950/40 uppercase tracking-wider block">
                                Verification Date
                            </span>
                            <span className="text-xs font-black text-purple-950 mt-1">
                                {certificateData.issueDate}
                            </span>
                        </div>

                        {/* Meta Pillar 2: Core QR Identification Gateway */}
                        <div className="order-1 sm:order-2 flex flex-col items-start sm:items-center justify-center p-3 border border-orange-500/20 rounded-xl bg-orange-50/30 select-all max-w-[220px] mx-auto w-full">
                            <div className="w-12 h-12 bg-purple-950 rounded-lg mb-2 flex items-center justify-center p-1 shrink-0">
                                {/* Vector simulation grid block representing standard scanners */}
                                <div className="w-full h-full border border-white border-dashed rounded opacity-70" />
                            </div>
                            <span className="text-[8px] font-black text-purple-950 tracking-wider uppercase block">
                                Unique Secure ID
                            </span>
                            <span className="text-[9px] font-semibold text-purple-950/60 font-mono tracking-tight text-center break-all mt-0.5 line-clamp-1">
                                {certificateData.certificateId}
                            </span>
                        </div>

                        {/* Meta Pillar 3: Cryptographic Signature Stamp */}
                        <div className="order-3 flex flex-col sm:items-center">
                            <span className="font-serif italic text-xl text-purple-900 tracking-tight block sm:text-center h-6 leading-none">
                                iTrain Directorate
                            </span>
                            <div className="w-20 h-px bg-purple-950/10 my-1.5" />
                            <span className="text-[9px] font-black text-purple-950/40 uppercase tracking-wider block">
                                Authentication Hash
                            </span>
                            <span className="text-[9px] font-semibold text-purple-950/60 font-mono block mt-0.5">
                                {certificateData.signatureHash}
                            </span>
                        </div>

                    </div>

                </div>
            </div>

            {/* Print Override Layout Configuration Style Tags */}
            {/* Forces clean processing on black/white outputs or landscape PDFs */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    body {
                        background: #ffffff !important;
                        color: #0b0717 !important;
                    }
                    @page {
                        size: letter landscape;
                        margin: 0;
                    }
                }
            `}} />
        </section>
    );
};

export default EarnedCertificateOrangeView;