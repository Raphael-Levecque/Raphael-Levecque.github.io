// Exercice Python -> message caché.
// Python tourne dans le navigateur (Pyodide). La page ne contient que les
// empreintes SHA-256 des résultats attendus (voir tools/build_exercice.py).
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
const FUNC_NAME = "reverse_string";

const displayHintOne = () => {
  document.getElementById("hint-one").hidden = !document.getElementById("hint-one").hidden;
}

const displayHintTwo = () => {
  document.getElementById("hint-two").hidden = !document.getElementById("hint-two").hidden;
}

const displaySoluce = () => {
  document.getElementById("soluce").hidden = !document.getElementById("soluce").hidden;
}
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

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const sha256 = async (s) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));

// Affiche le texte ; les URL http(s) deviennent des liens cliquables.
function renderMessage(container, text) {
  const p = document.createElement("p");
  for (const part of text.split(/(https?:\/\/\S+)/)) {
    if (/^https?:\/\//.test(part)) {
      const a = document.createElement("a");
      a.href = part; a.textContent = part; a.target = "_blank"; a.rel = "noopener noreferrer";
      p.appendChild(a);
    } else {
      p.appendChild(document.createTextNode(part));
    }
  }
  container.appendChild(p);
}

async function runTests() {
  const btn = $("exo-run"), status = $("exo-status"), list = $("exo-results"), reveal = $("exo-reveal");
  btn.disabled = true;
  list.innerHTML = ""; reveal.innerHTML = "";
  try {
    status.textContent = "chargement de Python (la 1re fois ça prend quelques secondes)…";
    const [py, meta] = await Promise.all([
      loadPyodideOnce(),
      fetch("/assets/exercice/meta.json", { cache: "no-store" }).then((r) => r.json()),
    ]);
    status.textContent = "exécution…";

    const ns = py.globals.get("dict")();
    py.globals.set("_code", $("exo-code").value);
    py.globals.set("_ns", ns);
    try {
      await py.runPythonAsync("exec(_code, _ns)");
    } catch (e) {
      status.textContent = "❌ erreur dans ton code";
      const li = document.createElement("li");
      li.style.whiteSpace = "pre-wrap";
      li.textContent = String(e.message).split("\n").slice(-4).join("\n");
      list.appendChild(li);
      return;
    }
    if (!ns.get(FUNC_NAME)) {
      status.textContent = `❌ la fonction ${FUNC_NAME} n'existe pas`;
      return;
    }

    const results = [];
    let allOk = true;
    for (const t of meta.tests) {
      let out = "", err = null;
      try {
        py.globals.set("_arg", t.args);
        out = await py.runPythonAsync(`str(_ns["${FUNC_NAME}"](_arg))`);
      } catch (e) {
        err = String(e.message).split("\n").slice(-2).join(" ");
      }
      const ok = !err && (await sha256(out)) === t.hash;
      allOk = allOk && ok;
      results.push(out);
      const li = document.createElement("li");
      li.textContent = `${ok ? "✅" : "❌"} ${FUNC_NAME}(${JSON.stringify(t.args)})` +
        (ok ? "" : ` → ${err ? "erreur : " + err : JSON.stringify(out)}`);
      list.appendChild(li);
    }

    if (!allOk) {
      status.textContent = "pas encore… regarde les ❌ 🙂";
      return;
    }
    results.forEach((r) => renderMessage(reveal, r));
  } catch (e) {
    status.textContent = "⚠️ " + e.message;
  } finally {
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const el = document.getElementById(btn.dataset.toggle);
    el.hidden = !el.hidden;   // un 2e clic le recache
    });
  })
  $("exo-run").addEventListener("click", runTests);
  // Tab = 4 espaces dans l'éditeur
  $("exo-code").addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const t = e.target;
    t.setRangeText("    ", t.selectionStart, t.selectionEnd, "end");
  });
});
