//Todo esto es medio automático del pitchy para que funcione.
import { PitchDetector } from "https://esm.sh/pitchy@4";

function updatePitch(analyserNode, detector, input, sampleRate) {
    analyserNode.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, sampleRate);

    document.getElementById("pitch").textContent = `${
        Math.round(pitch * 10) / 10
    } Hz`;
    window.setTimeout(
        () => updatePitch(analyserNode, detector, input, sampleRate),
        100
    );
}


document.addEventListener("DOMContentLoaded", () => {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();

    document
        .getElementById("resume-button")
        .addEventListener("click", () => audioContext.resume());

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        audioContext.createMediaStreamSource(stream).connect(analyserNode);
        const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
        const input = new Float32Array(detector.inputLength);
        updatePitch(analyserNode, detector, input, audioContext.sampleRate);
    });
});


//Acá intenté agregar la opción que me agrega qué nota es pero me enrosqué
let notaEl = document.getElementById("note-el");
let nota = document.getElementById("nota");

nota.textContent = definirNota();

function definirNota(){
    if ((Math.round(pitch * 10) / 10) > 254 && (Math.round(pitch * 10) / 10) < 269){
        nota = "C4"
        return nota
    } else if ((Math.round(pitch * 10) / 10) > 269 && (Math.round(pitch * 10) / 10) < 285){
        nota = "C#4"
        return nota
    } else {
        nota = "otra"
        return nota
    }
}