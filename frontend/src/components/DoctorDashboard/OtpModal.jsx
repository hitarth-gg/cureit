import {
  Button,
  Dialog,
  Flex,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { toast } from "sonner";

function OtpModal({ otpVerified, setOtpVerified }) {
  const [timer, setTimer] = useState(0); // Initial timer value in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [otpMatchStatus, setOtpMatchStatus] = useState("notVerified"); // notVerified, verified, wrong
  const [modalMessage, setModalMessage] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false); //loading state for sending otp
  const [verifyingOtp, setVerifyingOtp] = useState(false); //loading state for verifying otp

  console.log(otpVerified);

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

  async function sendOtptoPatient() {
    // Send OTP to the patient's email
    // Set the otpVerified to true
    // simulate 2 seconds delay
    setSendingOtp(true);
    setTimer(5);
    setIsTimerActive(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("OTP sent to the patient's email address!");
    setSendingOtp(false);
  }

  async function verifyOtp() {
    // Verify the OTP entered by the patient
    // Set the otpMatchStatus to verified or wrong
    setVerifyingOtp(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOtpMatchStatus("verified");
    setOtpVerified(true);
    setModalMessage("OTP Verified Successfully!"); // or "Wrong OTP entered!"
    setVerifyingOtp(false);
  }

  const [otpStyle, setOtpStyle] = useState("inputStyle");
  useEffect(() => {
    if (otpMatchStatus === "verified") {
      setOtpStyle("inputStyleVerified");
    }
    if (otpMatchStatus === "wrong") {
      setOtpStyle("inputStyleWrong");
    }
  }, []);

  const [otp, setOtp] = useState("");
  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button color={otpVerified ? "green" : "iris"}>
            {otpVerified ? "OTP Verified" : "OTP Verification"}
          </Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>OTP Verification</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Enter the OTP sent to the patient's email address.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <div className="flex justify-center mt-4">
              <OTPInput
                inputStyle={`inputStyle ${otpStyle}`}
                onPaste={(e) => e.preventDefault()}
                value={otp}
                onChange={
                  otpVerified
                    ? () => toast.success("OTP already verified!")
                    : (otp) => setOtp(otp)
                }
                numInputs={6}
                renderSeparator={<span></span>}
                renderInput={(props) => <input {...props} />}
              />
            </div>
            <Flex dir="" justify="center">
              <Dialog.Description size="2" mb={"1"}>
                <div
                  className={
                    "font-medium " +
                    (otpMatchStatus === "wrong"
                      ? `text-red-500`
                      : `text-green-500`)
                  }
                >
                  {modalMessage}
                </div>
                <div className={sendingOtp || verifyingOtp ? "" : "opacity-0"}>
                  <Spinner />
                </div>
              </Dialog.Description>
            </Flex>
          </Flex>

          <Flex gap="3" mt="4" justify="center">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              color="iris"
              disabled={isTimerActive || otpVerified}
              onClick={() => sendOtptoPatient()}
            >
              {isTimerActive ? `Resend OTP in ${timer}s` : `Send OTP`}
            </Button>
            {!otpVerified ? (
              <Button color="iris" onClick={() => verifyOtp()}>
                Verify OTP
              </Button>
            ) : (
              <Button
                color="green"
                onClick={() => toast.success("OTP already verified!")}
              >
                OTP Verified
              </Button>
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export default OtpModal;
