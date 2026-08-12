import React from "react";
import ConsultantDirectory from "./ConsultantDirectory";

const ConsultationPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-14 pb-10">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-purple-950 mb-4">
            Your Goals.
            <span className="text-orange-500"> Our Expertise. </span>
          </h1>
          <p className="text-base sm:text-lg text-purple-950/60 font-medium leading-relaxed">
            Stop guessing and start moving forward with confidence. We provide
            tailored consulting solutions that help businesses identify
            opportunities, overcome challenges, and turn ambitious ideas into
            measurable results.
          </p>
        </div>
      </div>
      <ConsultantDirectory />
    </div>
  );
};

export default ConsultationPage;
