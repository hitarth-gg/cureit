// import { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";

import { Typewriter } from "react-simple-typewriter";
// import jwt_decode from "jwt-decode";

import CureitLogoWhite from "../assets/CureitLogoWhite.png";
import docotorsImage from "../assets/doctors.png";
import { useCureitContext , useAuthContext } from "../utils/ContextProvider";
import { Button } from "@radix-ui/themes";
import Features from "../components/Features";
import { useNavigate } from "react-router-dom";
// import { supabase } from "../utils/supabaseClient";
import { supabase } from "../utils/supabaseClient";

// imprt useState

function Home() {
  const { theme } = useCureitContext();
  const navigate = useNavigate();
  const token = localStorage.getItem("sb-vakmfwtcbdeaigysjgch-auth-token");
  const userData = token;
  const [userInfo, setUserInfo] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: " ",
    confirmed_at: "",
    last_sign_in_at: "",
    phone: "",
  });
  // const user = useAuthContext();
  // useEffect(()=>{console.log(user)},[user])

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
            {token ? (
              <Button
                color="iris"
                size="3"
                variant="soft"
                className="my-4"
                onClick={() => navigate("/user/dashboard")}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                color="iris"
                size="3"
                variant="soft"
                className="my-4"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            )}
            <Button color="iris" size="3" variant="" className="my-4"
              onClick={() => navigate("/bookappointment")}
            >
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
// sbp_c059222e1659f5d235c3f3ad6ef20cdbd3819072
