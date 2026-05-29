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
// CHANGE PASSWORD
// =========================

const changePasswordBtn =
  document.getElementById("changePasswordBtn");

changePasswordBtn.addEventListener("click", () => {

  const oldPassword =
    prompt("Enter old password:");

  const savedPassword =
    localStorage.getItem("journalPassword");

  if(oldPassword === savedPassword){

    const newPassword =
      prompt("Enter new password:");

    if(newPassword && newPassword.trim() !== ""){

      localStorage.setItem(
        "journalPassword",
        newPassword
      );

      alert("Password changed successfully ✨");

    } else {

      alert("Invalid new password");
    }

  } else {

    alert("Wrong password ❌");
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
