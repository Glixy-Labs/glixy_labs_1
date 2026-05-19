"""Entry point for the PyInstaller bundle. Just calls aether.cli.main()."""

from aether.cli import main

if __name__ == "__main__":
    import sys
    if len(sys.argv) == 1:
        sys.argv.append("start")  # default action when double-clicked
    main()
