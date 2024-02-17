const game = document.querySelector('#game');
const guessRows = document.querySelectorAll('.guess.row');
const guessBoxes = document.querySelectorAll('.guess.row .char');
const keys = document.querySelectorAll('.key');

const notif = document.querySelector('#notif');
const notifImage = document.querySelector('#notif img');
const notifMessage = document.querySelector('#notif .notif-message');
const notifButton = document.querySelector('#notif .notif-button');

// Hide everything, wait until loaded
let domReady = (cb) => {
  document.readyState === 'interactive' || document.readyState === 'complete'
    ? cb()
    : document.addEventListener('DOMContentLoaded', cb);
};

domReady(() => {
  // Display body when DOM is loaded
  document.body.classList.remove('hide');
});

// Load data from locatStorage, split string to convert into array
let rawAns = localStorage.getItem('anskey');
let rawValid = localStorage.getItem('validwords');

let answerKey = [];
let validWords = [];

if (rawAns != null || rawAns != null) {
  answerKey = rawAns.split(',');
  validWords = rawValid.split(',');
  console.log('Storage exists!');
} else {
  loadData();
}

// Fetch data if localStorage empty
function loadData() {

  // fetch answers.json
  async function fetchAns() {
    const response = await fetch('./answers.json');
    const data = await response.json();
    return data;
  }

  fetchAns().then((value) => {
    answerKey = localStorage.setItem('anskey', value);
    console.log('Answers loaded from localstorage.')
  })

  // fetch valid-words.json
  async function fetchValid() {
    const response = await fetch('./valid-words.json');
    const data = await response.json();
    return data;
  }

  fetchValid().then((value) => {
    validWords = localStorage.setItem('validwords', value);
    console.log('Valid words loaded from localstorage.')
  })

}

// Today's hidden word
let startDate = new Date('2024-02-17');
let currentDate = Date.now();

let dayNumber = Math.floor((currentDate - startDate) / (365 * 24 * 60 * 60));
let answer = answerKey[dayNumber];
let answerArray = answer.split("");

// Validate guess submitted
function validateGuess(guess) {
  return validWords.includes(guess);
}

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
// List of submitted guesses
let allGuesses = [];
// List of submitted characters
let allKeys = [];
// List of keys used
let usedKeys = [];
// Changes when successfully solved
let success = false;
// Locks game when done today
let doneToday = false;


// Check if today's game done
let rawAllGuesses = localStorage.getItem('allguesses');

if (rawAllGuesses != null) {
  allGuesses = rawAllGuesses.split(',');
}

if (allGuesses.length === 0) {
  resetBoard();
  startGame();
} else if (allGuesses[allGuesses.length - 1] === answer) {
  allGuesses.forEach((stored, i) => {
    currentGuessRow = i;
    currentGuess = stored.split('');
    showChar();
    checkGuess();
    styleCurrentRow();
    styleKeys();
  });
  notifCentre('success');
  console.log('Puzzle already guessed. Come back tomorrow.')  
}



// Print each letter iput
function showChar() {
  const boxes = guessRows[currentGuessRow].querySelectorAll('.char');
  boxes.forEach ((box, i) => {
    box.textContent = currentGuess[i];
  })
}

// Style current row
function styleCurrentRow() {
  guessRows.forEach((row, i) => {
    if (currentGuessRow == i) {
      row.classList.remove('current');
      row.classList.add('current');
    } else row.classList.remove('current');
    return true;
  })
}

// Style used keys based on currentguess array
function styleKeys() {
  //// Go through currentGuess array
  currentGuess.forEach((char) => {
    if (!(usedKeys.includes(char))) {
      usedKeys.push(char);
      };
  });

  //// Actual styling
  keys.forEach((key) => {
    if (usedKeys.includes(key.dataset.key)) {
      key.classList.add('used');
    };
    if (answerArray.includes(key.dataset.key)) {
      key.classList.add('correct');
    };
  });
};

// Reset all game counters
function resetBoard() {

  currentGuessRow = 0;
  currentGuess = [];
  allGuesses = [];
  allKeys = [];
  usedKeys = [];
  correctKeys = [];

  guessBoxes.forEach((box) => {
    box.classList.remove('correct');
    box.classList.remove('wrong');
    box.classList.remove('position');
    box.textContent = "";
  })

  keys.forEach((key) => {
    key.classList.remove('used');
  })

  //// Hard refresh
  // location.reload();

  //// reset styles
  styleCurrentRow();
  styleKeys();
  showChar();

}

// Handle notifs
function notifCentre(message) {

  if (message == 'success') {
    notif.classList.remove('hide');
    localStorage.setItem('allguesses', allGuesses);
    notifImage.src = './winner.png';
    notifButton.classList.add('hide');
    notifMessage.innerHTML = "You guessed today's word in " + ((currentGuessRow + 1) + ((currentGuessRow > 0) ? " tries!" : " try!") + " Come back tomorrow." );
    console.log('success')
  } else if (message == 'fail') {
    notifMessage.textContent = "Sorry, you have no more tries left! Come back tomorrow.";
    notifButton.addEventListener('click', () => {
      notif.classList.add('hide');
      return false;
    })
    notif.classList.remove('hide');
  } else if (message == 'invalid') {
    notifImage.src = './wrong.png';
    notifMessage.textContent = "Invalid word is not in the dictionary!";
    notifButton.addEventListener('click', () => {
      notif.classList.add('hide');
      return;
    })
    notif.classList.remove('hide');
  }
}

// Check submitted guess
function checkGuess(answer) {
  //// Counter for number of correct letters
  let correctGuesses = 0;
  
  const answeredBoxes = guessRows[currentGuessRow].querySelectorAll('.char');
  
  answerArray.forEach((ans, j) => {

    ////// Check if letter is included in the answer
    if (answerArray.includes(answeredBoxes[j].textContent)) {
      answeredBoxes[j].classList.add('position');
    }
    
    ////// Check if letter matches to answer
    if (ans == answeredBoxes[j].textContent) {
      answeredBoxes[j].classList.add('correct');
      correctGuesses++;
    } else if (ans != answeredBoxes[j].textContent) {
      answeredBoxes[j].classList.add('wrong');
    } 
  })

  // Check if all 5 letters are correct
  if (correctGuesses == 5) {
    //// SUCCESS - show success notification
    notifCentre('success');
  } else {
    //// Not all letter are correct, move to next row
    currentGuessRow++;
    //// Highlight next row
    styleCurrentRow();
    //// Empty your guess array
    currentGuess.length = 0;
  }

  // Check if currentGuessRow is 6 (game over)
  if (currentGuessRow >= 6) {
    //// FAIL
    notifCentre('fail');
  }

} // checkGuess() //

//
//
//
// GAME START
function startGame() {

  styleCurrentRow();
  styleKeys();
  showChar();

  console.log(answer)

  //// ARM on-screen keyboard
  keys.forEach((k) => {
    k.addEventListener('click', (e) => {

      ////// Close notification by clicking any button
      notif.classList.add('hide');
      
      ////// Send letter to current guess row
      if (currentGuess.length < 5 && !(k.dataset.key === 'enter') && !(k.dataset.key === 'del')) {
        currentGuess.push(k.dataset.key)
        showChar();
      } else if (k.dataset.key == 'enter') {
        let guessString = currentGuess.join("");

        ////// Check if word is valid
        if (validateGuess(guessString)) {
          //////// Submit and style currentGuess
          styleKeys();
          allGuesses.push(guessString);
          checkGuess(answer); 
        } else {
          notifCentre('invalid');
        }
      } else if (k.dataset.key == 'del') {
        ////// Check if row has letters to delete
        ////// Pop last letter
        currentGuess.pop();
        showChar();
      }
  
    });
  });
  
  //// ARM physical keyboard
  document.addEventListener('keyup', (e) => {

    ////// Close notification by clicking any button
    notif.classList.add('hide');

    ////// Only accept letters, del and enter keys
    if (currentGuess.length < 5 && validKeys.includes(e.key)) {
      currentGuess.push(e.key)
      showChar();
    } else if (e.key == 'Enter') {
      let guessString = currentGuess.join("");

      ////// Check if word is valid
      if (validateGuess(guessString)) {
        styleKeys();
        allGuesses.push(guessString);
        checkGuess(answer); 
      } else {
        notifCentre('invalid');
      }
    } else if (e.key == 'Backspace') {
      currentGuess.pop();
      showChar( );
    }
  });

}; // startGame() //