import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function QRScanner({ appointmentId, onScanSuccess }) {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      // Depending on the library version, the scanned result may be an object.
      // For example, data might be like { text: "your-qr-content", ... }
      // Adjust accordingly if data is just a string.
      console.log("hry", appointmentId);
      const qrContent = typeof data === "object" ? data.text : data;
      setScanResult(qrContent);
      console.log("qr_code", qrContent);
      console.log("appointment_id", appointmentId);

      //   Send to backend for validation:
      fetch(`${API_URL}/api/users/validateQR/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qr_code: qrContent,
          appointmentId: appointmentId,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((errorData) => {
              // Throw an error to be caught in catch block.
              throw new Error(errorData.error || "Request failed");
            });
          }
          return res.json();
        })
        .then((responseData) => {
          console.log("Backend response:", responseData);
          onScanSuccess(responseData);
          toast.success("Check In Successfuls");
        })
        .catch((err) => {
          console.error("Error validating QR code:", err);
          setError("Failed to validate QR code");
          onScanSuccess("fail");
          toast.error("Some error occured possibly wrong QR Code Scanned");
        });
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("QR Scanner error: " + err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
    margin: "0 auto",
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Scan QR Code</h2>
      <QrScanner
        delay={300}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      {scanResult && (
        <p>
          <strong>Scanned QR Code:</strong> {scanResult}
        </p>
      )}
      {error && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </p>
      )}
    </div>
  );
}

export default QRScanner;
