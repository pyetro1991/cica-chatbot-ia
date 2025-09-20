const input = document.getElementById("user-input");
const chatbox = document.getElementById("chatbox");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });

/*function appendUser(text) {
  const p = document.createElement("p");
  p.className = "msg user";
  p.innerHTML = `<strong>Tú:</strong> ${escapeHtml(text)}`;
  chatbox.appendChild(p);
  chatbox.scrollTop = chatbox.scrollHeight;
}*/function appendUser(text) {
  const div = document.createElement("div");
  div.className = "chat-bubble user-bubble";
  div.innerHTML = `<span><strong>Tú:</strong> ${escapeHtml(text)}</span>`;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

/*function appendBot(text) {
  const p = document.createElement("p");
  p.className = "msg bot";
  p.innerHTML = `<strong>Asistente CICA:</strong> ${escapeHtml(text)}`;
  chatbox.appendChild(p);
  chatbox.scrollTop = chatbox.scrollHeight;
}*/function appendBot(text) {
  const div = document.createElement("div");
  div.className = "chat-bubble bot-bubble";
  div.innerHTML = `<span><strong>BotCICA:</strong> ${escapeHtml(text)}</span>`;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function escapeHtml(unsafe) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function sendMessage(){
  const text = input.value.trim();
  if (!text) return;
  appendUser(text);
  input.value = "";
  sendBtn.disabled = true;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    if (!res.ok) {
      const txt = await res.text();
      appendBot("Error del servidor: " + txt);
      sendBtn.disabled = false;
      return;
    }

    const data = await res.json();
    appendBot(data.respuesta || "Sin respuesta.");

  } catch (err) {
    appendBot("No se pudo conectar con el servidor.");
    console.error(err);
  } finally {
    sendBtn.disabled = false;
  }
}
