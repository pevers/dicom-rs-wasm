pub use wasm_bindgen_rayon::init_thread_pool;

use dicom_object::from_reader;
use dicom_pixeldata::PixelDecoder;
use rayon::prelude::*;
use std::panic;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct DicomResult {
    /// Pixel data in rgba8
    #[wasm_bindgen(js_name = "pixelArray")]
    pub pixel_array: *const u8,

    //// Size of the pixel data
    pub size: usize,

    /// Number of columns
    pub cols: u32,

    /// Number of rows
    pub rows: u32,

    /// Number of frames
    pub frames: u16,
}

#[wasm_bindgen(js_name = "loadDicom")]
pub fn load_dicom(dicom: &[u8]) -> DicomResult {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    let obj = from_reader(&dicom[128..]).unwrap();
    let image = obj.decode_pixel_data().unwrap();
    let pixels = (0..(image.number_of_frames as usize))
        .into_par_iter()
        .flat_map(|frame| {
            image
                .to_dynamic_image(frame as u16)
                .unwrap()
                .to_rgba8()
                .to_vec()
        })
        .collect::<Vec<u8>>();
    DicomResult {
        pixel_array: pixels.as_ptr(),
        size: pixels.len(),
        cols: image.rows,
        rows: image.rows,
        frames: image.number_of_frames,
    }
}

#[wasm_bindgen(js_name = "wasmMemory")]
pub fn wasm_memory() -> JsValue {
    wasm_bindgen::memory()
}
