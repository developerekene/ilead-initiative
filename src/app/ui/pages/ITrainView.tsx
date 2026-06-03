import React from 'react'
import AcademicConsultationForm from '../components/AcademicConsultationForm'
import AdminVerificationPanel from '../components/AdminVerificationPanel'
import CgpaSimulator from '../components/CgpaSimulator'
import ConsultantCaseTracker from '../components/ConsultantCaseTracker'
import ConsultantDirectory from '../components/ConsultantDirectory'
import EarnedCertificateOrangeView from '../components/EarnedCertificateView'
import Hero from '../components/Hero'
import ILearnOnboarding from '../components/ILearnOnboarding'
import ImpactCounter from '../components/ImpactCounter'
import ITrainCertificateGenerator from '../components/ITrainCertificateGenerator'
import ITrainScheduler from '../components/ITrainScheduler'
import ITrainVideoVault from '../components/ITrainVideoVault'
import SessionFeedbackModal from '../components/SessionFeedbackModal'
import StudyHabitsAssessment from '../components/StudyHabitsAssessment'
import VideoTestimonialUpload from '../components/VideoTestimonialUpload'

const ITrainView = () => {
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
                btnOneNavigation='/'
                btnTwoNavigation='/'
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
        </div>
    )
}

export default ITrainView