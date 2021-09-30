import * as Comlink from 'comlink';

async function dicomHandler() {
  const dicom = await import('./pkg/dicom_rs_wasm.js');
  await dicom.default();
  await dicom.initThreadPool(navigator.hardwareConcurrency);
  console.log('Successfully initialized Web Worker');
  const loadDicom = (data, frame) => {
    const decoded = dicom.load_dicom(data, frame);
    return {
      decoded: Comlink.transfer(decoded, [decoded.buffer])
    }
  }
  return Comlink.proxy({
    loadDicom
  })
}

Comlink.expose({
  dicomHandler: dicomHandler()
});