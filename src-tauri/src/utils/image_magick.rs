use crate::utils;
use anyhow::Result;

use std::{
    fs::File,
    io::{Cursor, Read, Write},
    os::windows::process::CommandExt,
    path::Path,
    sync::Arc,
    thread, vec,
};
use tempfile;

pub fn image_magick_convert(options: &crate::MyData) -> Option<Vec<u8>> {
    let magick_path: std::path::PathBuf = utils::app::get_magick_path()?;
    let mut cmd = std::process::Command::new(magick_path.clone());
    let tempdir = tempfile::tempdir().map_err(|e| e.to_string()).ok()?;

    let buffers: Vec<String> = options
        .files
        .iter()
        .map(|file| {
            let filename = utils::app::get_filename(&file)?;

            let newname = format!(
                "{}.webp",
                utils::app::remove_extension_from_string(&filename.as_str())
            );

            let newpath = tempdir.path().join(newname);
            let newpathstr = newpath.to_str()?;

            println!("newpathstr: {}", newpathstr);
            cmd.args([
                file,
                "-quality",
                options.quality.to_string().as_str(),
                newpathstr,
            ]);
            let output = cmd
                .spawn()
                .ok()?
                .wait()
                .map_err(|e| println!("Failed to execute command: {}", e))
                .ok()?;

            println!("output1: {:?}", output);

            println!("output: {:?}", output);
            Some(newpathstr.to_owned())
        })
        .filter_map(|opt| opt)
        .collect();

    let zip_temp = tempfile::NamedTempFile::new()
        .map_err(|e| println!("Failed to create temp file: {}", e))
        .ok()?;
    let size = utils::app::zip_directory(&tempdir.path(), zip_temp.path())
        .map_err(|e| println!("Failed to zip directory: {}", e))
        .ok()?;
    println!("size: {}", size);
    println!("zipbuffer: {:?}", buffers);

    tempdir
        .close()
        .map_err(|e| println!("Failed to close file: {}", e))
        .ok()?;

    let mut data = std::fs::File::open(zip_temp.path())
        .map_err(|e| println!("Failed to open file: {}", e))
        .ok()?;
    let mut buffer = Vec::new();
    data.read_to_end(&mut buffer)
        .map_err(|e| println!("Failed to read file: {}", e))
        .ok()?;

    Some(buffer)
    // Ok("success".to_string())
}

const MAX_THREADS: usize = 20;
pub fn image_magick_convert_tokio(options: &crate::MyData) -> Option<Vec<u8>> {
    let magick_path = utils::app::get_magick_path()?;
    let tempdir = tempfile::tempdir().ok()?;
    let tempdir_path = Arc::new(tempdir.path().to_owned());
    let magick_path = Arc::new(magick_path);

    let files = options.files.clone();
    let mut handles = vec![];

    for chunk in files.chunks(MAX_THREADS) {
        let tempdir_path = Arc::clone(&tempdir_path);
        let magick_path = Arc::clone(&magick_path);
        let chunk_files = chunk.to_vec();
        let quality = options.quality.clone();

        let handle = thread::spawn(move || {
            process_files(chunk_files, &tempdir_path, &magick_path, quality as u32)
        });

        handles.push(handle);
    }

    let mut results = vec![];
    for handle in handles {
        if let Ok(result) = handle.join() {
            results.extend(result);
        }
    }

    let zip_temp = tempfile::NamedTempFile::new()
        .map_err(|e| println!("Failed to create temp file: {}", e))
        .ok()?;

    // Using your existing zip_directory function
    let size = utils::app::zip_directory(&tempdir.path(), zip_temp.path())
        .map_err(|e| println!("Failed to zip directory: {}", e))
        .ok()?;
    println!("Size of zip: {}", size);

    tempdir.close().ok()?;

    let mut data = File::open(zip_temp.path())
        .map_err(|e| println!("Failed to open file: {}", e))
        .ok()?;
    let mut buffer = Vec::new();
    data.read_to_end(&mut buffer)
        .map_err(|e| println!("Failed to read file: {}", e))
        .ok()?;

    Some(buffer)
}

fn process_files(
    files: Vec<String>,
    tempdir_path: &Path,
    magick_path: &Path,
    quality: u32,
) -> Vec<String> {
    let mut results = vec![];

    for file in files {
        if let Some(newpath) = convert_file(file, tempdir_path, magick_path, quality) {
            results.push(newpath);
        }
    }

    results
}

fn convert_file(
    file: String,
    tempdir_path: &Path,
    magick_path: &Path,
    quality: u32,
) -> Option<String> {
    let filename = utils::app::get_filename(&file).unwrap_or_default();
    let newname = format!(
        "{}.webp",
        utils::app::remove_extension_from_string(&filename)
    );
    let newpath = tempdir_path.join(newname);
    let newpathstr = newpath.to_str()?;

    let mut cmd = std::process::Command::new(magick_path);
    cmd.args([&file, "-quality", &quality.to_string(), newpathstr])
        .creation_flags(0x08000000);

    let output = cmd.spawn().ok()?.wait().ok()?;

    println!("Processed file: {} with output: {:?}", file, output);
    Some(newpathstr.to_owned())
}
