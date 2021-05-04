import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

import Book from "../components/Book";
import { BOOKS } from "../constants";

const Read = () => {
  const { id } = useParams<{ id: string }>();
  const [recording, setRecording] = useState<Boolean>(false);
  const history = useHistory();
  const selectedBook = BOOKS.find((book) => book.id === id);

  const [response, setResponse] = useState("");
  const socket = socketIOClient("http://localhost:5000");

  useEffect(() => {
    socket.on("transciption", (data) => {
      setResponse(data);
    });
    socket.emit("audioInput");
  }, []);

  if (selectedBook === undefined) {
    history.push("/");
  }

  const startRecordingAudio = () => {
    console.log("STARTING");
    setRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
  };

  const stopRecordingAudio = () => {
    setRecording(false);
    socket.emit("endAudio");
    //   fetch("http://localhost:8080/api/transcribe", {
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ data: input }),
    //     method: "POST",
    //   })
    //     .then((response) => response.json())
    //     .then((data) => console.log(data));
  };

  const handleSuccess = function (stream: MediaStream) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function (e) {
      const convertedInput: Int16Array = new Int16Array(
        e.inputBuffer.getChannelData(0).buffer
      );
      // if (recording) {
      socket.emit("audioInput", { stream: convertedInput });
      // }
    };
  };

  return (
    <>
      <Book id={id} />
      <button onClick={startRecordingAudio}>START</button>
      <button onClick={stopRecordingAudio}>STOP</button>
    </>
  );
};

export default Read;
