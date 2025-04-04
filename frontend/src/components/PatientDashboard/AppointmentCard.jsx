import { Badge, Button, Code, DataList } from "@radix-ui/themes";
import CancelDialog from "./CancelDialog";
import { useState, useEffect } from "react";
import QRScanner from "./QRscanner.jsx";
import { toast } from "sonner";

function AppointmentCard({ data, refetch }) {
  const {
    appointmentId,
    doctor,
    specialization,
    hospital,
    address,
    appointment_date,
    queuePosition,
    plus_code,
    meetingLink,
    appointment_time,
    checked_in_status,
  } = data;
  const appointmentTypes = ["orange", "blue"];
  const appointmentType =
    appointment_date ===
      new Date().toLocaleDateString("en-IN").replace(/\//g, "-")
      ? appointmentTypes[0]
      : appointmentTypes[1];

  const [expectedTime, setExpectedTime] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (
      appointment_time === "N/A" ||
      queuePosition === "N/A" ||
      isNaN(Number(queuePosition)) ||
      appointment_date === "N/A"
    ) {
      setExpectedTime("N/A");
      return;
    }
    const { start_time, end_time, mode } = appointment_time || {};

    if (!start_time || !end_time) {
      setExpectedTime("N/A");
      return;
    }
    let availableTime = `${appointment_date}T${start_time}`;

    const availableDate = new Date(availableTime);
    const currentTime = new Date();
    const appointmentDay = new Date(appointment_date);
    const queueDelayMinutes = (Number(queuePosition) - 1) * 15;
    const expectedTime = new Date(availableDate.getTime() + queueDelayMinutes * 60000);
    if (mode === "online") {
    }
    if (currentTime.toISOString().split("T")[0] < appointment_date) {
      setExpectedTime(
        expectedTime.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else if (currentTime.toISOString().split("T")[0] === appointment_date) {
      if (currentTime > availableDate) {
        const adjustedTime = new Date(currentTime.getTime() + queueDelayMinutes * 60000);
        setExpectedTime(
          adjustedTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } else {
        setExpectedTime(
          expectedTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
    } else {
      setExpectedTime("N/A");
    }
  }, [appointment_time, queuePosition, appointment_date]);

  const handleScanSuccess = (scanData) => {
    console.log(scanData);

    // Play a sound on successful scan.
    if (scanData != "fail") {
      const audio = new Audio("/cureit/sound/Check_In_Successful.mp3"); // Ensure this file exists in your public folder
      audio.play().catch((err) => console.error("Audio play error:", err));
    }

    console.log("Scanned data:", scanData);
    // Process scanData further (e.g., send to backend)

    // Automatically close the scanner.
    setShowScanner(false);
  };

  return (
    <div>
      <div className="flex justify-between gap-y-1 rounded-md border-2 px-4 py-2 font-noto">
        <DataList.Root
          orientation={{
            initial: "vertical",
            sm: "horizontal",
          }}
          style={{ gap: ".65rem" }}
          size={{
            initial: "1",
            md: "2",
          }}
        >
          <DataList.Item>
            <DataList.Label minWidth="88px">Doctor</DataList.Label>
            <DataList.Value>
              <Code variant="ghost">{doctor}</Code>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="">
            <DataList.Label minWidth="88px">Specialization</DataList.Label>
            <DataList.Value>
              <Badge color="indigo" variant="soft" radius="small">
                {specialization}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Hospital</DataList.Label>
            <DataList.Value>
              <Code variant="ghost">{hospital}</Code>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Address</DataList.Label>
            <DataList.Value>
              <div className="flex items-center gap-x-2">
                <Code variant="ghost">{address}</Code>
                <Button
                  color="iris"
                  size="1"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(plus_code)}`,
                      "_blank",
                    )
                  }
                >
                  Get Directions
                </Button>
              </div>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Mode</DataList.Label>
            <DataList.Value>
            <Badge variant="ghost" color="green">
                {appointment_time.mode}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Expected Time</DataList.Label>
            <DataList.Value>
              <Badge variant="ghost" color={appointmentType}>
                {expectedTime}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Appointment Date</DataList.Label>
            <DataList.Value>
              <Badge variant="" color={appointmentType}>
                {appointment_date}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Queue Position</DataList.Label>
            <DataList.Value>
              <Badge variant="" color={appointmentType}>
                {queuePosition}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <div className="flex items-center justify-start gap-4 md:hidden">
              <CancelDialog data={data} refetch={refetch} />

              {appointment_time.mode === "online" ? (
                <Button
                  onClick={() => window.open(meetingLink, "_blank", "noopener,noreferrer")}
                >
                  <div className="text-xs">Join Meet</div>
                </Button>
              ) : (
                <>
                  {!checked_in_status ? (
                    !showScanner ? (
                      <Button onClick={() => setShowScanner(true)}>
                        <div className="text-xs">Scan QR Code</div>
                      </Button>
                    ) : (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1000,
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            backgroundColor: "#fff",
                            padding: "2rem",
                            borderRadius: "8px",
                            maxWidth: "90%",
                            maxHeight: "90%",
                            overflow: "auto",
                            textAlign: "center",
                          }}
                        >
                          {/* Close Button */}
                          <button
                            onClick={() => setShowScanner(false)}
                            style={{
                              position: "absolute",
                              top: "16px",
                              right: "16px",
                              backgroundColor: "#fff",
                              border: "2px solid red",
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                              fontSize: "20px",
                              color: "red",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 0,
                            }}
                            aria-label="Close"
                          >
                            X
                          </button>

                          <QRScanner
                            appointmentId={appointmentId}
                            onScanSuccess={(data) => {
                              handleScanSuccess(data);
                            }}
                          />
                        </div>
                      </div>
                    )
                  ) : (
                    <Button disabled={true}>
                      Checked In Successfully
                    </Button>
                  )}
                </>
              )}
            </div>
          </DataList.Item>

        </DataList.Root>
        <div>
          <div className="ml-4 mt-5 hidden items-center justify-center gap-4 md:flex">
            <CancelDialog data={data} refetch={refetch} />

            {appointment_time.mode === "online" ? (
              <Button
                onClick={() => window.open(meetingLink, "_blank", "noopener,noreferrer")}
              >
                <div className="text-xs">Join Meet</div>
              </Button>
            ) : (
              <>
                {!checked_in_status ? (
                  !showScanner ? (
                    <Button onClick={() => setShowScanner(true)}>
                      <div className="text-xs">Scan QR Code</div>
                    </Button>
                  ) : (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          backgroundColor: "#fff",
                          padding: "2rem",
                          borderRadius: "8px",
                          maxWidth: "90%",
                          maxHeight: "90%",
                          overflow: "auto",
                          textAlign: "center",
                        }}
                      >
                        {/* Close Button */}
                        <button
                          onClick={() => setShowScanner(false)}
                          style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            backgroundColor: "#fff",
                            border: "2px solid red",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            fontSize: "20px",
                            color: "red",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                          }}
                          aria-label="Close"
                        >
                          X
                        </button>

                        <QRScanner
                          appointmentId={appointmentId}
                          onScanSuccess={(data) => {
                            handleScanSuccess(data);
                          }}
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <Button disabled={true}>
                    Checked In Successfully
                  </Button>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
