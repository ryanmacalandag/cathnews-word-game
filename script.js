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
  console.log(guessRows[currentGuessRow]);
  boxes.forEach ((box, i) => {
    box.textContent = currentGuess[i];
  })
}

function checkGuess() {
  let correctGuesses = 0;
  const answeredBoxes = guessRows[currentGuessRow].querySelectorAll('.char');

  answerArray.forEach((ans, j) => {
    // Test each guess box against answer array
    if (ans == answeredBoxes[j].textContent) {
      answeredBoxes[j].classList.add('correct');
      correctGuesses++;
    } else if (ans != answeredBoxes[j].textContent) {
      answeredBoxes[j].classList.add('wrong');
    }
  })

  // If all correct
  if (correctGuesses == 5) {
    notif.textContent = "You guessed the word in " + (currentGuessRow + 1) + ((currentGuessRow > 0) ? " tries!" : " try!" );
    notif.classList.toggle('hide');
    return;
  } else {
    currentGuessRow++;
    // Empty your guess array
    currentGuess.length = 0;
    console.log(currentGuessRow);
    return;
  }

}

// Capture keyboard clicks
const keys = document.querySelectorAll('.key');
keys.forEach((k) => {
  k.addEventListener('click', () => {
    
    // Send letter to current guess row
    if (currentGuess.length < 5 && !(k.dataset.key === 'enter') && !(k.dataset.key === 'del')) {
      currentGuess.push(k.dataset.key)
      showChar();
    } else if (k.dataset.key == 'enter') {
      // Submit currentGuess
      allGuesses.push(currentGuess);
      console.log(allGuesses)
      checkGuess();
    } else if (k.dataset.key == 'del') {
      // Check if row has letters to delete
      // Pop last letter
      currentGuess.pop();
      showChar();
    }

  });
});
