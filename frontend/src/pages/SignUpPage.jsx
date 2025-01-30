import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Box, Button, Container, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    aadhaarNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="dotted flex h-screen items-center justify-center">
      <div className="relative my-6 flex w-11/12 flex-col gap-y-4 rounded-md border-2 bg-white p-8 font-inter text-sm font-medium text-[#5d5d5d] shadow-2xl shadow-indigo-300 sm:w-8/12 md:w-6/12 lg:w-4/12">
        <div className="absolute left-3 top-3 -z-10 h-full w-full animate-fade-up rounded-md bg-gradient-to-r from-violet-300 to-indigo-400"></div>
        <div className="mb-2 flex select-none text-center font-noto text-base font-semibold md:text-lg">
          Your first appointment is just a sign-up away.
        </div>
        <div className="flex flex-col gap-y-1">
          <span className="">Your Name</span>
          <TextField.Root
            placeholder="Name"
            onChange={(e) =>
              setSignupData({ ...signupData, name: e.target.value })
            }
            value={signupData.name}
          ></TextField.Root>
        </div>

        <div className="flex flex-col gap-y-1">
          <span className="">Email</span>
          <TextField.Root
            placeholder="Email"
            onChange={(e) =>
              setSignupData({ ...signupData, email: e.target.value })
            }
            value={signupData.email}
          ></TextField.Root>
        </div>

        <div className="flex flex-col gap-y-1">
          <span className="">Aadhaar No.</span>
          <TextField.Root
            placeholder="Aadhaar Number"
            onChange={(e) =>
              setSignupData({ ...signupData, aadhaarNumber: e.target.value })
            }
            value={signupData.aadhaarNumber}
          ></TextField.Root>
        </div>

        <div className="flex flex-col gap-y-1">
          <span className="">Phone No.</span>
          <TextField.Root
            placeholder="Phone Number"
            onChange={(e) =>
              setSignupData({ ...signupData, phoneNumber: e.target.value })
            }
            value={signupData.phoneNumber}
          ></TextField.Root>
        </div>

        <div className="flex flex-col gap-y-1">
          <span className="">Password</span>
          <TextField.Root
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) =>
              setSignupData({ ...signupData, password: e.target.value })
            }
            value={signupData.password}
          >
            <TextField.Slot className="relative">
              <Button
                variant="soft"
                color="gray"
                style={{
                  left: "0",
                  top: "0",
                  bottom: "0",
                  padding: "0 10px",
                  marginLeft: "-7px",
                  borderRadius: "4px 0 0 4px",
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </Button>
            </TextField.Slot>
          </TextField.Root>
        </div>
        <Button
          color="iris"
          size="3"
          onClick={() =>
            navigate("/verification", { state: { email: signupData.email } })
          }
        >
          SignUp
        </Button>
        <p
          className="w-fit cursor-pointer select-none border-b border-white text-indigo-700 transition-all duration-200 hover:border-b hover:border-indigo-700"
          onClick={() => navigate("/login")}
        >
          Already have an account? Log In
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
