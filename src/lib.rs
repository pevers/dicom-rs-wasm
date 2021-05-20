use dicom_object::from_reader;
use wasm_bindgen::prelude::*;
use dicom_pixeldata::PixelDecoder;
use std::panic;

pub use wasm_bindgen_rayon::init_thread_pool;

#[wasm_bindgen]
pub fn load_dicom(dicom: &[u8]) -> Vec<u8> {
    // Add parameter for canvas
    // Load the dicom and draw it on the Canvas

    panic::set_hook(Box::new(console_error_panic_hook::hook));
    
    let obj = from_reader(dicom).unwrap();
    let image = obj.decode_pixel_data().unwrap();
    let image = image.to_dynamic_image().unwrap();
    image.to_rgba8().to_vec()
}

#[cfg(test)]
mod tests {
    use std::{fs::File, io::{BufReader, Read}};

    use dicom_object::{from_reader, open_file};

    #[test]
    fn load_dicom_memory() {
        let mut bytes = BufReader::new(File::open("public/SC_ybr_full_uncompressed.dcm").unwrap());
        let mut preamble = [0; 128];
        bytes.read(&mut preamble[..]).unwrap();
        from_reader(bytes).unwrap();
    }

    #[test]
    fn load_file() {
        open_file("public/SC_ybr_full_uncompressed.dcm").unwrap();
    }
}