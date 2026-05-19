// SQLite-backed local storage for agents + settings.
// Original implementation by Glixy Labs (MIT).

use anyhow::Result;
use rusqlite::{params, Connection};
use std::path::Path;

use crate::{Agent, Settings};

pub struct Store {
    conn: Connection,
}

impl Store {
    pub fn open(path: &Path) -> Result<Self> {
        let conn = Connection::open(path)?;
        conn.execute_batch(SCHEMA)?;
        // Seed default agents on first boot
        let count: i64 = conn.query_row("SELECT COUNT(*) FROM agents", [], |r| r.get(0))?;
        let mut store = Self { conn };
        if count == 0 { store.seed_defaults()?; }
        Ok(store)
    }

    pub fn list_agents(&self) -> Result<Vec<Agent>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, name, instructions, model, provider, tools FROM agents ORDER BY name"
        )?;
        let rows = stmt.query_map([], |r| {
            let tools_json: String = r.get(5)?;
            let tools: Vec<String> = serde_json::from_str(&tools_json).unwrap_or_default();
            Ok(Agent {
                id: r.get(0)?,
                name: r.get(1)?,
                instructions: r.get(2)?,
                model: r.get(3)?,
                provider: r.get(4)?,
                tools,
            })
        })?;
        Ok(rows.collect::<Result<Vec<_>, _>>()?)
    }

    pub fn save_agent(&mut self, a: &Agent) -> Result<()> {
        let tools = serde_json::to_string(&a.tools)?;
        self.conn.execute(
            "INSERT INTO agents (id, name, instructions, model, provider, tools)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)
             ON CONFLICT(id) DO UPDATE SET
               name=excluded.name,
               instructions=excluded.instructions,
               model=excluded.model,
               provider=excluded.provider,
               tools=excluded.tools",
            params![a.id, a.name, a.instructions, a.model, a.provider, tools],
        )?;
        Ok(())
    }

    pub fn delete_agent(&mut self, id: &str) -> Result<()> {
        self.conn.execute("DELETE FROM agents WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn get_settings(&self) -> Result<Settings> {
        let mut s = Settings::default();
        s.ollama_url = "http://localhost:11434".to_string();
        let mut stmt = self.conn.prepare("SELECT key, value FROM settings")?;
        let rows = stmt.query_map([], |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?)))?;
        for row in rows {
            let (k, v) = row?;
            match k.as_str() {
                "openai_key"    => s.openai_key    = v,
                "anthropic_key" => s.anthropic_key = v,
                "ollama_url"    => s.ollama_url    = v,
                _ => {}
            }
        }
        Ok(s)
    }

    pub fn save_settings(&mut self, s: &Settings) -> Result<()> {
        let tx = self.conn.transaction()?;
        for (k, v) in [
            ("openai_key",    s.openai_key.as_str()),
            ("anthropic_key", s.anthropic_key.as_str()),
            ("ollama_url",    s.ollama_url.as_str()),
        ] {
            tx.execute(
                "INSERT INTO settings (key, value) VALUES (?1, ?2)
                 ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                params![k, v],
            )?;
        }
        tx.commit()?;
        Ok(())
    }

    fn seed_defaults(&mut self) -> Result<()> {
        let defaults = [
            ("planner",    "Break the user's goal into a short, ordered plan. Number each step.", "gpt-4o-mini",       "openai",    vec![]),
            ("researcher", "Use web_search to gather facts. Cite every source.",                  "claude-sonnet-4-6", "anthropic", vec!["web_search".to_string()]),
            ("writer",     "Turn the research into a tight 200-word brief.",                     "gpt-4o",            "openai",    vec![]),
        ];
        for (name, ins, model, provider, tools) in defaults {
            self.save_agent(&Agent {
                id: uuid::Uuid::new_v4().to_string(),
                name: name.to_string(),
                instructions: ins.to_string(),
                model: model.to_string(),
                provider: provider.to_string(),
                tools,
            })?;
        }
        Ok(())
    }
}

const SCHEMA: &str = "
CREATE TABLE IF NOT EXISTS agents (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    instructions TEXT NOT NULL,
    model        TEXT NOT NULL,
    provider     TEXT NOT NULL,
    tools        TEXT NOT NULL DEFAULT '[]'
);
CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS runs (
    id        TEXT PRIMARY KEY,
    goal      TEXT NOT NULL,
    flow      TEXT NOT NULL,
    status    TEXT NOT NULL,
    started   INTEGER NOT NULL,
    finished  INTEGER
);
CREATE TABLE IF NOT EXISTS run_steps (
    id      TEXT PRIMARY KEY,
    run_id  TEXT NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
    idx     INTEGER NOT NULL,
    agent   TEXT NOT NULL,
    role    TEXT NOT NULL,
    text    TEXT NOT NULL,
    created INTEGER NOT NULL
);
";
