// const express = require("express");
// const router = express.Router();
// const supabase = require("../config/supabaseClient");
// const verifyToken = require("../config/verifyToken");
// const { GoogleGenAI } = require("@google/genai");
// GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
// const ai = new GoogleGenAI({ apiKey: "GOOGLE_GEMINI_API_KEY" });

// async function main_consult(prompt) {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: prompt,
//   });
//   console.log(response.text);
// }

// // Instantiate clients

// router.post("/consult", async (req, res) => {
//   console.log("its a hit in backend tts");
//   const { prompt, voiceId = "JBFqnCBsd6RMkjVDRZzb" } = req.body;

//   try {
//     // 1. Call your AI model (e.g., Gemini)
//     // const aiResp = await fetch("https://your-gemini-endpoint.com/chat", {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify({
//     //     prompt: `${prompt} You are a physician providing concise, evidence-based advice.`,
//     //   }),
//     // });
//     const aiResp = await main_consult(
//       `${prompt} You are a physician providing concise, evidence-based advice`
//     );

//     // const aiResp = "HELLO";
//     const { replyText } = await aiResp.json();
//     // const replyText = "HELLO HOW ARE YOU";
//     // 2. Call ElevenLabs Text-to-Speech API
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

// // app.post("/api/consult", async (req, res) => {
// //   const { prompt, language = "en-US", voiceName } = req.body;

// //   // 1. Call your doctor-style AI API (Google Gemini, custom endpoint, etc.)
// //   const aiResp = await fetch("https://your-gemini-endpoint.com/chat", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ prompt }),
// //   });
// //   const { replyText } = await aiResp.json();

// //   // 2. Call Google TTS
// //   const [ttsResponse] = await ttsClient.synthesizeSpeech({
// //     input: { text: replyText },
// //     voice: {
// //       languageCode: language,
// //       name: voiceName || `${language}-Wavenet-D`,
// //     },
// //     audioConfig: { audioEncoding: "MP3" },
// //   });

// //   // 3. Send back audio
// //   res.set("Content-Type", "audio/mpeg");
// //   res.send(ttsResponse.audioContent);
// // });

// module.exports = router;
// backend/routes/consult.js
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// Your own AI function calling Gemini + ElevenLabs
router.post("/consult", async (req, res) => {
  console.log("its a hit in backend consult");

  const { prompt, voiceId = "JBFqnCBsd6RMkjVDRZzb" } = req.body;

  try {
    // 1. Call Gemini AI (Google)
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${prompt} You are a physician providing concise, evidence-based advice.Generate a short conscise max 20-30 words reply.Try to be as minimalistic as possible.You are now a physician your reply should be like a physician so if a prompt asks you to answer something not related to medical field. Kindly answer "Sorry that is not in my domain"`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const geminiData = await geminiResponse.json();

    const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) throw new Error("No reply from Gemini.");

    console.log("AI reply:", replyText);

    // 2. Call ElevenLabs Text-to-Speech
    const elevenResp = await fetch(
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
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!elevenResp.ok) {
      const errorText = await elevenResp.text();
      throw new Error(`ElevenLabs API error: ${errorText}`);
    }

    const audioBuffer = await elevenResp.arrayBuffer();

    // 3. Send back audio as MP3
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("Error in /consult:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
