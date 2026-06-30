import React, { useState, useEffect } from "react";

interface CourseRow {
    id: string;
    name: string;
    creditHours: number;
    expectedGrade: string; // "A", "B", etc.
}

// Grade point dictionary mapping for calculation scales
const GRADE_VALUES: Record<number, Record<string, number>> = {
    5: { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 },
    4: { A: 4, B: 3, C: 2, D: 1, E: 0, F: 0 }
};

const CgpaSimulator: React.FC = () => {
    // State configuration
    const [scale, setScale] = useState<4 | 5>(5);
    const [currentCgpa, setCurrentCgpa] = useState<number>(0);
    const [completedCredits, setCompletedCredits] = useState<number>(0);
    const [targetCgpa, setTargetCgpa] = useState<number>(4.5);
    const [futureCreditsNeeded, setFutureCreditsNeeded] = useState<number>(30);

    // Dynamic list of sandbox courses for the calculation row matrix
    const [courses, setCourses] = useState<CourseRow[]>([
        { id: "1", name: "Introduction to Strategy", creditHours: 3, expectedGrade: "A" },
        { id: "2", name: "Research Methodology", creditHours: 4, expectedGrade: "B" },
        { id: "3", name: "Advanced Communication Skills", creditHours: 3, expectedGrade: "A" }
    ]);

    // Derived outputs
    const [simulatedGpa, setSimulatedGpa] = useState<number>(0);
    const [newProjectedCgpa, setNewProjectedCgpa] = useState<number>(0);
    const [requiredFutureGpa, setRequiredFutureGpa] = useState<number | null>(null);

    // Perform instantaneous mathematical re-calculations on any state structural update
    useEffect(() => {
        // 1. Calculate Semester GPA of the current sandbox table entries
        let totalSandboxQualityPoints = 0;
        let totalSandboxCredits = 0;

        courses.forEach(course => {
            const gradePoints = GRADE_VALUES[scale][course.expectedGrade] || 0;
            totalSandboxQualityPoints += gradePoints * course.creditHours;
            totalSandboxCredits += course.creditHours;
        });

        const semesterGpa = totalSandboxCredits > 0 ? totalSandboxQualityPoints / totalSandboxCredits : 0;
        setSimulatedGpa(Number(semesterGpa.toFixed(2)));

        // 2. Compute New Collective Combined Projected CGPA
        const pastQualityPoints = currentCgpa * completedCredits;
        const aggregateQualityPoints = pastQualityPoints + totalSandboxQualityPoints;
        const aggregateCredits = completedCredits + totalSandboxCredits;

        const prospectiveCgpa = aggregateCredits > 0 ? aggregateQualityPoints / aggregateCredits : semesterGpa;
        setNewProjectedCgpa(Number(prospectiveCgpa.toFixed(2)));

        // 3. Project necessary parameters to hit the target metrics
        if (targetCgpa > scale) {
            setRequiredFutureGpa(null);
            return;
        }

        const ultimateTargetCredits = aggregateCredits + futureCreditsNeeded;
        const totalPointsRequiredToHitTarget = targetCgpa * ultimateTargetCredits;
        const remainingPointsDeficit = totalPointsRequiredToHitTarget - aggregateQualityPoints;

        if (futureCreditsNeeded > 0) {
            const neededGpaCurve = remainingPointsDeficit / futureCreditsNeeded;
            setRequiredFutureGpa(neededGpaCurve);
        } else {
            setRequiredFutureGpa(null);
        }

    }, [scale, currentCgpa, completedCredits, targetCgpa, futureCreditsNeeded, courses]);

    // Handle course inline table modifications
    const updateCourse = (id: string, field: keyof CourseRow, value: any) => {
        setCourses(prev => prev.map(course => {
            if (course.id === id) {
                return { ...course, [field]: value };
            }
            return course;
        }));
    };

    const addNewRow = () => {
        const newId = (courses.length + 1).toString();
        setCourses([...courses, { id: newId, name: `Course Module ${newId}`, creditHours: 3, expectedGrade: "B" }]);
    };

    const removeRow = (id: string) => {
        if (courses.length > 1) {
            setCourses(courses.filter(c => c.id !== id));
        }
    };

    return (
        <section className="w-full max-w-6xl mx-auto p-6 md:p-10 bg-white rounded-[2.5rem] border border-purple-950/5 shadow-xl shadow-purple-950/5 my-10">
            {/* Header Identity Block */}
            <div className="mb-10 pb-6 border-b border-purple-950/5">
                <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-md border border-orange-100">
                    Interactive Simulator
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-purple-950 mt-3 tracking-tight">
                    CGPA Tracking & Projection Sandbox
                </h3>
                <p className="text-sm md:text-base text-purple-950/60 font-medium mt-1">
                    Map out upcoming terms, simulate target variables, and calculate your academic growth limits instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Historical Baselines & Configuration Input Matrix */}
                <div className="lg:col-span-4 bg-slate-50/60 p-6 md:p-8 rounded-3xl border border-purple-950/[0.02] space-y-6">
                    <h4 className="text-sm font-black text-purple-950 uppercase tracking-wider">
                        1. Baseline Configurations
                    </h4>

                    {/* Scale Picker Selector Row */}
                    <div>
                        <label className="text-xs font-bold text-purple-950/70 block mb-2">Grading System Scale</label>
                        <div className="grid grid-cols-2 bg-slate-200/50 p-1 rounded-xl">
                            <button
                                onClick={() => { setScale(5); if (currentCgpa > 4) setCurrentCgpa(0); }}
                                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${scale === 5 ? "bg-white text-purple-950 shadow-sm" : "text-purple-950/50 hover:text-purple-950"}`}
                            >
                                5.0 Scale System
                            </button>
                            <button
                                onClick={() => { setScale(4); if (currentCgpa > 4) setCurrentCgpa(0); }}
                                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${scale === 4 ? "bg-white text-purple-950 shadow-sm" : "text-purple-950/50 hover:text-purple-950"}`}
                            >
                                4.0 Scale System
                            </button>
                        </div>
                    </div>

                    {/* Historical Completed Records Row Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-purple-950/70 block mb-1.5">Current CGPA</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max={scale}
                                value={currentCgpa || ""}
                                onChange={(e) => setCurrentCgpa(Math.min(scale, Math.max(0, parseFloat(e.target.value) || 0)))}
                                placeholder="3.75"
                                className="w-full bg-white border border-purple-950/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-purple-950 focus:outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-purple-950/70 block mb-1.5">Earned Credits</label>
                            <input
                                type="number"
                                min="0"
                                value={completedCredits || ""}
                                onChange={(e) => setCompletedCredits(Math.max(0, parseInt(e.target.value) || 0))}
                                placeholder="45"
                                className="w-full bg-white border border-purple-950/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-purple-950 focus:outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-purple-950/5 my-2" />

                    <h4 className="text-sm font-black text-purple-950 uppercase tracking-wider pt-2">
                        2. Long-Term Target Simulation
                    </h4>

                    {/* Ultimate Target Variables Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-purple-950/70 block mb-1.5">Target CGPA</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max={scale}
                                value={targetCgpa || ""}
                                onChange={(e) => setTargetCgpa(Math.min(scale, Math.max(0, parseFloat(e.target.value) || 0)))}
                                placeholder="4.50"
                                className="w-full bg-white border border-purple-950/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-purple-950 focus:outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-purple-950/70 block mb-1.5">Future Credits</label>
                            <input
                                type="number"
                                min="0"
                                value={futureCreditsNeeded || ""}
                                onChange={(e) => setFutureCreditsNeeded(Math.max(0, parseInt(e.target.value) || 0))}
                                placeholder="30"
                                className="w-full bg-white border border-purple-950/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-purple-950 focus:outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side: Dynamic Spreadsheet Grid Matrix */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-black text-purple-950 uppercase tracking-wider">
                                3. Semester Course Term Sandbox
                            </h4>
                            <button
                                onClick={addNewRow}
                                className="bg-purple-950 hover:bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                                <span>+</span> Add Course Module
                            </button>
                        </div>

                        {/* Interactive Table Grid Structure */}
                        <div className="overflow-x-auto border border-purple-950/5 rounded-2xl">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="bg-purple-950 text-white text-xs font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3.5">Course Title / Description</th>
                                        <th className="px-4 py-3.5 w-28">Credit Hours</th>
                                        <th className="px-4 py-3.5 w-32">Expected Grade</th>
                                        <th className="px-4 py-3.5 w-12 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-purple-950/5">
                                    {courses.map((course) => (
                                        <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={course.name}
                                                    onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                                                    className="w-full bg-transparent border-b border-transparent hover:border-purple-950/10 focus:border-orange-500 focus:outline-none py-1 text-purple-950 font-medium transition-all"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="6"
                                                    value={course.creditHours || ""}
                                                    onChange={(e) => updateCourse(course.id, "creditHours", Math.max(1, parseInt(e.target.value) || 0))}
                                                    className="w-16 bg-slate-50 border border-purple-950/10 rounded-lg px-2 py-1 font-semibold text-center text-purple-950 focus:outline-none focus:border-orange-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={course.expectedGrade}
                                                    onChange={(e) => updateCourse(course.id, "expectedGrade", e.target.value)}
                                                    className="w-24 bg-slate-50 border border-purple-950/10 rounded-lg px-2 py-1 font-semibold text-purple-950 focus:outline-none focus:border-orange-500"
                                                >
                                                    {Object.keys(GRADE_VALUES[scale]).map((grade) => (
                                                        <option key={grade} value={grade}>Grade {grade}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => removeRow(course.id)}
                                                    disabled={courses.length <= 1}
                                                    className="text-purple-950/30 hover:text-rose-500 disabled:opacity-30 disabled:hover:text-purple-950/30 transition-colors font-bold text-base cursor-pointer"
                                                    title="Remove course"
                                                >
                                                    &times;
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Micro-Realtime Visual Output Metric Indicators */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                            <span className="text-[10px] font-black uppercase text-purple-950/50 tracking-wider block">Sandbox Term GPA</span>
                            <span className="text-2xl font-black text-purple-950 mt-0.5 block">{simulatedGpa}</span>
                        </div>
                        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                            <span className="text-[10px] font-black uppercase text-orange-950/50 tracking-wider block">New Projected CGPA</span>
                            <span className="text-2xl font-black text-orange-500 mt-0.5 block">{newProjectedCgpa}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Automated Visual Output Target Analysis Alerts */}
            <div className="mt-8 pt-6 border-t border-purple-950/5">
                {requiredFutureGpa === null ? (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl px-5 py-4 text-xs sm:text-sm font-medium flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        Adjust your Baseline Completed Hours, Target CGPA, and Future Credits to calculate structural pathway optimizations.
                    </div>
                ) : requiredFutureGpa > scale ? (
                    <div className="bg-rose-50 border border-rose-100 text-rose-900 rounded-2xl px-5 py-4 text-xs sm:text-sm font-medium flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse" />
                        <strong>Deficit Alert:</strong> Your requested target of <span className="font-black">{targetCgpa}</span> cannot mathematically be accomplished within the remaining {futureCreditsNeeded} credits based on current trends. You must adjust your targets or increase future term credit allocations.
                    </div>
                ) : requiredFutureGpa <= 0 ? (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-2xl px-5 py-4 text-xs sm:text-sm font-medium flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <strong>Target Secured:</strong> Excellent configuration baseline. Based on cumulative calculations, your milestone target is safely secure. Keep maintaining standard passes to maintain momentum!
                    </div>
                ) : (
                    <div className="bg-purple-950 text-white rounded-2xl px-5 py-4 text-xs sm:text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 animate-pulse" />
                            <div>
                                <span className="font-bold text-purple-200 uppercase tracking-wider text-[10px] block mb-0.5">Recommended Track Strategy</span>
                                To achieve your ultimate target CGPA milestone of <span className="text-orange-400 font-bold">{targetCgpa}</span>, you must secure a minimum aggregate GPA benchmark of <span className="text-orange-400 font-black">{requiredFutureGpa.toFixed(2)}</span> across your future remaining {futureCreditsNeeded} course credits.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CgpaSimulator;