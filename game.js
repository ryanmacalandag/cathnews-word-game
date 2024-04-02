const game = document.querySelector('#game');
const guessRows = document.querySelectorAll('.guess.row');
const guessBoxes = document.querySelectorAll('.guess.row .char');
const keys = document.querySelectorAll('.key');

const notif = document.querySelector('#notif');
const notifImage = document.querySelector('#notif img');
const notifMessage = document.querySelector('#notif .notif-message');
const notifButton = document.querySelector('#notif .notif-button');

// Valid keys
const validKeys = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
'm', 'n', 'o', 'p', 'q', 'r',  's', 't', 'u', 'v', 'w', 'x',
'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
'M', 'N', 'O', 'P', 'Q', 'R',  'S', 'T', 'U', 'V', 'W', 'X',
'Y', 'Z' ]

// Clear old data!!!
// validkeys is an old storage variable
if (localStorage.getItem('validkeys') || localStorage.getItem('version') !== '0.07') {
  localStorage.clear();
  console.log('Old storage cleared!');
}

// Set version to allow clearing of previous localStorage data
// v0.02 - allguesses, answer, donetoday, success, version, previousgamedate
// v0.06 - updated logic, clear stored guesses
// v0.07 - updated answerkey
localStorage.setItem('version', '0.07');

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

// Share button
const shareFB = document.querySelector('#share-fb');

const thisURL = window.location.href;
const FBlink = "https://www.facebook.com/share.php?u=" + encodeURIComponent(thisURL);

shareFB.addEventListener('click', (e) => {
  window.open(FBlink);
})

let answerKey = [];
let validWords = [];

// Dates
let _STARTDATE = new Date('2024-04-03T00:00:00'); //1995-12-17T03:24:00
let currentDate = Date.now();

// Set previous game date
let previousGameDate = localStorage.getItem('previousgamedate') || currentDate;
let previousGameNumber = Math.floor((previousGameDate - _STARTDATE) / (24 * 60 * 60 * 1000));

// Today's hidden word
let currentDayNumber = Math.floor((currentDate - _STARTDATE) / (24 * 60 * 60 * 1000));
let answer = localStorage.getItem('answer') || "";
let answerArray = answer.split('');

// Load answer key and valid words from json files

function loadData() {

  // fetch answers.json
  async function fetchAns() {
    const response = await fetch('./answers.json');
    const data = await response.json();
    return data;
  }

  fetchAns().then((value) => {
    answerKey = value;
    // console.log('Answer key loaded!');

    // set today's hidden word
    let answerToday = answerKey[currentDayNumber];
    localStorage.setItem('answer', answerToday);
    answer = answerToday;
    answerArray = answerToday.split('');

    console.log('Answer from storage:', answer)
  })

  // fetch valid-words.json
  async function fetchValid() {
    const response = await fetch('./valid-words.json');
    const data = await response.json();

    console.log('Answer from fetched JSON:', answer)

    return data;
  }

  fetchValid().then((value) => {
    validWords = value;
    // console.log('Valid words loaded!')
  })

}
loadData();


// Counters 
let rawAllGuesses = localStorage.getItem('allguesses') || [];
let allGuesses = (rawAllGuesses.length > 0) ? rawAllGuesses.split(',') : [];
let usedKeys = localStorage.getItem('usedkeys') || [];
let success = localStorage.getItem('success') || 'false';
let doneToday = localStorage.getItem('donetoday') || 'false';

let currentGuessRow = rawAllGuesses.length;
let currentGuess = rawAllGuesses[-1] || [];

// Check if today's game done
function checkToday() {

  if (currentDayNumber > previousGameNumber || allGuesses.length === 0) { // different day, reset game, reset previous guesses
    console.log('Start fresh today!')
    // Set previousgamedate to today
    localStorage.setItem('previousgamedate', currentDate)
    
    // Clear rawAllGuesses allguesses
    let rawAllGuesses = []
    localStorage.setItem('allguesses', rawAllGuesses)
    resetBoard();
    startGame();
    return;
  } else if (currentDayNumber === previousGameNumber && allGuesses.length > 0 && doneToday == 'false') { // same day, continuance, load game
    allGuesses.forEach((stored, i) => {
      currentGuessRow = i;
      currentGuess = stored.split('');
      showChar();
      checkGuess(stored);
      styleCurrentRow();
      styleKeys();
    });
    startGame();
    console.log('Not quite finished yet. Continue playing!');
    return;
  } else if (currentDayNumber === previousGameNumber && doneToday == 'true' && success == 'false') { // same day, game done, failed
    allGuesses.forEach((stored, i) => {
      currentGuessRow = i;
      currentGuess = stored.split('');
      showChar();
      checkGuess(stored);
      styleCurrentRow();
      styleKeys();
    });
    notifCentre('fail');
    console.log('No more tries left! Try again tomorrow.')
    return;
  } else if (currentDayNumber === previousGameNumber && doneToday == 'true' && success == 'true') { // same day, game done, success
    allGuesses.forEach((stored, i) => {
      currentGuessRow = i;
      currentGuess = stored.split('');
      showChar();
      checkGuess(stored);
      styleCurrentRow();
      styleKeys();
    });
    notifCentre('success');
    console.log('Puzzle already guessed. Come back tomorrow.')  
    return;
  } else "Something's wrong.";
}
checkToday();


console.log('Submitted today:', allGuesses)



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
  usedKeys = [];
  correctKeys = [];

  // set localstorage to default
  allGuesses = [];
  localStorage.setItem('allguesses', allGuesses);
  success = 'false';
  localStorage.setItem('success', success);
  doneToday = 'false';
  localStorage.setItem('donetoday', doneToday);

  guessBoxes.forEach((box) => {
    box.classList.remove('correct');
    box.classList.remove('wrong');
    box.classList.remove('position');
    box.textContent = "";
  })

  keys.forEach((key) => {
    key.classList.remove('used');
  })

  //// reset styles
  styleCurrentRow();
  styleKeys();
  showChar();

}

// Validate guess submitted
function validateGuess(guess) {
  return validWords.includes(guess);
}


// Handle notifs
function notifCentre(message) {

  if (message == 'success') {
    notif.classList.remove('hide');
    notifImage.src = './winner1.png';
    notifButton.classList.add('hide');
    shareFB.classList.remove('hide');
    notifMessage.innerHTML = "Congrats! You guessed today's Bible word in " + ((currentGuessRow + 1) + ((currentGuessRow > 0) ? " tries!" : " try!") + " Come back tomorrow." );
  } else if (message == 'fail') {
    shareFB.classList.add('hide');
    notifImage.src = './wrong1.png';
    notifMessage.textContent = "Sorry, you have no more tries left! Come back tomorrow.";

    notifButton.addEventListener('click', () => {
      notif.classList.add('hide');
      return false;
    })
    notif.classList.remove('hide');
  } else if (message == 'invalid') {
    notifImage.src = './wrong1.png';
    notifMessage.textContent = "Invalid word is not in the dictionary!";
    notifButton.addEventListener('click', () => {
      notif.classList.add('hide');
      return;
    })
    notif.classList.remove('hide');
  }
}

// Check submitted guess
function checkGuess() {
  
  //// Counter for number of correct letters
  let correctChars = 0;
  
  const answeredBoxes = guessRows[currentGuessRow].querySelectorAll('.char');

  answerArray.forEach((char, j) => {

    ////// Check if letter is included in the answer
    if (answerArray.includes(answeredBoxes[j].textContent)) {
      answeredBoxes[j].classList.add('position');
    }
    
    ////// Check if letter matches to answer
    if (char == answeredBoxes[j].textContent) {
      answeredBoxes[j].classList.add('correct');
      correctChars++;
    } else if (char != answeredBoxes[j].textContent) {
      answeredBoxes[j].classList.add('wrong');
    } 
  })

  // Check if all 5 letters are correct
  if (correctChars === 5) {
    //// SUCCESS - show success notification
    success = 'true';
    localStorage.setItem('success', success);
    doneToday = 'true';
    localStorage.setItem('donetoday', doneToday);
    notifCentre('success');
    return;
  } else {
    //// Not all letter are correct, move to next row
    if(currentGuessRow < 6) {
      currentGuessRow++;
    }
    //// Highlight next row
    styleCurrentRow();
    //// Empty your guess array
    currentGuess.length = 0;
  }

  // Check if currentGuessRow is 6 (game over)
  if (currentGuessRow >= 6) {
    //// FAIL
    success = 'false';
    localStorage.setItem('success', success);
    doneToday = 'true';
    localStorage.setItem('donetoday', doneToday);
    notifCentre('fail');
    return;
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
          localStorage.setItem('allguesses', allGuesses);
          checkGuess(); 
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
        localStorage.setItem('allguesses', allGuesses);
        checkGuess(); 
      } else {
        notifCentre('invalid');
      }
    } else if (e.key == 'Backspace') {
      currentGuess.pop();
      showChar();
    }
  });

}; // startGame() //