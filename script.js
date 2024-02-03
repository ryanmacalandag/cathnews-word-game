const game = document.querySelector('#game');
const guessRows = document.querySelectorAll('.guess.row');
const notif = document.querySelector('#notif');

// Sample answer word
const answer = "leave";
const answerArray = answer.split("");

// Counters 
let currentGuessRow = 0;

// Submitted word
const currentGuess = [];

// Guess list
const allGuesses = [];

// Print letter on current guess row
function showChar() {
  const boxes = guessRows[currentGuessRow].querySelectorAll('.char');
  boxes.forEach ((box, i) => {
    box.textContent = currentGuess[i];
  })
}

// Validate submitted guess 
async function validateGuess(word) {
  // Get list of valid words
  const response = await fetch("./valid.json");
  const validWords = await response.json();
  return await validWords.includes(word);
}

// Check submitted guess
function checkGuess() {
  // Counter for number of correct letters
  let correctGuesses = 0;
  
  const answeredBoxes = guessRows[currentGuessRow].querySelectorAll('.char');

  answerArray.forEach((ans, j) => {

    // Check if letter is included in the answer
    if (answerArray.includes(answeredBoxes[j].textContent)) {
      answeredBoxes[j].classList.add('position');
    }
    
    // Check if letter matches to answer
    if (ans == answeredBoxes[j].textContent) {
      answeredBoxes[j].classList.add('correct');
      correctGuesses++;
    } else if (ans != answeredBoxes[j].textContent) {
      answeredBoxes[j].classList.add('wrong');
    } 
  })

  // Check if all 5 letters are correct
  if (correctGuesses == 5) {
    // SUCCESS - show success notification
    notif.textContent = "You guessed the word in " + (currentGuessRow + 1) + ((currentGuessRow > 0) ? " tries!" : " try!" );
    notif.classList.toggle('hide');
    return;
  } else {
    // Not all letter are correct, move to next row
    currentGuessRow++;
    // Empty your guess array
    currentGuess.length = 0;
    return;
  }

}

// Capture keyboard clicks
const keys = document.querySelectorAll('.key');
keys.forEach((k) => {
  k.addEventListener('click', (e) => {

    // Style key as used but only after validating word
    if (k.dataset.key != 'enter' && k.dataset.key != 'del') {
      k.classList.add('used');
    }
    
    // Send letter to current guess row
    if (currentGuess.length < 5 && !(k.dataset.key === 'enter') && !(k.dataset.key === 'del')) {
      currentGuess.push(k.dataset.key)
      showChar();
    } else if (k.dataset.key == 'enter') {
      // Check if word is valid
      let validity = validateGuess(currentGuess.join(''));
      console.log(validity)
      if (validity) {
        // Submit currentGuess
        console.log('hey')
        checkGuess();
      }
    } else if (k.dataset.key == 'del') {
      // Check if row has letters to delete
      // Pop last letter
      currentGuess.pop();
      showChar();
    }

  });
});
