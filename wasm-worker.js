import * as Comlink from "comlink";

async function dicomHandler() {
  const dicom = await import("./pkg/dicom_rs_wasm.js");
  await dicom.default();
  await dicom.initThreadPool(navigator.hardwareConcurrency);
  console.log("Successfully initialized Web Worker");
  const loadDicom = (data) => {
    const decoded = dicom.loadDicom(data);
    const pixelArray = new Uint8Array(
      dicom.wasmMemory().buffer,
      decoded.pixelArray,
      decoded.size
    );
    const cols = decoded.cols;
    const rows = decoded.rows;
    const frames = decoded.frames;
    return {
      pixelArray: Comlink.transfer(pixelArray, [pixelArray.buffer]),
      cols,
      rows,
      frames,
    };
  };
  return Comlink.proxy({
    loadDicom,
  });
}

Comlink.expose({
  dicomHandler: dicomHandler(),
});
