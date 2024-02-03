const game = document.querySelector('#game');
const guessRows = document.querySelectorAll('.guess.row');
const notif = document.querySelector('#notif');
const keys = document.querySelectorAll('.key');

// Sample answer word
const answer = "leave";
const answerArray = answer.split("");

// Counters 
let currentGuessRow = 0;

// Submitted word
const currentGuess = [];

// List of submitted words
const allGuesses = [];

// List of keys used
const usedKeys = [];

// Valid keys
const validKeys = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
'm', 'n', 'o', 'p', 'q', 'r',  's', 't', 'u', 'v', 'w', 'x',
'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ]

// Print letter on current guess row
function showChar() {
  const boxes = guessRows[currentGuessRow].querySelectorAll('.char');
  boxes.forEach ((box, i) => {
    box.textContent = currentGuess[i];
  })
}

// Style used keys based on currentguess array
function styleKeys() {

  // Go through currentGuess array
  currentGuess.forEach((char) => {
    if (!(usedKeys.includes(char))) {
      usedKeys.push(char);
    }
  });

  // Actual styling
  keys.forEach((key) => {
    if (usedKeys.includes(key.dataset.key)) {
      key.classList.add('used');
    } 
  })
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
keys.forEach((k) => {
  k.addEventListener('click', (e) => {
    
    // Send letter to current guess row
    if (currentGuess.length < 5 && !(k.dataset.key === 'enter') && !(k.dataset.key === 'del')) {
      currentGuess.push(k.dataset.key)
      showChar();
    } else if (k.dataset.key == 'enter') {
      let validity = true;

      if (validity) {
        // Submit and style currentGuess
        styleKeys();
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

// Keyboard type
document.addEventListener('keyup', (e) => {
  if (currentGuess.length < 5 && validKeys.includes(e.key)) {
    currentGuess.push(e.key)
    showChar();
  } else if (e.key == 'Enter') {
    styleKeys();
    checkGuess();
  } else if (e.key == 'Backspace') {
    currentGuess.pop();
    showChar( );
  }
})
