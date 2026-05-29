window.addEventListener("DOMContentLoaded", () => {
// =========================
// SELECT ELEMENTS
// =========================

const thoughtInput = document.getElementById("thoughtInput");
const saveBtn = document.getElementById("saveBtn");
const thoughtsContainer = document.getElementById("thoughtsContainer");
const emptyState = document.getElementById("emptyState");
const feedback = document.getElementById("feedback");

const searchInput = document.getElementById("searchInput");

// =========================
// STATE
// =========================

let thoughts = JSON.parse(localStorage.getItem("midnightThoughts")) || [];

let selectedTag = "random";
let selectedMood = "normal";

// =========================
// INIT
// =========================

displayThoughts();

// =========================
// SAVE THOUGHT
// =========================

saveBtn.addEventListener("click", () => {

  const text = thoughtInput.value.trim();

  if (!text) {
    showFeedback("Write something first...");
    return;
  }

  const thought = {
    text,
    time: new Date().toLocaleString(),
    tag: selectedTag,
    mood: selectedMood,
    pinned: false
  };

  thoughts.unshift(thought);

  saveToLocalStorage();
  thoughtInput.value = "";

  displayThoughts();
  showFeedback("Thought saved ✨");

});

// =========================
// DISPLAY THOUGHTS
// =========================

function displayThoughts(filterText = "") {

  thoughtsContainer.innerHTML = "";

  let filtered = thoughts.filter(t =>
    t.text.toLowerCase().includes(filterText.toLowerCase())
  );

  if (filtered.length === 0) {
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  filtered.forEach((thought, index) => {

    const card = document.createElement("div");

    card.classList.add("thought-card", "glass", thought.tag, thought.mood);

    if (thought.pinned) card.classList.add("pinned");

    card.innerHTML = `
      <p>${thought.text}</p>
      <small>${thought.time}</small>

      <div class="card-buttons">

        <button onclick="togglePin(${index})">📌</button>
        <button onclick="editThought(${index})">✏️</button>
        <button onclick="deleteThought(${index})">🗑️</button>

      </div>
    `;

    thoughtsContainer.appendChild(card);

  });

}

// =========================
// DELETE
// =========================

function deleteThought(index) {
  thoughts.splice(index, 1);
  saveToLocalStorage();
  displayThoughts();
  showFeedback("Deleted 🗑️");
}

// =========================
// EDIT
// =========================

function editThought(index) {

  const updated = prompt("Edit your thought:", thoughts[index].text);

  if (updated && updated.trim()) {
    thoughts[index].text = updated.trim();
    saveToLocalStorage();
    displayThoughts();
    showFeedback("Updated ✨");
  }

}

// =========================
// PIN
// =========================

function togglePin(index) {
  thoughts[index].pinned = !thoughts[index].pinned;
  saveToLocalStorage();
  displayThoughts();
}

// =========================
// SEARCH
// =========================

searchInput.addEventListener("input", (e) => {
  displayThoughts(e.target.value);
});

// =========================
// TAGS
// =========================

document.querySelectorAll(".tag").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedTag = btn.dataset.tag;
    showFeedback("Tag: " + selectedTag);
  });
});

// =========================
// MOOD
// =========================

document.querySelectorAll(".mood-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".mood-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    selectedMood = btn.dataset.mood;

  });
});

// =========================
// EXPORT
// =========================

document.getElementById("exportBtn").addEventListener("click", () => {

  const data = JSON.stringify(thoughts, null, 2);

  const blob = new Blob([data], { type: "text/plain" });

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "midnight-thoughts.json";

  a.click();

});

// =========================
// MIRROR THOUGHTS
// =========================

document.getElementById("mirrorBtn").addEventListener("click", () => {

  let msg = thoughts
    .map(t => `You are overthinking again...\n→ ${t.text}`)
    .join("\n\n");

  alert(msg || "No thoughts yet.");

});

// =========================
// VOICE RECORD (5 sec)
// =========================

document.getElementById("recordBtn").addEventListener("click", async () => {

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const recorder = new MediaRecorder(stream);

  let chunks = [];

  recorder.start();

  recorder.ondataavailable = e => chunks.push(e.data);

  recorder.onstop = () => {

    const blob = new Blob(chunks, { type: "audio/webm" });

    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);

    audio.play();

  };

  setTimeout(() => recorder.stop(), 5000);

});

// =========================
// LOCAL STORAGE
// =========================

function saveToLocalStorage() {
  localStorage.setItem("midnightThoughts", JSON.stringify(thoughts));
}

// =========================
// FEEDBACK
// =========================

function showFeedback(msg) {

  feedback.innerText = msg;

  setTimeout(() => {
    feedback.innerText = "";
  }, 2000);

}

// =========================
// INITIAL RENDER
// =========================

displayThoughts();

// =========================
// LOCK SYSTEM
// =========================

const unlockBtn =
document.getElementById("unlockBtn");

const passwordInput =
document.getElementById("passwordInput");

const lockScreen =
document.getElementById("lockScreen");

const lockMessage =
document.getElementById("lockMessage");

// CHECK IF PASSWORD EXISTS

let savedPassword =
localStorage.getItem("midnightPassword");

// FIRST TIME USER

if(!savedPassword){

  lockMessage.innerText =
  "Create your secret password 🌙";

  unlockBtn.innerText =
  "Create Password";

}

// MAIN FUNCTION

function unlockJournal(){

  const enteredPassword =
  passwordInput.value.trim();

  // EMPTY INPUT

  if(!enteredPassword){

    lockMessage.innerText =
    "Enter password first";

    return;

  }

  // FIRST TIME → CREATE PASSWORD

  if(!savedPassword){

    localStorage.setItem(
      "midnightPassword",
      enteredPassword
    );

    savedPassword = enteredPassword;

    lockMessage.innerText =
    "Password created ✨";

    setTimeout(() => {

      lockScreen.style.opacity = "0";

      setTimeout(() => {

        lockScreen.style.display =
        "none";

      },500);

    },800);

    return;

  }

  // LOGIN

  if(enteredPassword === savedPassword){

    lockScreen.style.opacity = "0";

    setTimeout(() => {

      lockScreen.style.display =
      "none";

    },500);

  }

  else{

    lockMessage.innerText =
    "Wrong password 🌙";

    passwordInput.style.border =
    "1px solid crimson";

    setTimeout(() => {

      passwordInput.style.border =
      "none";

    },2000);

  }

}

// BUTTON

unlockBtn.addEventListener(
  "click",
  unlockJournal
);

// ENTER KEY

passwordInput.addEventListener(
  "keydown",
  (e)=>{

    if(e.key === "Enter"){

      unlockJournal();

    }

    const resetBtn =
document.getElementById(
  "resetPasswordBtn"
);

resetBtn.addEventListener(
  "click",
  ()=>{

    localStorage.removeItem(
      "midnightPassword"
    );

    location.reload();

  }
);

  }
);

                    
