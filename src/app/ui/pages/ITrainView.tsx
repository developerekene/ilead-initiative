import React, { useState } from "react";
import AcademicConsultationForm from "../components/AcademicConsultationForm";
import AdminVerificationPanel from "../components/AdminVerificationPanel";
import CgpaSimulator from "../components/CgpaSimulator";
import ConsultantCaseTracker from "../components/ConsultantCaseTracker";
import ConsultantDirectory from "../components/ConsultantDirectory";
import EarnedCertificateOrangeView from "../components/EarnedCertificateView";
import Hero from "../components/home/Hero";
import ILearnOnboarding from "../components/ILearnOnboarding";
import ImpactCounter from "../components/ImpactCounter";
import ITrainCertificateGenerator from "../components/ITrainCertificateGenerator";
import ITrainScheduler from "../components/ITrainScheduler";
import ITrainVideoVault from "../components/ITrainVideoVault";
import SessionFeedbackModal from "../components/SessionFeedbackModal";
import StudyHabitsAssessment from "../components/StudyHabitsAssessment";
import VideoTestimonialUpload from "../components/VideoTestimonialUpload";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/slices/User";
import toast from "react-hot-toast";
import JoinWorkshop from "../components/itrain/JoinWorkshop";

const ITrainView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [joinWorkshopOpen, setJoinWorkshopOpen] = useState(false);

  const handleCreatePost = (type: string) => {
    if (!isLoggedIn) {
      toast.error("You need to be signed in to post.", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      navigate("/sign-in", { state: { from: location } });
      return;
    }

    if (type === "Join a Workshop") setJoinWorkshopOpen(true);
    else setJoinWorkshopOpen(false);
  };
  return (
    <div>
      <Hero
        badge="iTrain Peer Ecosystem"
        firstTitle="Learn the way."
        secondTitle="Show how to"
        thirdTitle="fish"
        desc="True empowerment isn't just about receiving help, it is about uncovering your own capabilities and learning your own limitations by teaching others. iTrain is our dedicated, interactive hub where students master effective study habits, map out strategic CGPA milestones, and engage in real-time academic consultation with verified professionals before and after university."
        buttonOneText="Join a Workshop"
        buttonTwoText="Speak with a Consultant"
        btnOneNavigation="/"
        btnTwoNavigation="https://calendly.com/stellaeneh302/30min"
        btnOneOnClick={() => handleCreatePost("Join a Workshop")}
      />
      <ILearnOnboarding />
      <ImpactCounter />
      <StudyHabitsAssessment />
      <CgpaSimulator />
      <AcademicConsultationForm />
      <ConsultantDirectory />
      <ITrainScheduler />
      <ITrainVideoVault />
      <VideoTestimonialUpload />
      <ITrainCertificateGenerator />
      <EarnedCertificateOrangeView />
      <ConsultantCaseTracker />
      <AdminVerificationPanel />
      {/* <SessionFeedbackModal /> */}
      <JoinWorkshop
        isOpen={joinWorkshopOpen}
        onClose={() => setJoinWorkshopOpen(false)}
      />
    </div>
  );
};

export default ITrainView;
