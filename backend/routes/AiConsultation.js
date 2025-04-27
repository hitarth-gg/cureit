const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const { TextToSpeechClient } = require("@google-cloud/text-to-speech");

const creds = JSON.parse(process.env.TTS_SA_KEY_JSON);
const ttsClient = new TextToSpeechClient({ credentials: creds });

router.post("/consult", async (req, res) => {
  console.log("hit /consult");

  const { prompt, voiceId = "JBFqnCBsd6RMkjVDRZzb" } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    // 1. Call Gemini AI
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`;
    const geminiResp = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${prompt} You are a physician providing concise, evidence-based advice. Generate a short, 20–30 word reply; be minimal. If outside your domain, reply "Sorry that is not in my domain."`,
              },
            ],
          },
        ],
      }),
    });
    if (!geminiResp.ok) {
      const txt = await geminiResp.text();
      throw new Error(`Gemini API error: ${txt}`);
    }
    const geminiData = await geminiResp.json();
    const replyText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!replyText) throw new Error("No reply from Gemini");
    console.log("AI reply:", replyText);

    // 2. Call ElevenLabs TTS
    // const ttsResp = await fetch(
    //   `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "xi-api-key": process.env.ELEVENLABS_API_KEY,
    //     },
    //     body: JSON.stringify({
    //       text: replyText,
    //       model_id: "eleven_multilingual_v2",
    //       voice_settings: { stability: 0.5, similarity_boost: 0.5 },
    //     }),
    //   }
    // );
    // if (!ttsResp.ok) {
    //   const txt = await ttsResp.text();
    //   throw new Error(`ElevenLabs API error: ${txt}`);
    // }

    // // 3. Base64-encode the MP3 and return JSON
    // const audioBuffer = await ttsResp.arrayBuffer();
    // const audioBase64 = Buffer.from(audioBuffer).toString("base64");
    const ssml = `
    <speak>
      <prosody rate="0.85" pitch="+0st">
        ${replyText}
      </prosody>
    </speak>
  `;

    // Request
    const [ttsResponse] = await ttsClient.synthesizeSpeech({
      input: { ssml },
      voice: {
        languageCode: "en-US",
        name: "en-US-Wavenet-D", // one of Google’s top-quality voices
        ssmlGender: "MALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1.5, // slows the speech slightly
        pitch: 0.8, // leave pitch neutral
        volumeGainDb: 1.5, // you can boost it slightly if needed
      },
    });

    // The API returns a Buffer in `audioContent`
    const audioBase64 = ttsResponse.audioContent.toString("base64");

    res.json({
      replyText,
      audioBase64,
    });
  } catch (err) {
    console.error("Error in /consult:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
