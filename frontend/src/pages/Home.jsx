import { Typewriter } from "react-simple-typewriter";
import CureitLogoWhite from "../assets/CureitLogoWhite.png";
import docotorsImage from "../assets/doctors.png";
import { useCureitContext } from "../utils/ContextProvider";
import { Button } from "@radix-ui/themes";
import Features from "../components/Features";
import { useNavigate } from "react-router-dom";

function Home() {
  const { theme } = useCureitContext();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col overflow-hidden font-noto">
      <div className="dotted flex h-[96svh] animate-fade-up flex-col items-center justify-center py-32 md:justify-around lg:flex-row">
        <div className="flex flex-col items-center justify-center p-8">
          <img
            src={CureitLogoWhite}
            alt="Cureit Logo"
            className="h-20 md:h-28 lg:h-32"
          />
          <div class="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-[#79797949] to-transparent"></div>
          <p className="h-7 w-96 text-center font-medium tracking-wider">
            <Typewriter
              loop={true}
              deleteSpeed={20}
              typeSpeed={50}
              delaySpeed={2000}
              words={["Welcome to CureIt.", "Appointment Booking made easy!"]}
              cursor={true}
            />
          </p>
          <div className="mt-12 flex w-full justify-center gap-x-4">
            <Button
              color="iris"
              size="3"
              variant="soft"
              className="my-4"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
            <Button color="iris" size="3" variant="" className="my-4">
              Book Appointment
            </Button>
          </div>
        </div>
        <div className="relative">
          <img
            src={docotorsImage}
            alt="doctors"
            className="h-64 object-cover md:h-72 lg:h-96"
          />
          <div className="gradient left-10 top-[-90px] opacity-50"></div>
        </div>
      </div>
      <Features />
    </div>
  );
}

export default Home;
