import { useState, useRef, useEffect } from "react";
import { Mic, Activity, VolumeX, Volume2, RefreshCw } from "lucide-react";

export default function AIConsultation() {
  const [prompt, setPrompt] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("voice");
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const api = import.meta.env.VITE_API_BASE_URL;

  // Audio visualization setup
  useEffect(() => {
    // Clean up previous resources
    cleanup();

    if (!canvasRef.current) return;

    // Set up idle animation if no audio URL is available
    if (!audioUrl) {
      startIdleAnimation();
      return;
    }

    // Create new audio context for visualization
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 512;

    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      try {
        sourceNodeRef.current =
          audioContextRef.current.createMediaElementSource(audio);
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        startVisualization();
        audio.removeEventListener("canplay", handleCanPlay);
      } catch (err) {
        console.error("Audio setup error:", err);
      }
    };

    if (audio.readyState >= 2) {
      handleCanPlay();
    } else {
      audio.addEventListener("canplay", handleCanPlay);
    }

    // Resume the audio context if it was suspended
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    return cleanup;
  }, [audioUrl]);

  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
  };

  const startIdleAnimation = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const renderIdleFrame = () => {
      animationRef.current = requestAnimationFrame(renderIdleFrame);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Create multiple breathing circles with different phases
      for (let i = 0; i < 5; i++) {
        const phase = i * (Math.PI / 3);
        const size = Math.sin(time + phase) * 20 + 100 - i * 15;
        const opacity = 0.06 - i * 0.01;

        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(125, 80, 255, ${opacity})`;
        ctx.fill();
      }

      // Animated wave at the bottom
      drawWavyLine(ctx, canvas, time);
    };

    renderIdleFrame();
  };

  const drawWavyLine = (ctx, canvas, time) => {
    const amplitude = 15;
    const frequency = 0.02;
    const y = canvas.height * 0.8;

    ctx.beginPath();
    ctx.moveTo(0, y);

    for (let x = 0; x < canvas.width; x++) {
      const yOffset = Math.sin(x * frequency + time) * amplitude;
      ctx.lineTo(x, y + yOffset);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
    gradient.addColorStop(0, "rgba(125, 80, 255, 0.2)");
    gradient.addColorStop(1, "rgba(125, 80, 255, 0.05)");
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;

    // Set canvas dimensions to match container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationRef.current = requestAnimationFrame(renderFrame);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background glow
      const time = Date.now() * 0.0005;
      const breathSize = Math.sin(time) * 30 + 150;

      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, breathSize, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(125, 80, 255, 0.06)";
      ctx.fill();

      // Main frequency waveform
      const barWidth = Math.max(2, (canvas.width / bufferLength) * 2);
      const baseY = canvas.height / 2;
      let x = 0;

      ctx.beginPath();

      // Draw mirrored frequency bars for a more aesthetic waveform
      for (let i = 0; i < bufferLength; i++) {
        const percent = i / bufferLength;
        const barHeight = (dataArray[i] / 255) * (canvas.height / 3);

        // Apply a fade out effect towards the edges
        const edgeFade = 1 - Math.pow(Math.abs(percent - 0.5) * 2, 1.5);
        const scaledHeight = barHeight * edgeFade;

        // Draw top wave
        const xPos = x + barWidth / 2;

        if (i === 0) {
          ctx.moveTo(xPos, baseY - scaledHeight);
        } else {
          ctx.lineTo(xPos, baseY - scaledHeight);
        }

        x += barWidth;
      }

      // Reset x position for bottom side of the wave
      x = canvas.width;

      // Draw bottom wave (in reverse to create a closed path)
      for (let i = bufferLength - 1; i >= 0; i--) {
        const percent = i / bufferLength;
        const barHeight = (dataArray[i] / 255) * (canvas.height / 3);

        // Apply a fade out effect towards the edges
        const edgeFade = 1 - Math.pow(Math.abs(percent - 0.5) * 2, 1.5);
        const scaledHeight = barHeight * edgeFade;

        x -= barWidth;
        const xPos = x + barWidth / 2;
        ctx.lineTo(xPos, baseY + scaledHeight);
      }

      ctx.closePath();

      // Create gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(138, 43, 226, 0.8)");
      gradient.addColorStop(0.5, "rgba(125, 80, 255, 0.4)");
      gradient.addColorStop(1, "rgba(147, 112, 219, 0.8)");

      ctx.fillStyle = gradient;
      ctx.fill();

      // Add subtle glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(125, 80, 255, 0.5)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Additional wave at the bottom for aesthetics
      drawWavyLine(ctx, canvas, time);
    };

    renderFrame();
  };

  const sendQuery = async () => {
    if (!prompt) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${api}/api/AiConsultation/consult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Server returned ${res.status}`);
      }
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.startsWith("audio/")) {
        throw new Error("Expected audio but got " + contentType);
      }

      // Clean up previous audio URL if it exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice input handling
  const startListening = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition not supported in your browser");
    }
  };

  // Toggle audio mute state
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      cleanup();
    };
  }, []);

  // Effect to resize canvas when window size changes
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-purple-700/30 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
            <Activity className="text-purple-300" size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI Health Consultant
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
          <span className="text-sm text-gray-300">System Online</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col p-6 lg:p-8">
        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Visualization panel */}
          <div className="relative col-span-2 overflow-hidden rounded-xl bg-gray-900/50 shadow-lg backdrop-blur-sm">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute bottom-4 right-4 flex gap-3">
              {audioUrl && (
                <button
                  onClick={toggleMute}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/50 text-white hover:bg-gray-700/50"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              )}
              <button
                onClick={() => setAudioUrl(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/50 text-white hover:bg-gray-700/50"
              >
                <RefreshCw size={18} />
              </button>
            </div>

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500"></div>
                  <p className="text-lg font-medium text-purple-200">
                    Processing your request...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Control panel */}
          <div className="flex flex-col rounded-xl bg-gray-900/50 p-6 shadow-lg backdrop-blur-sm">
            <div className="mb-6 flex gap-2 rounded-lg bg-gray-800/50 p-1">
              <button
                onClick={() => setActiveTab("voice")}
                className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-all ${
                  activeTab === "voice"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                Voice Consultation
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-all ${
                  activeTab === "history"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                History
              </button>
            </div>

            {activeTab === "voice" && (
              <>
                <h2 className="mb-3 text-lg font-semibold text-white">
                  Describe Your Symptoms
                </h2>
                <div className="relative mb-4">
                  <textarea
                    className="h-32 w-full resize-none rounded-lg border border-purple-700/30 bg-gray-800/30 p-4 text-white placeholder-gray-400 backdrop-blur-sm focus:border-purple-500 focus:outline-none focus:ring focus:ring-purple-500/20"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your symptoms or ask a health question..."
                  />
                  <button
                    className={`absolute bottom-3 right-3 rounded-full p-2.5 transition-all ${
                      isListening
                        ? "animate-pulse bg-red-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={startListening}
                  >
                    <Mic size={20} />
                  </button>
                </div>

                <button
                  className={`mt-2 rounded-lg py-3.5 font-medium transition-all ${
                    !prompt
                      ? "cursor-not-allowed bg-gray-700 text-gray-400"
                      : "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:from-purple-700 hover:to-blue-600"
                  }`}
                  onClick={sendQuery}
                  disabled={isLoading || !prompt}
                >
                  {isLoading ? "Processing..." : "Get Consultation"}
                </button>
              </>
            )}

            {activeTab === "history" && (
              <div className="flex-1 rounded-lg">
                <h2 className="mb-3 text-lg font-semibold text-white">
                  Recent Consultations
                </h2>
                <div className="flex h-64 flex-col gap-2 overflow-y-auto rounded-lg bg-gray-800/20 p-4">
                  <div className="flex items-center justify-center text-gray-400">
                    <p>No recent consultations</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col">
              <div className="flex items-center gap-2 text-xs text-purple-300">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                <p>
                  AI systems are not a substitute for professional medical
                  advice
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          className="hidden"
          src={audioUrl}
          controls
          autoPlay
          muted={isMuted}
        />
      )}
    </div>
  );
}
