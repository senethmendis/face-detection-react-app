import { useEffect } from "react";
import { useRef } from "react";
import * as faceapi from "face-api.js";

function App() {
  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    const detection = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    console.log(detection);

    canvasRef.current.innterHtml = faceapi.createCanvasFromMedia(
      imgRef.current
    );
    faceapi.matchDimensions(canvasRef.current, {
      width: 940,
      height: 650,
    });

    const resized = faceapi.resizeResults(detection, {
      width: 940,
      height: 650,
    });
    faceapi.draw.drawDetections(canvasRef.current, resized);
  };

  useEffect(() => {
    const loadModel = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    imgRef.current && loadModel();
  }, []);

  return (
    <div className="app">
      <img ref={imgRef} src="/testimg.jpg" alt="res" width={940} height={650} />
      <canvas ref={canvasRef} width={940} height={650}></canvas>
    </div>
  );
}

export default App;
