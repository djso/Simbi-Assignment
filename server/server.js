const express = require("express");
const cors = require("cors");
const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const app = express();
const speech = require("@google-cloud/speech");

app.use(cors());

const PORT = 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// Creates a client
const client = new speech.SpeechClient();
client.initialize();

const encoding = "LINEAR16";
const sampleRateHertz = 48000;
const languageCode = "en-US";

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: true,
};

const recognizeStream = client
  .streamingRecognize(request)
  .on("error", console.error)
  .on("data", (data) => {
    console.log(data);
    console.log(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : "\n\nReached transcription time limit, press Ctrl+C\n"
    );
  });

io.on("connection", (socket) => {
  socket.on("audioInput", (data) => {
    if (data != undefined) {
      data = data.stream;
      recognizeStream.write(data);
    }
  });

  socket.on("endAudio", () => {
    console.log("ending stream");
    server.close();
    recognizeStream.end();
  });
});

// recorder
//   .record({
//     sampleRateHertz: sampleRateHertz,
//     threshold: 0,
//     // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
//     verbose: false,
//     recordProgram: "rec", // Try also "arecord" or "sox"
//     silence: "10.0",
//   })
//   .stream()
//   .on("error", console.error)
//   .pipe(recognizeStream);

// console.log("Listening, press Ctrl+C to stop.");

// app.listen(8080, () => {
//   console.log("server is starting");
// });

// app.post("/api/transcribe", (req, res) => {
//   transcribe(req.body);

//   res.json({ test: 1 });
// });

// const config = {
//   encoding: "LINEAR16",
//   sampleRateHertz: 16000,
//   languageCode: "en-US",
// };

// client.streamingRecognize({ streaming_config: config });

// async function transcribe(input) {
//   const request = {
//     audio_content: input,
//   };

//   // Detects speech in the audio file
//   const [response] = await client.streamingRecognize(request);
//   const transcription = response.results
//     .map((result) => result.alternatives[0].transcript)
//     .join("\n");
//   console.log(`Transcription: ${transcription}`);
// }
