import { Button, Code } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function AccountVerification() {
  const location = useLocation();
  const email = location?.state?.email || "undefined email";
  // add 1.5min timer to resend email

  const [timer, setTimer] = useState(90); // Initial timer value in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval); // Cleanup interval
  }, [timer, isTimerActive]);

  const handleResend = () => {
    // Trigger email resend logic here
    console.log("Resend email triggered!");

    // Start timer
    setTimer(90);
    setIsTimerActive(true);
  };

  return (
    <div className="flex h-[94svh] w-full items-center justify-center bg-[#f7f8fa] font-noto font-medium">
      <div className="m-4 flex flex-col items-center justify-center gap-y-4 rounded-lg bg-white p-8 drop-shadow-lg">
        <div className="mb-4 rounded-sm border border-green-400 bg-green-200 px-3 py-1 text-center text-lg font-semibold text-green-900">
          Please verify your email
        </div>
        <div>You're almost there! We sent an email to</div>
        <Code>{email}</Code>
        <div className="mt-4 text-sm">
          Just click on the link in that email to complete your signup.
          <br />
          If you don't see it, you may need to check your spam folder.
        </div>

        <div className="flex flex-col items-center text-sm">
          <div>Still can't find the email?</div>
          <div className="my-1">
            <Button
              color="iris"
              disabled={isTimerActive}
              onClick={handleResend}
            >
              {isTimerActive ? `Resend email in ${timer}s` : `Resend email`}
            </Button>
          </div>
        </div>

        <div className="flex gap-x-1 text-sm">
          <div>Need help?</div>
          <div
            className="cursor-pointer text-indigo-800 underline"
            onClick={() => console.log("Contact Us")}
          >
            Contact Us
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountVerification;
