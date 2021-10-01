import * as Comlink from "comlink";

let dicomData = null;
let width = null;
let height = null;
const rangeSelector = document.getElementById("frameRange");
const canvas = document.getElementById("dicom");
const ctx = canvas.getContext("2d");

(async function init() {
  // Create a separate thread from wasm-worker.js and get a proxy to its handlers.
  let dicomHandler = await Comlink.wrap(
    new Worker(new URL("./wasm-worker.js", import.meta.url), {
      type: "module",
    })
  ).dicomHandler;

  // Set presets
  document.querySelectorAll(".presets a").forEach((link) => {
    link.addEventListener("click", async () => {
      const response = await fetch(`data/${link.id}`);
      const buffer = await (await response.blob()).arrayBuffer();
      loadDicom(dicomHandler, new Uint8Array(buffer));
    });
  });

  const handleFileSelect = (evt) => {
    const dicom = evt.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", async (e) => {
      const data = e.target.result;
      loadDicom(dicomHandler, new Uint8Array(data));
    });
    reader.readAsArrayBuffer(dicom);
  };
  document
    .querySelector("#upload")
    .addEventListener("change", handleFileSelect, false);
})();

const loadDicom = async (handler, data) => {
  dicomData = await handler.loadDicom(data);
  rangeSelector.setAttribute("min", 0);
  rangeSelector.setAttribute("max", dicomData.frames - 1);
  rangeSelector.value = 0;
  rangeSelector.addEventListener("input", selectFrame);
  rangeSelector.style = "";
  width = dicomData.cols;
  height = dicomData.rows;
  canvas.width = width;
  canvas.height = height;
  selectFrame();
};

const selectFrame = () => {
  const frame = rangeSelector.value;
  const pixelData = ctx.createImageData(width, height);
  const frameSize = width * height * 4;
  pixelData.data.set(
    dicomData.pixelArray.slice(
      frame * frameSize,
      frame * frameSize + frameSize
    ),
    0,
    0
  );
  ctx.putImageData(pixelData, 0, 0);
};
