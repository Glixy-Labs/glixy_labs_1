# Icons

Tauri expects platform-specific app icons in this folder. Drop these files in
before building installers:

- `32x32.png`        — small Linux/Windows icon
- `128x128.png`      — medium icon
- `128x128@2x.png`   — retina icon
- `icon.icns`        — macOS bundle icon
- `icon.ico`         — Windows installer icon

Generate them from a single 1024×1024 PNG with the Tauri CLI:

```bash
npx @tauri-apps/cli icon path/to/glixyswarm-1024.png
```

This writes all five files into this directory automatically.
