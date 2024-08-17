use anyhow::Result;
use flate2::write::GzEncoder;
use flate2::Compression;
use std::fs::{self, File};
use std::io::{Cursor, Read, Seek, Write};
use std::path::{Path, PathBuf};
use walkdir::WalkDir;
use zip::unstable::write::FileOptionsExt;
use zip::{write::FileOptions, CompressionMethod, ZipWriter};
use zip_extensions::zip_create_from_directory_with_options;
pub fn get_assets_path() -> Option<PathBuf> {
    let path = std::env::current_dir().unwrap();
    let assets_path: PathBuf;
    // if cfg!(debug_assertions) {
    assets_path = path.join("static/libs");
    // } else {
    //     assets_path = path.join("libs")
    // }
    Some(assets_path)
}
pub fn get_temp_path() -> Option<PathBuf> {
    return get_assets_path();
}

pub fn get_magick_path() -> Option<PathBuf> {
    let assets_path = get_assets_path()?;

    const MAGICK_PATH: &str = "magick.exe";
    let magick_path = Path::new(&assets_path).join(MAGICK_PATH);
    if !magick_path.exists() {
        return None;
    }
    println!("magick_path: {}", magick_path.to_str().unwrap());
    Some(magick_path)
}

pub fn get_filename(path: &str) -> Option<String> {
    let path = Path::new(path);
    let filename = path.file_name().unwrap().to_str().unwrap().to_string();
    Some(filename)
}

pub fn remove_extension_from_string(file_name: &str) -> String {
    // 将字符串转换为 Path
    let path = Path::new(file_name);

    // 获取不包括扩展名的文件名
    let file_stem = path.file_stem().unwrap_or_default();

    // 将 Path 转换回字符串
    file_stem.to_string_lossy().into()
}

/// 使用zip格式压缩文件夹，并返回原文件夹的大小
pub fn zip_directory(source_dir: &Path, archive_file: &Path) -> Result<u64> {
    let mut total_size: u64 = 0;
    // 计算文件夹的大小
    for metadata in WalkDir::new(source_dir)
        .min_depth(1)
        .max_depth(1)
        .into_iter()
        // 忽略正在运行的进程或无权访问的目录
        .filter_map(|entry| entry.ok())
        .filter_map(|entry| entry.metadata().ok())
        // 只计算文件
        .filter(|metadata| metadata.is_file())
    {
        total_size += metadata.len();
        // todo 可以在此对文件夹大小上限进行判断，如果超出上限，则
        // return Ok(total_size);
    }

    // 压缩加密文件夹

    zip_extensions::zip_create_from_directory(
        &archive_file.to_path_buf(),
        &source_dir.to_path_buf(),
    )
    .unwrap();

    Ok(total_size)
}
