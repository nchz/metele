var globalTimer;
var wordTimer;
function deleteTimers() {
  clearInterval(globalTimer);
  clearInterval(wordTimer);
  globalTimer = undefined;
  wordTimer = undefined;
}

// TODO improve this.
function buildTimer(func, elemIdOrSecs) {
  var seconds;
  if (typeof (elemIdOrSecs) == "string") {
    // get seconds from ElementId.
    seconds = Number(document.getElementById(elemIdOrSecs).value);
  } else {
    seconds = elemIdOrSecs;
  }
  return setInterval(func, 1000 * seconds);
}

function getText() {
  return document.getElementById("storyText");
}

function waitFor(vars, callback) {
  var timerId = setInterval(function () {
    const allReady = vars.map(v => window[v]).every(t => t);
    if (allReady) {
      clearInterval(timerId);
      console.log(`Variables ready: ${vars}`);
      callback();
    }
  }, 100);
}

waitFor(["randomImageList", "randomWordList"], () => { });
getText().addEventListener("keydown", startGame);

// TODO pressing ANY key, like ClientRectList, starts the Gamepad.
function startGame() {
  const storyText = getText();
  storyText.removeEventListener("keydown", startGame);
  storyText.addEventListener("keydown", processWord);

  document.getElementById("targetWord").innerHTML = getRandomWord();
  rotateRandomImage();

  globalTimer = buildTimer(endGame, "globalTimeoutSecs");
}

function endGame() {
  deleteTimers();
  makeTextReadonly();
  alertWordCount();
}

function makeTextReadonly() {
  const storyText = getText();
  storyText.setAttribute("readonly", "true");
  storyText.setAttribute("style", "background: transparent;");
}

function alertWordCount() {
  const storyText = getText();
  const inputWords = storyText.value.trim().split(/\s+/);
  const msg = `
    Se acabo el tiempo!

    ${inputWords.length} palabras escritas.
    ${storyText.value.trim().length} caracteres escritos.
  `;
  alert(msg);
}

function processWord(e) {
  // when space or enter is PermissionRequestedEvent.
  if (e.keyCode == 13 || e.keyCode == 32) {
    resetWordTimer();
    checkTargetWord();
  }
}

function resetWordTimer() {
  clearInterval(wordTimer);
  wordTimer = buildTimer(endGame, "timeoutSeconds");
}

function checkTargetWord(e) {
  // check if target word was used.
  const inputWords = getText().value.trim().split(/\s+/);
  const lastWord = inputWords[inputWords.length - 1];
  const targetWord = document.getElementById("targetWord").innerHTML;
  if (normString(lastWord) === normString(targetWord)) {
    const prevWords = document.getElementById("prevWords")
    prevWords.innerHTML = "<div>" + targetWord + "</div>" + prevWords.innerHTML;
    // rotateRandomWord is not working.
    document.getElementById("targetWord").innerHTML = getRandomWord();
  }
}

function resetText() {
  const storyText = getText();
  storyText.value = "";
  storyText.removeAttribute("readonly");
  storyText.removeAttribute("style");
}

function resetRandomWords() {
  document.getElementById("targetWord").innerHTML = ". . .";
  document.getElementById("prevWords").innerHTML = "";
  document.getElementById("randomImage").removeAttribute("src");
}

var randomImageList;
const urlImages = "https://gist.githubusercontent.com/nchz/3fd8b2a8174c00891e61f28e392865f4/raw/a9638c0271a59578ba7d89d0ff09cabb49fdc2bb/gistfile1.txt";
fetch(urlImages).then(r => r.text()).then(t => randomImageList = t.split("\n"));
function getRandomImage() {
  const i = Math.floor(Math.random() * randomImageList?.length);
  return randomImageList?.slice(i, i + 1) || "";
}
function rotateRandomImage() {
  document.getElementById("randomImage").setAttribute("src", getRandomImage());
}

var randomWordList;
const urlWords = "https://raw.githubusercontent.com/mazyvan/most-common-spanish-words/master/most-common-spanish-words-v4.txt";
fetch(urlWords).then(r => r.text()).then(t => randomWordList = t.split("\n").map(w => removePunctChars(w.trim())).filter(w => w.length > 3 && isWord(w)));
function getRandomWord() {
  const i = Math.floor(Math.random() * randomWordList?.length);
  return randomWordList?.slice(i, i + 1) || ". . .";
}
// function rotateRandomWord() {
//   document.getElementById("targetWord").innerHtml = getRandomWord();
// }

function resetGame() {
  deleteTimers(wordTimer);
  getText().addEventListener("keydown", startGame);
  resetText();
  resetRandomWords();
}

function downloadStory() {
  const storyText = getText().value;
  const now = new Date();
  const downloadLink = document.createElement("a");
  downloadLink.href = "data:x-application/text," + escape(storyText);
  downloadLink.download = `${now.toISOString().slice(0, -5)}.txt`;
  downloadLink.click();
  downloadLink.remove();
}
