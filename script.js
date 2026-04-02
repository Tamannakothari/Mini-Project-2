// FULL COUNTRY LIST
const countries = [
"afghanistan","albania","algeria","andorra","angola","argentina","armenia","australia","austria","azerbaijan",
"bahamas","bahrain","bangladesh","barbados","belarus","belgium","belize","benin","bhutan","bolivia",
"bosnia and herzegovina","botswana","brazil","brunei","bulgaria","burkina faso","burundi","cabo verde","cambodia","cameroon",
"canada","central african republic","chad","chile","china","colombia","comoros","congo","costa rica","croatia",
"cuba","cyprus","czech republic","denmark","djibouti","dominica","dominican republic","ecuador","egypt","el salvador",
"equatorial guinea","eritrea","estonia","eswatini","ethiopia","fiji","finland","france","gabon","gambia",
"georgia","germany","ghana","greece","grenada","guatemala","guinea","guinea-bissau","guyana","haiti",
"honduras","hungary","iceland","india","indonesia","iran","iraq","ireland","israel","italy",
"jamaica","japan","jordan","kazakhstan","kenya","kiribati","kuwait","kyrgyzstan","laos","latvia",
"lebanon","lesotho","liberia","libya","liechtenstein","lithuania","luxembourg","madagascar","malawi","malaysia",
"maldives","mali","malta","marshall islands","mauritania","mauritius","mexico","micronesia","moldova","monaco",
"mongolia","montenegro","morocco","mozambique","myanmar","namibia","nauru","nepal","netherlands","new zealand",
"nicaragua","niger","nigeria","north korea","north macedonia","norway","oman","pakistan","palau","panama",
"papua new guinea","paraguay","peru","philippines","poland","portugal","qatar","romania","russia","rwanda",
"saint kitts and nevis","saint lucia","saint vincent and the grenadines","samoa","san marino","sao tome and principe","saudi arabia","senegal","serbia","seychelles",
"sierra leone","singapore","slovakia","slovenia","solomon islands","somalia","south africa","south korea","south sudan","spain",
"sri lanka","sudan","suriname","sweden","switzerland","syria","taiwan","tajikistan","tanzania","thailand",
"timor-leste","togo","tonga","trinidad and tobago","tunisia","turkey","turkmenistan","tuvalu","uganda","ukraine",
"united arab emirates","united kingdom","united states","uruguay","uzbekistan","vanuatu","vatican city","venezuela","vietnam","yemen",
"zambia","zimbabwe"
];

let guessed = [];
let time = 15 * 60;
let timerInterval = null;
let isRunning = false;

// NORMALIZE INPUT
function normalize(str) {
  return str.toLowerCase().trim();
}

// INITIALIZE MAP WITH ?
function initializeMap() {
  const svgDoc = document.getElementById("worldMap").contentDocument;
  const svg = svgDoc.querySelector("svg");

  countries.forEach(country => {
    let id = country.replace(/ /g, "-");

    const shape = svgDoc.getElementById(id);
    if (!shape) return;

    const bbox = shape.getBBox();

    const text = svgDoc.createElementNS("http://www.w3.org/2000/svg", "text");

    text.setAttribute("x", bbox.x + bbox.width / 2);
    text.setAttribute("y", bbox.y + bbox.height / 2);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", "label");
    text.setAttribute("data-country", id);

    text.textContent = "?";

    svg.appendChild(text);
  });
}

// HANDLE GUESS
function handleGuess() {
  if (!isRunning) return;

  const input = document.getElementById("guessInput");
  const guess = normalize(input.value);

  if (!guess) return;

  if (!countries.includes(guess)) {
    setMessage("❌ Not a country");
  } else if (guessed.includes(guess)) {
    setMessage("⚠️ Already guessed");
  } else {
    guessed.push(guess);
    fillCountry(guess);
    updateProgress();
    setMessage("✅ Correct!");

    if (guessed.length === countries.length) {
      clearInterval(timerInterval);
      setMessage("🎉 You got all 197!");
    }
  }

  input.value = "";
}

// FILL COUNTRY
function fillCountry(countryName) {
  const svgDoc = document.getElementById("worldMap").contentDocument;
  const svg = svgDoc.querySelector("svg");

  let id = countryName.replace(/ /g, "-");
  const shape = svgDoc.getElementById(id);

  if (!shape) return;

  shape.style.fill = "#4CAF50";

  const label = svg.querySelector(`text[data-country="${id}"]`);
  if (label) label.remove();

  const bbox = shape.getBBox();

  const text = svgDoc.createElementNS("http://www.w3.org/2000/svg", "text");

  text.setAttribute("x", bbox.x + bbox.width / 2);
  text.setAttribute("y", bbox.y + bbox.height / 2);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("class", "label");

  text.textContent = countryName;

  svg.appendChild(text);
}

// PROGRESS
function updateProgress() {
  document.getElementById("progress").textContent =
    `${guessed.length} / ${countries.length}`;
}

// TIMER
function startTimer() {
  if (isRunning) return;

  isRunning = true;
  document.getElementById("guessInput").disabled = false;

  timerInterval = setInterval(() => {
    let min = Math.floor(time / 60);
    let sec = time % 60;
    sec = sec < 10 ? "0" + sec : sec;

    document.getElementById("timer").textContent = `${min}:${sec}`;

    time--;

    if (time < 0) {
      clearInterval(timerInterval);
      isRunning = false;
      setMessage("⏰ Time's up!");
    }
  }, 1000);
}

// PAUSE
function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

// RESET
function resetGame() {
  guessed = [];
  time = 15 * 60;
  isRunning = false;

  const svgDoc = document.getElementById("worldMap").contentDocument;

  if (svgDoc) {
    svgDoc.querySelectorAll("path").forEach(p => {
      p.style.fill = "#ddd";
    });

    svgDoc.querySelectorAll("text").forEach(t => t.remove());
  }

  document.getElementById("guessInput").disabled = true;

  updateProgress();
  initializeMap();
}

// MESSAGE
function setMessage(msg) {
  document.getElementById("message").textContent = msg;
}

// EVENTS
document.getElementById("startBtn").addEventListener("click", startTimer);
document.getElementById("pauseBtn").addEventListener("click", pauseTimer);
document.getElementById("resetBtn").addEventListener("click", resetGame);

document.getElementById("guessInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleGuess();
});

// LOAD SVG
document.getElementById("worldMap").addEventListener("load", () => {
  initializeMap();
  updateProgress();
});