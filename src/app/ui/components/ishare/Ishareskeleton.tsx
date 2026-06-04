import React from "react";

const IShareSkeleton: React.FC = () => (
  <div className="bg-white border border-purple-950/5 rounded-[1.75rem] p-7 flex flex-col gap-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-5 w-20 bg-slate-100 rounded-lg" />
      <div className="h-5 w-14 bg-slate-100 rounded-lg" />
    </div>
    <div className="h-6 w-3/4 bg-slate-100 rounded-lg" />
    <div className="space-y-2">
      <div className="h-3.5 w-full bg-slate-100 rounded" />
      <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
      <div className="h-3.5 w-4/6 bg-slate-100 rounded" />
    </div>
    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-slate-100" />
        <div className="h-3.5 w-20 bg-slate-100 rounded" />
      </div>
      <div className="h-8 w-28 bg-slate-100 rounded-xl" />
    </div>
  </div>
);

export default IShareSkeleton;
