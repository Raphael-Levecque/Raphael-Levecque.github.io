// Exercice Python -> image cachée.
// Python tourne dans le navigateur (Pyodide). L'image est chiffrée (AES-GCM) ;
// la clé est dérivée des résultats de la bonne solution, voir tools/build_exercice.py
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
const FUNC_NAME = "reverse_string";

const $ = (id) => document.getElementById(id);
let pyodidePromise = null;

function loadPyodideOnce() {
  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = PYODIDE_URL + "pyodide.js";
      s.onload = () => loadPyodide({ indexURL: PYODIDE_URL }).then(resolve, reject);
      s.onerror = () => reject(new Error("impossible de charger Pyodide"));
      document.head.appendChild(s);
    });
  }
  return pyodidePromise;
}

const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const sha256 = async (s) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));

async function decryptImage(meta, secret) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: b64(meta.salt), iterations: meta.iterations, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]
  );
  const enc = await (await fetch("/assets/exercice/image.enc")).arrayBuffer();
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(meta.iv) }, key, enc);
  return URL.createObjectURL(new Blob([plain], { type: meta.mime }));
}

async function runTests() {
  const btn = $("exo-run"), status = $("exo-status"), list = $("exo-results"), reveal = $("exo-reveal");
  btn.disabled = true;
  list.innerHTML = ""; reveal.innerHTML = "";
  try {
    status.textContent = "chargement de Python ...";
    const [py, meta] = await Promise.all([
      loadPyodideOnce(),
      fetch("/assets/exercice/meta.json").then((r) => r.json()),
    ]);
    status.textContent = "exécution…";

    const ns = py.globals.get("dict")();
    py.globals.set("_code", $("exo-code").value);
    py.globals.set("_ns", ns);
    try {
      await py.runPythonAsync("exec(_code, _ns)");
    } catch (e) {
      status.textContent = "❌ erreur dans ton code";
      list.innerHTML = `<li style="white-space:pre-wrap;">${escapeHtml(String(e.message).split("\n").slice(-4).join("\n"))}</li>`;
      return;
    }
    if (!ns.get(FUNC_NAME)) {
      status.textContent = `❌ la fonction ${FUNC_NAME} n'existe pas`;
      return;
    }

    const results = [];
    let allOk = true;
    for (const t of meta.tests) {
      let out, err = null;
      try {
        py.globals.set("_args", py.toPy(t.args));
        out = await py.runPythonAsync(`str(_ns["${FUNC_NAME}"](list(_args)))`);
      } catch (e) {
        err = String(e.message).split("\n").slice(-2).join(" ");
        out = "";
      }
      const ok = !err && (await sha256(out)) === t.hash;
      allOk = allOk && ok;
      results.push(out);
      const li = document.createElement("li");
      li.textContent = `${ok ? "✅" : "❌"} ${FUNC_NAME}(${JSON.stringify(t.args)}) → ${err ? "erreur : " + err : out}`;
      list.appendChild(li);
    }

    if (!allOk) {
      status.textContent = "pas encore… regarde les ❌ 🙂";
      return;
    }
    status.textContent = "✅ bravo, déchiffrement de l'image…";
    const url = await decryptImage(meta, results.join("|"));
    status.textContent = "🎉 débloqué !";
    reveal.innerHTML = `<img src="${url}" alt="image cachée" style="max-width:100%; border-radius:10px;">`;
  } catch (e) {
    status.textContent = "⚠️ " + e.message;
  } finally {
    btn.disabled = false;
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

document.addEventListener("DOMContentLoaded", () => {
  $("exo-run").addEventListener("click", runTests);
  // Tab = 4 espaces dans l'éditeur
  $("exo-code").addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const t = e.target, s = t.selectionStart;
    t.setRangeText("    ", s, t.selectionEnd, "end");
  });
});
