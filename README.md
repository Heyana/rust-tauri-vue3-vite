# Svelte SPA .NET

Easily create .NET applications powered by Svelte and webview2.

## Technologies used

-   `svelte` for rapid UI development.
-   `vite` for modern DX and bundling.
-   `.NET` for bridge between web UI and your machine.
-   `webview2` for light weight browser interface.
-   `tailwindcss` for simple and efficient styling.
-   `svelte-pathfinder` for in-memory routing.
-   `vite-plugin-singlefile` for building a single output HTML file that can be easily embedded into the .NET app.
-   `prettier` for consistent code formatting.

## Why I built this

I don't have time to learn rust to use tauri.

---

## Installation

Click on `use this template` above to clone the repo to your github, then

```
bun install
bun dev
```

---

## Scripts

### Start a development server

this will run vite dev server and .NET app in debug mode

`bun dev`

### Build the application and create the .NET app

this will build vite app into single html file then copy it to `csharp/wwwroot` then publish the .NET app in `csharp/publish/win-x64`

`bun run build`