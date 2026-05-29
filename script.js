// =========================
// SELECT ELEMENTS
// =========================

const thoughtInput = document.getElementById("thoughtInput");
const saveBtn = document.getElementById("saveBtn");
const thoughtsContainer = document.getElementById("thoughtsContainer");
const emptyState = document.getElementById("emptyState");
const feedback = document.getElementById("feedback");

// =========================
// QUOTES
// =========================

const quotes = [

  "Some thoughts only visit after midnight.",

  "The moon understands what the sun never could.",

  "Not every storm comes to destroy you.",

  "Your silent thoughts still matter.",

  "Even lonely nights create beautiful souls.",

  "Stars shine brightest in dark skies."

];

const quoteText =
  document.getElementById("quoteText");

// Random Quote

const randomQuote =
  quotes[Math.floor(Math.random() * quotes.length)];

quoteText.innerHTML =
  `"${randomQuote}"`;

  // =========================
// MOOD SELECTOR
// =========================

const moodButtons =
  document.querySelectorAll(".mood-btn");

let selectedMood = "normal";

// Mood Click

moodButtons.forEach(button => {

  button.addEventListener("click", () => {

    // Remove active class
    moodButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    // Add active
    button.classList.add("active");

    // Save mood
    selectedMood =
      button.dataset.mood;

  });

});

// =========================
// PASSWORD SYSTEM
// =========================

const lockScreen =
  document.getElementById("lockScreen");

const passwordInput =
  document.getElementById("passwordInput");

const unlockBtn =
  document.getElementById("unlockBtn");

const lockMessage =
  document.getElementById("lockMessage");

// Get saved password
let savedPassword =
  localStorage.getItem("journalPassword");

// =========================
// FIRST TIME SETUP
// =========================

if(!savedPassword){

  lockMessage.innerHTML =
    "Create your secret password";

  unlockBtn.innerHTML =
    "Set Password";

}

// =========================
// BUTTON CLICK
// =========================

unlockBtn.addEventListener("click", () => {

  const enteredPassword =
    passwordInput.value.trim();

  // Prevent empty password
  if(enteredPassword === ""){

    lockMessage.innerHTML =
      "Password cannot be empty";

    return;
  }

  // =========================
  // FIRST TIME CREATE PASSWORD
  // =========================

  if(!savedPassword){

    localStorage.setItem(
      "journalPassword",
      enteredPassword
    );

    savedPassword = enteredPassword;

    lockMessage.innerHTML =
      "Password created successfully ✨";

    setTimeout(() => {

      lockScreen.style.display = "none";

    }, 800);

    return;
  }

  // =========================
  // CHECK PASSWORD
  // =========================

  if(enteredPassword === savedPassword){

    lockScreen.style.display = "none";

  }else{

    lockMessage.innerHTML =
      "Wrong password...";
  }

});

// =========================
// LOAD THOUGHTS
// =========================

let thoughts =
  JSON.parse(localStorage.getItem("midnightThoughts")) || [];

// Display thoughts on page load
displayThoughts();

// =========================
// SAVE THOUGHT
// =========================

saveBtn.addEventListener("click", () => {

  const thoughtText = thoughtInput.value.trim();

  // Prevent empty input
  if (thoughtText === "") {
    showFeedback("Write something first...");
    return;
  }

  // Thought Object
 const thought = {
  text: thoughtText,
  time: new Date().toLocaleString(),
  mood: selectedMood
};

  // Add new thought at top
  thoughts.unshift(thought);

  // Save to localStorage
  saveToLocalStorage();

  // Clear textarea
  thoughtInput.value = "";

  // Refresh UI
  displayThoughts();

  // Feedback
  showFeedback("Thought saved ✨");

});

// =========================
// DISPLAY THOUGHTS
// =========================

function displayThoughts() {

  thoughtsContainer.innerHTML = "";

  // Show empty state
  if (thoughts.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  // Create cards
  thoughts.forEach((thought, index) => {

    const card = document.createElement("div");

    card.classList.add("thought-card", "glass");
    card.classList.add(thought.mood);

    card.innerHTML = `
      <p class="thought-text">
        ${thought.text}
      </p>

      <div class="card-footer">

        <span class="date">
          ${thought.time}
        </span>

        <div class="card-buttons">

  <button
    class="edit-btn"
    data-index="${index}"
  >
    Edit
  </button>

  <button
    class="delete-btn"
    data-index="${index}"
  >
    Delete
  </button>

</div>

      </div>
    `;

    thoughtsContainer.appendChild(card);

  });

}

// =========================
// DELETE THOUGHT
// =========================

thoughtsContainer.addEventListener("click", (e) => {

  // Check if delete button clicked
  if (e.target.classList.contains("delete-btn")) {

    const index = e.target.dataset.index;

    // Remove thought
    thoughts.splice(index, 1);

    // Save updated array
    saveToLocalStorage();

    // Refresh UI
    displayThoughts();

    // Feedback
    showFeedback("Thought deleted 🗑️");
  }

});

// =========================
// EDIT THOUGHT
// =========================

thoughtsContainer.addEventListener("click", (e) => {

  // Check edit button
  if(e.target.classList.contains("edit-btn")){

    const index =
      e.target.dataset.index;

    // Get current text
    const currentText =
      thoughts[index].text;

    // Prompt edit
    const editedText =
      prompt(
        "Edit your thought:",
        currentText
      );

    // Prevent empty edit
    if(
      editedText !== null &&
      editedText.trim() !== ""
    ){

      thoughts[index].text =
        editedText.trim();

      // Save updated
      saveToLocalStorage();

      // Refresh UI
      displayThoughts();

      // Feedback
      showFeedback("Thought updated ✨");

    }

  }

});

// =========================
// SAVE TO LOCAL STORAGE
// =========================

function saveToLocalStorage() {

  localStorage.setItem(
    "midnightThoughts",
    JSON.stringify(thoughts)
  );

}

/* TAGS */
document.querySelectorAll(".tag").forEach(btn=>{
btn.onclick = ()=> selectedTag = btn.dataset.tag;
});

// =========================
// FEEDBACK MESSAGE
// =========================

function showFeedback(message) {

  feedback.textContent = message;

  setTimeout(() => {
    feedback.textContent = "";
  }, 2000);

}

// =========================
// BACKGROUND MUSIC
// =========================

const bgMusic =
  document.getElementById("bgMusic");

const musicToggle =
  document.getElementById("musicToggle");

let isPlaying = false;

// Volume
bgMusic.volume = 0.4;

// Toggle Music

musicToggle.addEventListener("click", () => {

  if(!isPlaying){

    bgMusic.play();

    musicToggle.innerHTML = "Pause Music";

    isPlaying = true;

  }else{

    bgMusic.pause();

    musicToggle.innerHTML = "Play Music";

    isPlaying = false;
  }

});

/* MOOD */
document.querySelectorAll(".mood-selector button").forEach(btn=>{
btn.onclick = ()=> selectedMood = btn.dataset.mood;
});

/* DETECT MOOD */
function detectMood(text){

let t = text.toLowerCase();

if(t.includes("cry")||t.includes("sad")) return "sad";

if(t.includes("love")) return "love";

if(t.includes("exam")||t.includes("study")) return "study";

return "normal";
}

/* PIN */
function togglePin(i){
thoughts[i].pinned = !thoughts[i].pinned;
save(); render();
}

/* SEARCH */
document.getElementById("searchInput").oninput = (e)=>{
render(e.target.value);
};

/* EXPORT */
document.getElementById("exportBtn").onclick = ()=>{

let data = JSON.stringify(thoughts);

let blob = new Blob([data],{type:"text/plain"});

let a = document.createElement("a");

a.href = URL.createObjectURL(blob);

a.download = "midnight_thoughts.txt";

a.click();
};

/* MIRROR THOUGHTS */
document.getElementById("mirrorBtn").onclick = ()=>{

let mirrorText = thoughts.map(t=>
"You are overthinking again: " + t.text
).join("\n");

alert(mirrorText);
};

/* VOICE RECORD */
let recorder;
let chunks = [];

document.getElementById("recordBtn").onclick = async ()=>{

let stream = await navigator.mediaDevices.getUserMedia({audio:true});

recorder = new MediaRecorder(stream);

recorder.start();

recorder.ondataavailable = e=>chunks.push(e.data);

recorder.onstop = ()=>{

let blob = new Blob(chunks,{type:"audio/mp3"});

chunks=[];

let url = URL.createObjectURL(blob);

let audio = new Audio(url);

audio.play();

};

setTimeout(()=>recorder.stop(),5000);
};

/* RENDER */
function render(search=""){

let container = document.getElementById("thoughtsContainer");

container.innerHTML="";

thoughts
.sort((a,b)=>b.pinned-a.pinned)
.filter(t=>t.text.includes(search))
.forEach((t,i)=>{

let div=document.createElement("div");

div.className=`thought glass ${t.tag} ${t.mood}`;

if(t.pinned) div.classList.add("pinned");

div.innerHTML=`
<b>${t.text}</b><br>
<small>${t.time}</small><br>

<button onclick="togglePin(${i})">📌 Pin</button>
`;

container.appendChild(div);

});

}

function save(){
localStorage.setItem("t",JSON.stringify(thoughts));
}

render();

// =========================
// SERVICE WORKER
// =========================

if("serviceWorker" in navigator){

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("./sw.js")

      .then(() => {
        console.log("Service Worker Registered");
      });

  });

}
