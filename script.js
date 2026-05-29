// ELEMENTS

const thoughtInput = document.getElementById("thoughtInput");

const saveBtn = document.getElementById("saveBtn");

const thoughtsContainer =
  document.getElementById("thoughtsContainer");

const emptyState =
  document.getElementById("emptyState");

const feedback =
  document.getElementById("feedback");

const searchInput =
  document.getElementById("searchInput");

// STATE

let thoughts =
  JSON.parse(
    localStorage.getItem("midnightThoughts")
  ) || [];

let selectedTag = "random";

let selectedMood = "normal";

// DISPLAY

displayThoughts();

// SAVE

saveBtn.addEventListener("click", () => {

  const text = thoughtInput.value.trim();

  if(!text){

    showFeedback("Write something first...");
    return;

  }

  const thought = {

    text,

    time:new Date().toLocaleString(),

    tag:selectedTag,

    mood:selectedMood,

    pinned:false

  };

  thoughts.unshift(thought);

  saveToLocalStorage();

  thoughtInput.value = "";

  displayThoughts();

  showFeedback("Thought saved ✨");

});

// DISPLAY THOUGHTS

function displayThoughts(filterText = ""){

  thoughtsContainer.innerHTML = "";

  let filtered = thoughts.filter(t =>
    t.text.toLowerCase()
    .includes(filterText.toLowerCase())
  );

  if(filtered.length === 0){

    emptyState.style.display = "block";
    return;

  }else{

    emptyState.style.display = "none";

  }

  filtered.forEach((thought)=>{

    const realIndex = thoughts.indexOf(thought);

    const card = document.createElement("div");

    card.classList.add(
      "thought-card",
      "glass",
      thought.tag,
      thought.mood
    );

    card.innerHTML = `

      <p class="thought-text">
        ${thought.text}
      </p>

      <div class="card-footer">

        <small class="date">
          ${thought.time}
        </small>

        <div class="card-buttons">

          <button onclick="togglePin(${realIndex})">
            📌
          </button>

          <button onclick="editThought(${realIndex})">
            ✏️
          </button>

          <button onclick="deleteThought(${realIndex})">
            🗑️
          </button>

        </div>

      </div>

    `;

    thoughtsContainer.appendChild(card);

  });

}

// DELETE

function deleteThought(index){

  thoughts.splice(index,1);

  saveToLocalStorage();

  displayThoughts();

  showFeedback("Deleted 🗑️");

}

// EDIT

function editThought(index){

  const updated = prompt(
    "Edit your thought:",
    thoughts[index].text
  );

  if(updated && updated.trim()){

    thoughts[index].text = updated.trim();

    saveToLocalStorage();

    displayThoughts();

    showFeedback("Updated ✨");

  }

}

// PIN

function togglePin(index){

  thoughts[index].pinned =
    !thoughts[index].pinned;

  thoughts.sort((a,b)=>b.pinned-a.pinned);

  saveToLocalStorage();

  displayThoughts();

}

// SEARCH

searchInput.addEventListener("input",(e)=>{

  displayThoughts(e.target.value);

});

// TAGS

document.querySelectorAll(".tag")
.forEach(btn=>{

  btn.addEventListener("click",()=>{

    selectedTag = btn.dataset.tag;

    showFeedback(
      "Tag selected: " + selectedTag
    );

  });

});

// MOODS

document.querySelectorAll(".mood-btn")
.forEach(btn=>{

  btn.addEventListener("click",()=>{

    document.querySelectorAll(".mood-btn")
    .forEach(b=>b.classList.remove("active"));

    btn.classList.add("active");

    selectedMood = btn.dataset.mood;

  });

});

// EXPORT

document.getElementById("exportBtn")
.addEventListener("click",()=>{

  const data =
    JSON.stringify(thoughts,null,2);

  const blob = new Blob(
    [data],
    {type:"text/plain"}
  );

  const a =
    document.createElement("a");

  a.href =
    URL.createObjectURL(blob);

  a.download =
    "midnight-thoughts.json";

  a.click();

});

// MIRROR

document.getElementById("mirrorBtn")
.addEventListener("click",()=>{

  let msg = thoughts
  .map(t=>
    `You are overthinking again...\n→ ${t.text}`
  )
  .join("\n\n");

  alert(msg || "No thoughts yet.");

});

// RECORD

document.getElementById("recordBtn")
.addEventListener("click",async()=>{

  const stream =
    await navigator.mediaDevices
    .getUserMedia({audio:true});

  const recorder =
    new MediaRecorder(stream);

  let chunks = [];

  recorder.start();

  showFeedback("Recording... 🎙");

  recorder.ondataavailable =
    e => chunks.push(e.data);

  recorder.onstop = ()=>{

    const blob =
      new Blob(chunks,{
        type:"audio/webm"
      });

    const url =
      URL.createObjectURL(blob);

    const audio =
      new Audio(url);

    audio.play();

    showFeedback("Voice note played 🎧");

  };

  setTimeout(()=>{
    recorder.stop();
  },5000);

});

// MUSIC

const music =
  document.getElementById("bgMusic");

const musicToggle =
  document.getElementById("musicToggle");

let isPlaying = false;

musicToggle.addEventListener("click",()=>{

  if(!isPlaying){

    music.play();

    musicToggle.innerText =
      "Pause Music";

    isPlaying = true;

  }else{

    music.pause();

    musicToggle.innerText =
      "Play Music";

    isPlaying = false;

  }

});

// LOCAL STORAGE

function saveToLocalStorage(){

  localStorage.setItem(
    "midnightThoughts",
    JSON.stringify(thoughts)
  );

}

// FEEDBACK

function showFeedback(msg){

  feedback.innerText = msg;

  setTimeout(()=>{

    feedback.innerText = "";

  },2000);

}

// LOCK SCREEN

const unlockBtn =
  document.getElementById("unlockBtn");

const passwordInput =
  document.getElementById("passwordInput");

const lockScreen =
  document.getElementById("lockScreen");

const lockMessage =
  document.getElementById("lockMessage");

const PASSWORD = "moonlight";

unlockBtn.addEventListener("click",()=>{

  if(passwordInput.value === PASSWORD){

    lockScreen.style.display = "none";

  }else{

    lockMessage.innerText =
      "Wrong password 🌙";

  }

});

// QUOTES

const quotes = [

  "Some thoughts only visit after midnight.",

  "The moon understands silence.",

  "Even stars feel lonely sometimes.",

  "Not every thought needs an answer."

];

let q = 0;

setInterval(()=>{

  q++;

  if(q >= quotes.length){
    q = 0;
  }

  document.getElementById("quoteText")
  .innerText = quotes[q];

},4000);
