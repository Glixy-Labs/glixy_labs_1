// Model provider HTTP clients (OpenAI-compatible Chat Completions, Anthropic
// Messages, and Ollama). Speaks publicly documented HTTP protocols only.
// Original implementation by Glixy Labs (MIT).

use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};

use crate::{Agent, Settings};

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

pub struct ProviderRequest<'a> {
    pub agent:    &'a Agent,
    pub messages: &'a [ChatMessage],
    pub settings: &'a Settings,
}

pub async fn complete(req: ProviderRequest<'_>) -> Result<String> {
    match req.agent.provider.as_str() {
        "openai"    => openai_chat(req).await,
        "anthropic" => anthropic_chat(req).await,
        "ollama"    => ollama_chat(req).await,
        other       => Err(anyhow!("unknown provider: {}", other)),
    }
}

async fn openai_chat(req: ProviderRequest<'_>) -> Result<String> {
    if req.settings.openai_key.is_empty() {
        return Err(anyhow!("OpenAI API key not set in Settings"));
    }
    let client = reqwest::Client::new();
    let body = serde_json::json!({
        "model": req.agent.model,
        "messages": build_messages(req.agent, req.messages),
        "temperature": 0.7,
    });
    let resp = client
        .post("https://api.openai.com/v1/chat/completions")
        .bearer_auth(&req.settings.openai_key)
        .json(&body)
        .send()
        .await?;
    let json: serde_json::Value = resp.json().await?;
    json.pointer("/choices/0/message/content")
        .and_then(|v| v.as_str())
        .map(|s| s.to_string())
        .ok_or_else(|| anyhow!("OpenAI response missing content: {:?}", json))
}

async fn anthropic_chat(req: ProviderRequest<'_>) -> Result<String> {
    if req.settings.anthropic_key.is_empty() {
        return Err(anyhow!("Anthropic API key not set in Settings"));
    }
    let client = reqwest::Client::new();
    let body = serde_json::json!({
        "model": req.agent.model,
        "max_tokens": 1024,
        "system": req.agent.instructions,
        "messages": req.messages.iter().map(|m| serde_json::json!({
            "role": if m.role == "assistant" { "assistant" } else { "user" },
            "content": m.content,
        })).collect::<Vec<_>>(),
    });
    let resp = client
        .post("https://api.anthropic.com/v1/messages")
        .header("x-api-key", &req.settings.anthropic_key)
        .header("anthropic-version", "2023-06-01")
        .json(&body)
        .send()
        .await?;
    let json: serde_json::Value = resp.json().await?;
    json.pointer("/content/0/text")
        .and_then(|v| v.as_str())
        .map(|s| s.to_string())
        .ok_or_else(|| anyhow!("Anthropic response missing text: {:?}", json))
}

async fn ollama_chat(req: ProviderRequest<'_>) -> Result<String> {
    let base = if req.settings.ollama_url.is_empty() {
        "http://localhost:11434".to_string()
    } else {
        req.settings.ollama_url.clone()
    };
    let client = reqwest::Client::new();
    let body = serde_json::json!({
        "model": req.agent.model,
        "messages": build_messages(req.agent, req.messages),
        "stream": false,
    });
    let resp = client
        .post(format!("{}/api/chat", base.trim_end_matches('/')))
        .json(&body)
        .send()
        .await?;
    let json: serde_json::Value = resp.json().await?;
    json.pointer("/message/content")
        .and_then(|v| v.as_str())
        .map(|s| s.to_string())
        .ok_or_else(|| anyhow!("Ollama response missing content: {:?}", json))
}

fn build_messages(agent: &Agent, history: &[ChatMessage]) -> Vec<serde_json::Value> {
    let mut out: Vec<serde_json::Value> = vec![
        serde_json::json!({ "role": "system", "content": agent.instructions }),
    ];
    for m in history {
        out.push(serde_json::json!({ "role": m.role, "content": m.content }));
    }
    out
}
