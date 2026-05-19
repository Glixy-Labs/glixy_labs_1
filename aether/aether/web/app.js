/* ============================================
   Glixy Aether — local dashboard (single page)
   Calls the FastAPI backend on the same host.
   ============================================ */

const API = "";  // same origin
let CURRENT_CONV = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* ---- system info ---- */
async function loadSystem() {
  try {
    const r = await fetch(API + "/api/system");
    const s = await r.json();
    $("#locVersion").textContent = "v" + s.version;
    $("#locProvider").textContent = `${s.provider} · ${s.model}`;
    $("#locStatus p:first-child").textContent = "Connected";
    $("#locStatus").classList.add("ok");
    $("#settingsBlock").textContent = JSON.stringify(s, null, 2);

    // Populate model dropdown best-effort
    const sel = $("#modelSelect");
    sel.innerHTML = '<option value="">(default)</option>';
    [s.model, "llama3", "qwen2", "mistral", "gpt-4o", "claude-sonnet-4-6"].forEach(m => {
      if (!m) return;
      const o = document.createElement("option");
      o.value = m; o.textContent = m;
      if (m === s.model) o.selected = true;
      sel.appendChild(o);
    });
  } catch (e) {
    $("#locStatus p:first-child").textContent = "Offline";
    $("#locStatus").classList.add("err");
  }
}

/* ---- conversations ---- */
async function loadConversations() {
  try {
    const r = await fetch(API + "/api/conversations");
    const data = await r.json();
    const list = $("#convList");
    list.innerHTML = "";
    (data.items || []).slice(0, 20).forEach(c => {
      const a = document.createElement("a");
      a.href = "#"; a.className = "loc-conv";
      a.innerHTML = `<span>◈</span> ${escapeHtml(c.title || "Untitled")}`;
      a.addEventListener("click", e => { e.preventDefault(); openConversation(c.id); });
      list.appendChild(a);
    });
  } catch (e) {}
}

async function openConversation(id) {
  CURRENT_CONV = id;
  const r = await fetch(API + "/api/conversations/" + id);
  const data = await r.json();
  const chat = $("#locChat");
  chat.innerHTML = "";
  (data.messages || []).forEach(m => addBubble(m.role, m.content));
  switchTab("chat");
}

/* ---- chat ---- */
function addBubble(role, text) {
  const chat = $("#locChat");
  const div = document.createElement("div");
  div.className = "loc-msg " + (role === "user" ? "user" : "bot");
  const initial = role === "user" ? "Y" : "◈";
  div.innerHTML = `<span class="loc-ava ${role === "user" ? "u" : "b"}">${initial}</span>` +
                  `<div class="loc-bubble"><p>${escapeHtml(text)}</p></div>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div.querySelector(".loc-bubble p");
}

function appendTool(name, status, detail) {
  const chat = $("#locChat");
  let last = chat.querySelector(".loc-msg.bot:last-child .loc-bubble");
  if (!last) {
    addBubble("assistant", "");
    last = chat.querySelector(".loc-msg.bot:last-child .loc-bubble");
  }
  const row = document.createElement("div");
  row.className = "loc-tool-row";
  row.innerHTML = `<span class="loc-tool-icon">⚙</span>` +
                  `<span class="loc-tool-name">${escapeHtml(name)}</span>` +
                  `<span class="loc-tool-status ${status}">${status}</span>` +
                  (detail ? `<span class="loc-tool-detail">${escapeHtml(detail)}</span>` : "");
  last.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

async function sendChat(text) {
  addBubble("user", text);
  const target = addBubble("assistant", "");
  const useTools = $("#useTools").checked;
  const model = $("#modelSelect").value || null;

  const body = {
    conversation_id: CURRENT_CONV,
    message: text,
    model,
    use_tools: useTools,
  };

  const res = await fetch(API + "/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok || !res.body) {
    target.textContent = "Error talking to Aether (HTTP " + res.status + ")";
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const events = buf.split("\n\n");
    buf = events.pop();
    for (const block of events) {
      const line = block.split("\n").find(l => l.startsWith("data: "));
      if (!line) continue;
      try {
        const ev = JSON.parse(line.slice(6));
        if (ev.type === "start") {
          CURRENT_CONV = ev.conversation_id;
          loadConversations();
        } else if (ev.type === "text") {
          target.textContent += ev.delta;
        } else if (ev.type === "tool_call_start") {
          appendTool(ev.name, "run", JSON.stringify(ev.arguments).slice(0, 80));
        } else if (ev.type === "tool_call_result") {
          appendTool(ev.name, ev.result?.ok ? "ok" : "err",
                     JSON.stringify(ev.result).slice(0, 80));
        } else if (ev.type === "error") {
          target.textContent += ` [error: ${ev.error}]`;
        }
      } catch (e) {}
    }
  }
}

/* ---- crew ---- */
async function runCrew(task) {
  const trace = $("#crewTrace");
  trace.innerHTML = "";
  function add(html) {
    const div = document.createElement("div");
    div.className = "loc-crew-row";
    div.innerHTML = html;
    trace.appendChild(div);
  }

  const res = await fetch(API + "/api/agents/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  });
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let agentText = {};
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const blocks = buf.split("\n\n");
    buf = blocks.pop();
    for (const b of blocks) {
      const line = b.split("\n").find(l => l.startsWith("data: "));
      if (!line) continue;
      try {
        const ev = JSON.parse(line.slice(6));
        if (ev.type === "crew_start") {
          add(`<strong>▶ Crew started</strong> · ${ev.agents.join(" → ")}`);
        } else if (ev.type === "agent_start") {
          add(`<span class="badge">step ${ev.step}</span> <strong>${ev.agent}</strong> thinking…`);
          agentText[ev.agent] = "";
        } else if (ev.type === "agent_delta") {
          agentText[ev.agent] = (agentText[ev.agent] || "") + ev.delta;
          const last = trace.querySelector(`.loc-crew-row[data-agent="${ev.agent}"]`);
          if (last) {
            last.querySelector(".text").textContent = agentText[ev.agent];
          } else {
            const div = document.createElement("div");
            div.className = "loc-crew-row text-row";
            div.dataset.agent = ev.agent;
            div.innerHTML = `<strong>${ev.agent}</strong> · <span class="text">${escapeHtml(ev.delta)}</span>`;
            trace.appendChild(div);
          }
        } else if (ev.type === "tool_call_start") {
          add(`<span class="badge tool">tool</span> ${ev.agent} → ${ev.name}(${escapeHtml(JSON.stringify(ev.arguments).slice(0,80))})`);
        } else if (ev.type === "tool_call_result") {
          add(`<span class="badge ${ev.result?.ok ? "ok":"err"}">result</span> ${ev.agent} ← ${escapeHtml(JSON.stringify(ev.result).slice(0,120))}`);
        } else if (ev.type === "agent_done") {
          add(`<strong>✓ ${ev.agent}</strong> done`);
        } else if (ev.type === "crew_done") {
          add(`<strong>✓ Crew done</strong> · ${ev.duration_ms} ms · run ${ev.run_id}`);
          loadRuns();
        }
      } catch (e) {}
    }
  }
}

/* ---- memory ---- */
async function loadMemory() {
  const r = await fetch(API + "/api/memory");
  const data = await r.json();
  const list = $("#memList");
  list.innerHTML = "";
  (data.items || []).forEach(m => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="loc-mem-type">${escapeHtml(m.type)}</span>` +
                   `<span class="loc-mem-text">${escapeHtml(m.content)}</span>` +
                   `<button class="loc-mem-del" data-id="${m.id}">×</button>`;
    list.appendChild(li);
  });
  $$(".loc-mem-del").forEach(btn => btn.addEventListener("click", async () => {
    await fetch(API + "/api/memory/" + btn.dataset.id, { method: "DELETE" });
    loadMemory();
  }));
}

/* ---- tools ---- */
async function loadTools() {
  const r = await fetch(API + "/api/tools");
  const data = await r.json();
  const list = $("#toolsList");
  list.innerHTML = "";
  (data.items || []).forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="loc-tool-bullet"></span>` +
                   `<div><strong>${escapeHtml(t.name)}</strong>` +
                   `<p>${escapeHtml(t.description)}</p></div>`;
    list.appendChild(li);
  });
}

/* ---- runs ---- */
async function loadRuns() {
  const r = await fetch(API + "/api/runs");
  const data = await r.json();
  const tbody = $("#runsBody");
  tbody.innerHTML = "";
  (data.items || []).forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td><span class="loc-mono">${escapeHtml(r.id)}</span></td>` +
      `<td>${escapeHtml((r.task||"").slice(0,60))}</td>` +
      `<td>${(r.agents||[]).join(", ")}</td>` +
      `<td>${r.steps}</td><td>${r.tokens}</td>` +
      `<td><span class="loc-st ${r.status}">${r.status}</span></td>` +
      `<td>${r.duration_ms} ms</td>`;
    tbody.appendChild(tr);
  });
}

/* ---- tabs ---- */
function switchTab(name) {
  $$(".loc-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
  $$(".loc-pane").forEach(p => p.classList.toggle("active", p.dataset.pane === name));
  if (name === "memory") loadMemory();
  if (name === "tools") loadTools();
  if (name === "runs") loadRuns();
  if (name === "settings") loadSystem();
}

/* ---- wire up ---- */
document.addEventListener("DOMContentLoaded", () => {
  loadSystem();
  loadConversations();

  $$(".loc-tab").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));

  $("#locInput").addEventListener("submit", e => {
    e.preventDefault();
    const v = $("#locPrompt").value.trim();
    if (!v) return;
    $("#locPrompt").value = "";
    sendChat(v);
  });

  $$(".loc-q").forEach(b => b.addEventListener("click", () => {
    sendChat(b.dataset.prompt);
  }));

  $("#newChatBtn").addEventListener("click", () => {
    CURRENT_CONV = null;
    $("#locChat").innerHTML = "";
    switchTab("chat");
  });

  $("#crewForm").addEventListener("submit", e => {
    e.preventDefault();
    const task = $("#crewTask").value.trim();
    if (!task) return;
    runCrew(task);
  });

  $("#memForm").addEventListener("submit", async e => {
    e.preventDefault();
    const type = $("#memType").value;
    const content = $("#memContent").value.trim();
    if (!content) return;
    await fetch(API + "/api/memory", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, content }),
    });
    $("#memContent").value = "";
    loadMemory();
  });

  $("#docsBtn").addEventListener("click", () => {
    window.open("https://glixylabs.com/docs.html", "_blank");
  });
});
