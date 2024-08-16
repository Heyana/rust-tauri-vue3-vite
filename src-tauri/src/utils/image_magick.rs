use crate::utils;
use anyhow::{Context, Result};
use std::{
    any,
    io::{Cursor, Read, Write},
};
use tempfile;
fn handle_result<T>(result: Result<T, impl std::fmt::Debug>) -> Option<T> {
    match result {
        Ok(value) => Some(value),
        Err(_) => None,
    }
}

pub fn image_magick_convert(options: &crate::MyData) -> Option<String> {
    let lib_path: std::path::PathBuf = utils::app::get_assets_path()?;

    let buffers: Vec<Option<Vec<u8>>> = options
        .files
        .iter()
        .map(|file| {
            let mut cmd = std::process::Command::new(lib_path.clone());

            let mut out_path: tempfile::NamedTempFile = tempfile::NamedTempFile::new().ok()?;
            println!("out_path: {}", out_path.path().display());
            let out_path_path = out_path.path().to_str()?;
            println!("out_path_path: {}", out_path_path);
            cmd.args([
                file,
                "-quality",
                options.quality.to_string().as_str(),
                out_path_path,
            ]);
            let output = cmd
                .spawn()
                .map_err(|e| println!("Failed to execute command: {}", e))
                .ok()?;

            let mut buffer: Vec<u8> = Vec::new();
            println!("output1: {:?}", output);
            let _ = out_path.write_all(&mut buffer).ok()?;

            println!("output: {:?}", output);
            out_path.close().ok()?;
            None
        })
        .collect();
    println!("buffers: {:?}", buffers);
    Some("success".to_string())
    // Ok("success".to_string())
}
