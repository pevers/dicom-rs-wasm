pub use wasm_bindgen_rayon::init_thread_pool;

use dicom_object::from_reader;
use dicom_pixeldata::PixelDecoder;
use std::panic;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn load_dicom(dicom: &[u8], frame: u32) -> Vec<u8> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    let obj = from_reader(&dicom[128..]).unwrap();
    let image = obj.decode_pixel_data().unwrap();
    let image = image.to_dynamic_image(frame).unwrap();
    image.to_rgba8().to_vec()
}