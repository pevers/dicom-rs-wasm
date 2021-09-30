import * as Comlink from 'comlink';
 
const canvas = document.getElementById('dicom');
const { width, height } = canvas;
const ctx = canvas.getContext('2d');
 
(async function init() {
  // Create a separate thread from wasm-worker.js and get a proxy to its handlers.
  let dicomHandler = await Comlink.wrap(
    new Worker(new URL('./wasm-worker.js', import.meta.url), {
      type: 'module'
    })
  ).dicomHandler;

  const handleFileSelect = (evt) => {
    const dicom = evt.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', async (e) => {
      const data = e.target.result;
      const result = await dicomHandler.loadDicom(new Uint8Array(data), 1);
      console.log('Loaded dicom data', result);
      // TODO: Draw on the canvas
    });
    reader.readAsArrayBuffer(dicom);
  };
  document.querySelector('#upload').addEventListener('change', handleFileSelect, false); 
})();
