use std::path::{Path, PathBuf};

pub fn get_assets_path() -> Option<PathBuf> {
    let path = std::env::current_dir().unwrap();
    let assets_path: PathBuf;
    // if cfg!(debug_assertions) {
    assets_path = path.join("libs");
    // } else {
    //     assets_path = path.join("libs")
    // }
    Some(assets_path)
}

pub fn get_magick_path() -> Result<PathBuf, ()> {
    let assets_path = get_assets_path().ok_or_else(|| ())?;

    println!("assets_path: {}", assets_path.to_string_lossy());
    if !assets_path.exists() {
        return Err(());
    }
    const MAGICK_PATH: &str = "magick.exe";
    let magick_path = Path::new(&assets_path).join(MAGICK_PATH);
    if !magick_path.exists() {
        return Err(());
    }
    Ok(magick_path)
}
