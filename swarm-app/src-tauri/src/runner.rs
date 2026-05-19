// Swarm orchestrator — runs a list of agents using one of four flow patterns
// (sequential, parallel, hierarchical, loop). Emits run-step events to the
// frontend via Tauri's event bus.
// Original implementation by Glixy Labs (MIT).

use anyhow::Result;
use futures::stream::{FuturesUnordered, StreamExt};
use serde_json::json;
use tauri::{AppHandle, Emitter};

use crate::agents::{complete, ChatMessage, ProviderRequest};
use crate::{Agent, Settings};

pub async fn run_swarm(
    app: &AppHandle,
    run_id: &str,
    goal: &str,
    flow: &str,
    agents: &[Agent],
    settings: &Settings,
) -> Result<()> {
    // Emit the user's goal as step #1 for context.
    emit_step(app, run_id, "user", "user", goal);

    match flow {
        "sequential"   => run_sequential(app, run_id, goal, agents, settings).await,
        "parallel"     => run_parallel(app, run_id, goal, agents, settings).await,
        "hierarchical" => run_hierarchical(app, run_id, goal, agents, settings).await,
        "loop"         => run_loop(app, run_id, goal, agents, settings).await,
        other          => Err(anyhow::anyhow!("unknown flow: {}", other)),
    }
}

async fn run_sequential(
    app: &AppHandle,
    run_id: &str,
    goal: &str,
    agents: &[Agent],
    settings: &Settings,
) -> Result<()> {
    let mut history = vec![ChatMessage { role: "user".into(), content: goal.into() }];
    for agent in agents {
        let reply = complete(ProviderRequest { agent, messages: &history, settings }).await?;
        emit_step(app, run_id, &agent.name, "assistant", &reply);
        history.push(ChatMessage { role: "assistant".into(), content: reply });
    }
    Ok(())
}

async fn run_parallel(
    app: &AppHandle,
    run_id: &str,
    goal: &str,
    agents: &[Agent],
    settings: &Settings,
) -> Result<()> {
    let messages = vec![ChatMessage { role: "user".into(), content: goal.into() }];
    let mut futs: FuturesUnordered<_> = agents.iter().map(|agent| {
        let messages = messages.clone();
        async move {
            let reply = complete(ProviderRequest { agent, messages: &messages, settings }).await;
            (agent.name.clone(), reply)
        }
    }).collect();
    while let Some((name, result)) = futs.next().await {
        match result {
            Ok(text)  => emit_step(app, run_id, &name, "assistant", &text),
            Err(e)    => emit_step(app, run_id, &name, "error", &e.to_string()),
        }
    }
    Ok(())
}

async fn run_hierarchical(
    app: &AppHandle,
    run_id: &str,
    goal: &str,
    agents: &[Agent],
    settings: &Settings,
) -> Result<()> {
    // First agent is supervisor; rest are specialists.
    if agents.is_empty() { return Ok(()); }
    let supervisor = &agents[0];
    let specialists = &agents[1..];

    let plan_msg = vec![ChatMessage {
        role: "user".into(),
        content: format!("Goal: {}\nWrite a short delegation plan: which specialist gets what.", goal),
    }];
    let plan = complete(ProviderRequest { agent: supervisor, messages: &plan_msg, settings }).await?;
    emit_step(app, run_id, &supervisor.name, "assistant", &plan);

    for s in specialists {
        let msg = vec![ChatMessage {
            role: "user".into(),
            content: format!("Delegated by {}:\n{}\n\nOriginal goal: {}", supervisor.name, plan, goal),
        }];
        match complete(ProviderRequest { agent: s, messages: &msg, settings }).await {
            Ok(reply) => emit_step(app, run_id, &s.name, "assistant", &reply),
            Err(e)    => emit_step(app, run_id, &s.name, "error", &e.to_string()),
        }
    }
    Ok(())
}

async fn run_loop(
    app: &AppHandle,
    run_id: &str,
    goal: &str,
    agents: &[Agent],
    settings: &Settings,
) -> Result<()> {
    // First agent is generator; second is judge. Iterates up to 3 rounds.
    if agents.len() < 2 {
        return run_sequential(app, run_id, goal, agents, settings).await;
    }
    let generator = &agents[0];
    let judge     = &agents[1];

    let mut history = vec![ChatMessage { role: "user".into(), content: goal.into() }];
    for round in 1..=3 {
        let draft = complete(ProviderRequest { agent: generator, messages: &history, settings }).await?;
        emit_step(app, run_id, &generator.name, "assistant", &format!("[round {}] {}", round, draft));
        history.push(ChatMessage { role: "assistant".into(), content: draft.clone() });

        let critique_input = vec![ChatMessage {
            role: "user".into(),
            content: format!(
                "Goal: {}\nDraft:\n{}\n\nIs this draft good enough? Reply with PASS or FAIL and one-line reason.",
                goal, draft
            ),
        }];
        let verdict = complete(ProviderRequest { agent: judge, messages: &critique_input, settings }).await?;
        emit_step(app, run_id, &judge.name, "assistant", &format!("[round {}] {}", round, verdict));

        if verdict.to_uppercase().contains("PASS") { break; }
        history.push(ChatMessage {
            role: "user".into(),
            content: format!("Try again. Judge feedback: {}", verdict),
        });
    }
    Ok(())
}

fn emit_step(app: &AppHandle, run_id: &str, agent: &str, role: &str, text: &str) {
    let _ = app.emit("run-step", json!({
        "runId": run_id,
        "step": { "agent": agent, "role": role, "text": text }
    }));
}
