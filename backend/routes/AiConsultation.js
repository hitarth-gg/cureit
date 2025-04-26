const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// Your own AI function calling Gemini + ElevenLabs
// router.post("/consult", async (req, res) => {
//   console.log("its a hit in backend consult");

//   const { prompt, voiceId = "JBFqnCBsd6RMkjVDRZzb" } = req.body;

//   try {
//     // 1. Call Gemini AI (Google)
//     const geminiResponse = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `${prompt} You are a physician providing concise, evidence-based advice.Generate a short conscise max 20-30 words reply.Try to be as minimalistic as possible.You are now a physician your reply should be like a physician so if a prompt asks you to answer something not related to medical field. Kindly answer "Sorry that is not in my domain"`,
//                 },
//               ],
//             },
//           ],
//         }),
//       }
//     );

//     if (!geminiResponse.ok) {
//       const errorText = await geminiResponse.text();
//       throw new Error(`Gemini API error: ${errorText}`);
//     }

//     const geminiData = await geminiResponse.json();

//     const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
//     if (!replyText) throw new Error("No reply from Gemini.");

//     console.log("AI reply:", replyText);

//     // 2. Call ElevenLabs Text-to-Speech
//     const elevenResp = await fetch(
//       `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "xi-api-key": process.env.ELEVENLABS_API_KEY,
//         },
//         body: JSON.stringify({
//           text: replyText,
//           model_id: "eleven_multilingual_v2",
//           voice_settings: {
//             stability: 0.5,
//             similarity_boost: 0.5,
//           },
//         }),
//       }
//     );

//     if (!elevenResp.ok) {
//       const errorText = await elevenResp.text();
//       throw new Error(`ElevenLabs API error: ${errorText}`);
//     }

//     const audioBuffer = await elevenResp.arrayBuffer();

//     // 3. Send back audio as MP3

//     res.set("Content-Type", "audio/mpeg");
//     res.send(Buffer.from(audioBuffer));
//   } catch (error) {
//     console.error("Error in /consult:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;
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
    const ttsResp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: replyText,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.5 },
        }),
      }
    );
    if (!ttsResp.ok) {
      const txt = await ttsResp.text();
      throw new Error(`ElevenLabs API error: ${txt}`);
    }

    // 3. Base64-encode the MP3 and return JSON
    const audioBuffer = await ttsResp.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    res.json({
      replyText,
      audioBase64,
    });
  } catch (err) {
    console.error("Error in /consult:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
