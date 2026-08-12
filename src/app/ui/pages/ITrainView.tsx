import React, { useState } from "react";
import AcademicConsultationForm from "../components/itrain/AcademicConsultationForm";
import Hero from "../components/home/Hero";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/slices/User";
import toast from "react-hot-toast";
import ILearnOnboarding from "../components/itrain/ILearnOnboarding";
import ImpactCounter from "../components/itrain/ImpactCounter";
import StudyHabitsAssessment from "../components/itrain/StudyHabitsAssessment";
import CgpaSimulator from "../components/itrain/CgpaSimulator";
import ConsultantDirectory from "../components/itrain/ConsultantDirectory";
import ITrainScheduler from "../components/itrain/ITrainScheduler";
import ITrainVideoVault from "../components/itrain/ITrainVideoVault";
import ITrainCertificateGenerator from "../components/itrain/ITrainCertificateGenerator";
import VideoTestimonialUpload from "../components/itrain/VideoTestimonialUpload";
import EarnedCertificateOrangeView from "../components/itrain/EarnedCertificateView";
import ConsultantCaseTracker from "../components/itrain/ConsultantCaseTracker";
import AdminVerificationPanel from "../components/AdminVerificationPanel";
import SessionFeedbackModal from "../components/SessionFeedbackModal";

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
        btnOneNavigation="/iTrain/workshops"
        btnTwoNavigation="/iTrain/consultants"
      />
      <ILearnOnboarding />
      <ImpactCounter />
      <StudyHabitsAssessment />
      {/* <CgpaSimulator /> */}
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
    </div>
  );
};

export default ITrainView;
