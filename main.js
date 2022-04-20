var timerId;
function buildTimer() {
  const seconds = Number(document.getElementById("timeoutSeconds").value);
  return setInterval(endGame, 1000 * seconds);
}

function endGame() {
  clearInterval(timerId);
  const storyText = document.getElementById("storyText");
  storyText.setAttribute("readonly", "true");
  storyText.setAttribute("style", "background: transparent;");
  // count words.
  const inputWords = storyText.value.trim().split(/\s+/);
  const msg = `
    Se acabo el tiempo!

    ${inputWords.length} palabras escritas.
    ${storyText.value.trim().length} caracteres escritos.
  `;
  alert(msg);
}

function resetTimer() {
  clearInterval(timerId);
  timerId = buildTimer();
}

document.getElementById("storyText").addEventListener("keydown", processWord);
function processWord(e) {
  if (e.keyCode == 13 || e.keyCode == 32) {
    resetTimer();
    checkTargetWord();
  }
}
function checkTargetWord(e) {
  // check if target word was used.
  const inputWords = document.getElementById("storyText").value.trim().split(/\s+/);
  const lastWord = inputWords[inputWords.length - 1];
  const targetWord = document.getElementById("targetWord").innerHTML;
  if (targetWord === ". . .") {
    document.getElementById("targetWord").innerHTML = getRandomWord();
  } else if (normString(lastWord) === normString(targetWord)) {
    document.getElementById("targetWord").innerHTML = getRandomWord();
    const prevWords = document.getElementById("prevWords")
    prevWords.innerHTML = "<div>" + targetWord + "</div>" + prevWords.innerHTML;
    document.getElementById("randomImage").setAttribute("src", getRandomImage());
  }
}

var randomImageList;
const urlImages = "https://gist.githubusercontent.com/nchz/3fd8b2a8174c00891e61f28e392865f4/raw/a9638c0271a59578ba7d89d0ff09cabb49fdc2bb/gistfile1.txt";
fetch(urlImages).then(r => r.text()).then(t => randomImageList = t.split("\n"));
function getRandomImage() {
  const i = Math.floor(Math.random() * randomImageList?.length);
  return randomImageList?.slice(i, i + 1) || "";
}

var randomWordList;
const urlWords = "https://raw.githubusercontent.com/mazyvan/most-common-spanish-words/master/most-common-spanish-words-v4.txt";
fetch(urlWords).then(r => r.text()).then(t => randomWordList = t.split("\n").map(w => removePunctChars(w.trim())).filter(w => w.length > 3 && isWord(w)));
function getRandomWord() {
  const i = Math.floor(Math.random() * randomWordList?.length);
  return randomWordList?.slice(i, i + 1) || ". . .";
}
document.getElementById("targetWord").innerHTML = getRandomWord();

function resetGame() {
  clearInterval(timerId);
  // reset text.
  const storyText = document.getElementById("storyText");
  storyText.value = "";
  storyText.removeAttribute("readonly");
  storyText.removeAttribute("style");
  // reset random words.
  document.getElementById("targetWord").innerHTML = ". . .";
  document.getElementById("prevWords").innerHTML = "";
  document.getElementById("randomImage").removeAttribute("src");
}

function downloadStory() {
  const storyText = document.getElementById("storyText").value;
  const now = new Date();
  const downloadLink = document.createElement("a");
  downloadLink.href = "data:x-application/text," + escape(storyText);
  downloadLink.download = `${now.toISOString().slice(0, -5)}.txt`;
  downloadLink.click();
  downloadLink.remove();
}
