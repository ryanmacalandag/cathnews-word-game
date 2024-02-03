const game = document.querySelector('#game');
const guessRows = document.querySelectorAll('.guess.row');
const guessBoxes = document.querySelectorAll('.guess.row .char');
const keys = document.querySelectorAll('.key');

const notif = document.querySelector('#notif');
const notifMessage = document.querySelector('#notif .notif-message');
const notifButton = document.querySelector('#notif .notif-button');

// Sample answer word
const tempAnswers = ['antes', 'treat', 'smart', 'valve', 'stick', 'yearn', 'tardy', 'chasm', 'discs', 'gnaws', 'leave', 'spite', 'chalk', 'valve', 'whole', 'Zumic', 'heart', 'creep', 'donor', 'siker', 'civil', 'clift', 'gamma', 'flamy', 'curve', 'palmy', 'weigh', 'cramp', 'inkle', 'skeet', 'crock', 'slate', 'twirl' ];
const random_item = (items) => items[Math.floor(Math.random() * items.length)];
let answer = random_item(tempAnswers);
console.log(answer);
const answerArray = answer.split("");

// Valid keys
const validKeys = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
'm', 'n', 'o', 'p', 'q', 'r',  's', 't', 'u', 'v', 'w', 'x',
'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ]

// Counters 
let currentGuessRow = 0;

// Submitted word
let currentGuess = [];

// List of submitted words
let allGuesses = [];

// List of keys used
let usedKeys = [];

// Print letter on current guess row
function showChar() {
  const boxes = guessRows[currentGuessRow].querySelectorAll('.char');
  boxes.forEach ((box, i) => {
    box.textContent = currentGuess[i];
  })
}

// Reset all game counters
function resetGame() {
  console.log('hey')
  currentGuessRow = 0;
  currentGuess = [];
  allGuesses = [];
  usedKeys = [];

  guessBoxes.forEach((box) => {
    box.classList.remove('correct');
    box.classList.remove('wrong');
    box.classList.remove('position');
    box.textContent = "";
  })

  keys.forEach((key) => {
    key.classList.remove('used');
  })

  location.reload();

  showChar();
  styleKeys();
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

// Handle notifs
function notifCentre(message) {
  if (message == 'success') {
    notifMessage.textContent = "You guessed the word in " + (currentGuessRow + 1) + ((currentGuessRow > 0) ? " tries!" : " try!" );
    notifButton.textContent = 'Play again';
    notifButton.addEventListener('click', () => {
      notif.classList.add('hide');
      resetGame();
    })
    notif.classList.remove('hide');
  }
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
    notifCentre('success');
  } else {
    // Not all letter are correct, move to next row
    currentGuessRow++;
    // Empty your guess array
    currentGuess.length = 0;
  }

} //checkguess

// Capture on-screen keyboard
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
