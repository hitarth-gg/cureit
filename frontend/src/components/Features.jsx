import Container1 from "./Container1";
import Card1 from "./FeatureCard";

export default function Features() {
  return (
    <div className="my-12 w-full animate-fade-up md:px-5 lg:px-10">
      <div className="mb-5 mt- pl-5 text-left text-2xl md:text-3xl font-semibold text-[#131b20]">
        Optimizing Hospital Queue Management with AI
      </div>
      <div className="max-w-xl text-sm md:text-base pl-5 text-left">
        Four Simplified Steps to Optimize Hospital Queue Management
      </div>
      {/* <div className="features flex w-full flex-col items-center justify-center border-2 text-left sm:mx-5 sm:max-h-fit sm:flex-col md:mx-10 md:flex-row md:space-x-10 lg:mx-20 lg:space-x-10 xl:space-x-20"> */}
      <div className="features flex w-full flex-col justify-center  px-5 md:flex-row md:justify-center">
        <div className="flex flex-col items-center justify-between gap-y-5 gap-x-5  py-5 lg:flex-row">
          <div className="cards left flex h-full w-full lg:w-auto flex-col justify-between gap-y-5">
            <Card1
              title="AI-Powered Queue Prediction"
              text="Use advanced AI algorithms to predict patient arrival times and optimize hospital queue management effectively."
              link="http://localhost:3000/facilitator/signup"
              linkName="Sign Up as Admin"
            />
            <Card1
              title="Automated Appointment Scheduling"
              text="Implement automated scheduling systems to reduce patient waiting times and improve overall patient flow efficiency."
              link="https://www.google.com"
              linkName="Our Input Guidelines and Methodology"
            />
            <Card1
              title="Problem Report Compilation"
              text="AI  will utilize collected data to generate detailed problem reports containing essential diagnostic information."
              link="https://www.google.com"
              linkName="Learn More"
            />
            <Card1
              title="Real-Time Queue Monitoring"
              text="Enable real-time tracking of patient queues to prioritize urgent cases and enhance hospital operations."
              link="https://www.google.com"
              linkName="View How It Works"
            />
          </div>
          <Container1 />
        </div>
        <div className="right flex flex-col items-center justify-center"></div>
      </div>
    </div>
  );
}
