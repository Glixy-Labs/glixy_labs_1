// Glixyswarm — Tauri 2 desktop runtime library.
// Original implementation by Glixy Labs (MIT).

mod store;
mod agents;
mod runner;

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager, State};
use tokio::sync::Mutex;

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Agent {
    pub id: String,
    pub name: String,
    pub instructions: String,
    pub model: String,
    pub provider: String,
    #[serde(default)]
    pub tools: Vec<String>,
}

#[derive(Clone, Serialize, Deserialize, Debug, Default)]
pub struct Settings {
    #[serde(default)]
    pub openai_key:    String,
    #[serde(default)]
    pub anthropic_key: String,
    #[serde(default)]
    pub ollama_url:    String,
}

pub struct AppState {
    pub db: Mutex<store::Store>,
}

#[tauri::command]
async fn list_agents(state: State<'_, AppState>) -> Result<Vec<Agent>, String> {
    state.db.lock().await.list_agents().map_err(err)
}

#[tauri::command]
async fn save_agent(state: State<'_, AppState>, agent: Agent) -> Result<Vec<Agent>, String> {
    let mut db = state.db.lock().await;
    db.save_agent(&agent).map_err(err)?;
    db.list_agents().map_err(err)
}

#[tauri::command]
async fn delete_agent(state: State<'_, AppState>, id: String) -> Result<Vec<Agent>, String> {
    let mut db = state.db.lock().await;
    db.delete_agent(&id).map_err(err)?;
    db.list_agents().map_err(err)
}

#[tauri::command]
async fn get_settings(state: State<'_, AppState>) -> Result<Settings, String> {
    state.db.lock().await.get_settings().map_err(err)
}

#[tauri::command]
async fn save_settings(state: State<'_, AppState>, settings: Settings) -> Result<Settings, String> {
    let mut db = state.db.lock().await;
    db.save_settings(&settings).map_err(err)?;
    Ok(settings)
}

#[tauri::command]
async fn start_run(
    app: AppHandle,
    state: State<'_, AppState>,
    goal: String,
    flow: String,
    agent_ids: Vec<String>,
) -> Result<RunHandle, String> {
    let (agents, settings) = {
        let db = state.db.lock().await;
        (db.list_agents().map_err(err)?, db.get_settings().map_err(err)?)
    };
    let selected: Vec<Agent> = agents.into_iter().filter(|a| agent_ids.contains(&a.id)).collect();
    if selected.is_empty() { return Err("no agents selected".into()); }

    let run_id = uuid::Uuid::new_v4().to_string();
    let handle = RunHandle { id: run_id.clone() };

    let app_clone = app.clone();
    let id = run_id.clone();
    tokio::spawn(async move {
        let result = runner::run_swarm(&app_clone, &id, &goal, &flow, &selected, &settings).await;
        let _ = app_clone.emit("run-finished", serde_json::json!({
            "runId": id,
            "ok": result.is_ok(),
            "error": result.err().map(|e| e.to_string()),
        }));
    });

    Ok(handle)
}

#[derive(Serialize)]
pub struct RunHandle { pub id: String }

pub(crate) fn err<E: std::fmt::Display>(e: E) -> String { e.to_string() }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let path = app.path()
                .app_data_dir()
                .expect("no app data dir")
                .join("glixyswarm.db");
            std::fs::create_dir_all(path.parent().unwrap()).ok();
            let store = store::Store::open(&path).expect("open db");
            app.manage(AppState { db: Mutex::new(store) });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_agents, save_agent, delete_agent,
            get_settings, save_settings,
            start_run,
        ])
        .run(tauri::generate_context!())
        .expect("Glixyswarm failed to start");
}
