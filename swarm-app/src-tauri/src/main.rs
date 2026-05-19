// Prevents a console window from popping up alongside the app on Windows.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    glixyswarm_lib::run();
}
