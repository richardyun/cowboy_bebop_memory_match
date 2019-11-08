

$(document).ready(initiateApp);

///////////////////////////////////////////
////////  CONSTANTS AND VARIABLES  ////////
///////////////////////////////////////////

////  Card Generation  ////
const imageArrays = [
  [
    'assets/images/edward.jpg',
    'assets/images/ein.jpg',
    'assets/images/faye.jpg',
    'assets/images/jet.jpg',
    'assets/images/julia.jpg',
    'assets/images/punch_and_judy.jpg',
    'assets/images/spike.jpg',
    'assets/images/vicious.jpg',
  ], [
    'assets/images/edward.jpg',
    'assets/images/ein.jpg',
    'assets/images/faye.jpg',
    'assets/images/jet.jpg',
    'assets/images/julia.jpg',
    'assets/images/punch_and_judy.jpg',
    'assets/images/spike.jpg',
    'assets/images/vicious.jpg',
  ], [
    'assets/images/edward.jpg',
    'assets/images/ein.jpg',
    'assets/images/faye.jpg',
    'assets/images/jet.jpg',
    'assets/images/julia.jpg',
    'assets/images/punch_and_judy.jpg',
    'assets/images/spike.jpg',
    'assets/images/vicious.jpg',
  ]
];
let shuffledDuplicatedImageArray = [];

////  Game Mechanics  ////
let firstCardClicked = null;
let secondCardClicked = null;
let firstCardClickedImageURL = null;
let secondCardClickedImageURL = null;
let twoCardsClicked = false;

////  Statistics  ////
let cardMatches = null;
let matchAttempts = null;
let gamesPlayed = null;
let accuracy = null;

////  Levels  ////
let difficultyLevel = ['Easy', 'Medium', 'Hard'];
let currentDifficulty = 0;
let highestDifficultyCompleted = 0;

////  Timer  ////
let intervalID = null;

////  Win Condition  ////
const maxCardMatches = imageArrays[currentDifficulty].length;

////  Music  ////
let gameMusic = null;
let isMusicPlaying = false;
const musicArray = [
  'assets/audio/cowboy_bebop_bell_peppers_&_beef_kendall_x_mukashi.mp3',
  'assets/audio/cowboy_bebop_chicken_bone_ost3_blue_CUT.mp3',
  'assets/audio/cowboy_bebop_tank!_op.mp3'
];

/////////////////////////////////////////
////////  INITIATE APP FUNCTION  ////////
/////////////////////////////////////////

function initiateApp() {

  ////  Card Generation  ////
  const duplicatedImageArray = duplicateArray(imageArrays[currentDifficulty]);    // use the duplicateArray function to make doubles of the images (selects images depending on difficulty level)
  shuffledDuplicatedImageArray = shuffleArray(duplicatedImageArray);    // use the shuffleArray function to randomly arrange the newly duplicated images
  createMultipleCardElements();   // use the createMultipleCardElements function to generate card elements using the array of duplicated, shuffled images

  ////  Click Handlers  ////
  $(".scene").on("click", ".card", handleCardClick);    // card
  $(".gameInstructions").click(function() {   // 'INSTRUCTIONS' button
    $(".instructionModal").addClass("showModal");
  })
  $(".closeInstructionModal").click(closeModal);    // game instruction modal's 'CLOSE' button
  $(".startGame").click(closeModal).click(initializeAudio);    // pre-game modal 'PLAY' button
  $(".musicButton").click(toggleAudio);   // play-pause music button
  $(".tryAgain").click(changeMusic);    // 'TRY AGAIN' button after game over modal from timer run-out

  ////  Game Difficulty  ////
  if (currentDifficulty > highestDifficultyCompleted) {   // keeps track of the highest level difficulty played
    highestDifficultyCompleted = currentDifficulty;
  }
  $("#difficultyDegree").text(difficultyLevel[currentDifficulty]);    // label to show the current difficulty level
  if (currentDifficulty === 0) {    // if the current level is 'EASY' then only the 'HELP'/ Instructions should show in the extras section
    $("#extraSectionTitle").text("Help");
    $("#extrasContainer").css({
      "background-color":"lightsteelblue", 
      "color":"black"
    });
    $("#timerText").addClass("hidden");
    $(".gameInstructions").removeClass("hidden");
  } else {    // if the current level is higher than 'EASY' then the timer should show
    $("#extraSectionTitle").text("Timer");
    $(".gameInstructions").addClass("hidden");
    $("#timerText").removeClass("hidden");
    $("#extrasContainer").css({
      "background-color":"black", 
      "color":"lightgreen"
    });
    if (currentDifficulty === 1) {    // if the current level is 'MEDIUM' then the timer should be set to 3 minutes
      $("#timerText").text("03:00");
      startTimer(180, $("#timerText"));
    } else {    // if the current level is 'HARD' then the timer should be set to 1 minute 30 seconds
      $("#timerText").text("01:30");
      startTimer(90, $("#timerText"));
    }
  }
  if (highestDifficultyCompleted < 1) {   // if the highest level completed is 'EASY' then the 'HARD' level button will be locked until 'MEDIUM' is beaten
    $(".levelHard").addClass("lockedLevel");
  } else {
    $(".levelHard").removeClass("lockedLevel");
  }

}

/////////////////////////////////////////////
////////  CARD GENERATION FUNCTIONS  ////////
/////////////////////////////////////////////

////  Array Duplicator  ////
function duplicateArray(someArray) {    // takes an array and duplicates the array's elements so that array now has two of each of its contents
  return someArray.reduce(function(res, current) {
    return res.concat([current, current]);
  }, []);
}

////  Array Shuffler-Randomizer  ////
function shuffleArray(someArray) {    // takes an array and randomly arranges its contents in a different order
  for (let i = someArray.length - 1; i > 0; i--) {
    let k = Math.floor(Math.random() * (i + 1));
    [someArray[i], someArray[k]] = [someArray[k], someArray[i]];
  }
  return someArray;
}

////  Single Card Builder Function  ////
function generateSingleCardElements(imageURL) {   // uses an image to create a card element with a front (animation) and back (image) face
  const cardDivs = $("<div class='card'>")
    .append("<div class='image cardFace' style='background-image: url(assets/images/smiley_edit.png)'>")
    .append("<div class='image cardFaceBackground'>")
    .append("<div class='image cardBack' style='background-image: url(" + imageURL + ")'>");
  const animationScene = $("<div class='scene'>").append(cardDivs);
  $(".cardsContainer").append(animationScene);
}

////  Mass-Card Generator Function  ////
function createMultipleCardElements() {   // utilizes map function to create single card elements for all the images in the shuffled-duplicated image array
  shuffledDuplicatedImageArray.map(imageURL => generateSingleCardElements(imageURL));
}

////////////////////////////////////////////
////////  GAME MECHANICS FUNCTIONS  ////////
////////////////////////////////////////////

////  Clear Card Clicked Variables  ////
function clearCardsClicked() {
  firstCardClicked = null;
  secondCardClicked = null;
}

////  Clear Clicked Cards Image URLs  ////
function clearClickedCardsImageURLs() {
  firstCardClickedImageURL = null;
  secondCardClickedImageURL = null;
}

////  Close Modals  ////
function closeModal() {
  $(".modal").removeClass("showModal");
}

////  Reset Game  ////
function resetGame() {
  resetStats();
  $(".image").removeClass("isFlipped");
  $(".cardsContainer").empty();
  clearInterval(intervalID);
  initiateApp();
}

////  Card Click Handler Function  ////
function handleCardClick(event) {
  if ($(event.currentTarget).hasClass("isFlipped") || twoCardsClicked) {
    return;   // if a card is already flipped or there are two cards already clicked then clicks will be temporarily disabled
  }
  if (firstCardClicked === null) {
    firstCardClicked = $(event.currentTarget).addClass("isFlipped");
    firstCardClickedImageURL = event.currentTarget.children[2].style.backgroundImage;   // image url of the first clicked card
  } else {
    secondCardClicked = $(event.currentTarget).addClass("isFlipped");
    secondCardClickedImageURL = event.currentTarget.children[2].style.backgroundImage;    // image url of the second clicked card
    twoCardsClicked = true;
    if (firstCardClickedImageURL !== secondCardClickedImageURL) {   // actions to take if the two clicked cards don't match
      misMatchedCardsAction();
    } else {    // actions to take if the two clicked cards match
      matchedCardsAction();
    }
  }
  displayStats();   // calculate and show stats
}

////  Actions When Cards Do Not Match  ////
function misMatchedCardsAction() {
  matchAttempts++;
  setTimeout(function() {   // resetting after card mismatch (delay)
    twoCardsClicked = false;
    firstCardClicked.removeClass("isFlipped");
    secondCardClicked.removeClass("isFlipped");
    clearCardsClicked();
    clearClickedCardsImageURLs();
  }, 1500);
}

////  Actions When Cards Match  ////
function matchedCardsAction() {
  twoCardsClicked = false;
  matchAttempts++;
  cardMatches++;
  gameWinConditionCheck();
  clearCardsClicked();
}

////  Check Win Condition  ////
function gameWinConditionCheck() {
  // if (cardMatches === maxCardMatches) {
  if (cardMatches === 1) {
    gamesPlayed++;
    fadeMusic();
    setTimeout(function() {   // show the win modal (delay)
      $(".winModal").addClass("showModal");
      clearInterval(intervalID);    // remove timer (if applicable)
    }, 500);
    postWinLevelSelection();
    closeWinModalAndReset();
  }
}

////  Select Level from Win Modal  ////
function postWinLevelSelection() {
  $(".resetGame").click(function(event) {
    if ($(event.target).hasClass("levelEasy")) {    // set level to 'EASY' and restart game if 'EASY' button is clicked
      currentDifficulty = 0;
      changeMusic();
      resetGame();
    }
    if ($(event.target).hasClass("levelMedium")) {    // set level to 'MEDIUM' and restart game if 'MEDIUM' button is clicked
      currentDifficulty = 1;
      changeMusic();
      resetGame();
    }
    if ($(event.target).hasClass("levelHard")) {    // if 'HARD' button is clicked...
      if ($(".levelHard").hasClass("lockedLevel")) {    // show locked level modal if level 'HARD' is locked
        $(".lockedLevelModal").addClass("showModal");
        setTimeout(function() {   // remove locked level modal after 3.5 seconds
          $(".lockedLevelModal").removeClass("showModal");
        }, 3500);
      } else {
      currentDifficulty = 2;    // if 'HARD' level is not locked restart game and set level to 'HARD'
      changeMusic();
      resetGame();
      }
    }
  });
}

////  Handle Closing Win Modal and Game Reset  ////
function closeWinModalAndReset() {
  $(document).click(function(event) {
    if ($(event.target).hasClass("resetGame")) {
      if (!$(".lockedLevelModal").hasClass("showModal")) {
        closeModal();
        changeMusic();
        resetGame();                
      }
    }
  });
}

////////////////////////////////////////
////////  STATISTICS FUNCTIONS  ////////
////////////////////////////////////////

////  Calculate Card Matching Accuracy  ////
function calculateAccuracy(){
  return Math.round( (cardMatches / matchAttempts) * 100 );
}

////  Display Statistics  ////
function displayStats() {
  accuracy = calculateAccuracy();
  if (gamesPlayed) {
    $("#gameCountNumber").text(gamesPlayed);
  }
  if (matchAttempts) {
    $("#matchAttemptsNumber").text(matchAttempts); 
  } else {
    $("#matchAttemptsNumber").text("0");
  }
  if (!isNaN(accuracy)) {
    $("#matchAccuracyNumber").text( accuracy + "%" );
  } else {
    $("#matchAccuracyNumber").text("0%");
  }
}

////  Reset Statistics  ////
function resetStats() {
  cardMatches = null;
  matchAttempts = null;
  accuracy = null;
  displayStats();
}

//////////////////////////////
////////  GAME TIMER  ////////
//////////////////////////////

function startTimer(duration, display) {
  $("#timerText").removeClass("flash").css("color", "lightgreen");    // set default non-flashing class and text color to lightgreen
  let timer = duration, minutes, seconds;
  intervalID = setInterval(function() {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    if (minutes === 0 && seconds <= 45) {
      $("#timerText").css("color", "#ffff00");    // at 45 seconds set the timer text color to yellow
    }
    if (minutes === 0 && seconds <= 30) {
      $("#timerText").css("color", "#ffa500");    // at 30 seconds set the timer text color to orange
    }
    if (minutes === 0 && seconds <= 20) {
      $("#timerText").css("color", "#ff0000");    // at 20 seconds set the timer text color to red
    }
    if (minutes === 0 && seconds <= 10) {
      $("#timerText").addClass("flash");    // at 10 seconds make the the timer flash between red and white
    }
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.text(minutes + ":" + seconds);
    if (--timer < 0) {    // actions to take if timer runs out
      gamesPlayed++;
      fadeMusic();
      $(".gameOverModal").addClass("showModal");
      clearInterval(intervalID);
    }
  }, 1000);
}

///////////////////////////////////
////////  MUSIC FUNCTIONS  ////////
///////////////////////////////////

////  Starting Game Music Play  ////
function initializeAudio() {
  gameMusic = new Audio('assets/audio/cowboy_bebop_bell_peppers_&_beef_kendall_x_mukashi.mp3');
  gameMusic.loop = true;
  gameMusic.volume = 0.2;
  const playPromise = gameMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      gameMusic.play();
      isMusicPlaying = true;
    }).catch(error => {
      console.log("Audio autoplay prevented.", error);
      isMusicPlaying = false;
    });    
  }
}

////  Changing Level Difficulty Changes Music Track  ////
function changeMusic() {
  if (currentDifficulty === 0) {    // only the 'EASY' level allows looping of the music track
    gameMusic.loop = true;
  } else {
    gameMusic.loop = false;
  }
  let music = musicArray[currentDifficulty];    // utilizes the difficulty level to pick the audio track
  gameMusic.setAttribute('src', music);
  gameMusic.volume = 0.2;
  const playPromise = gameMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      gameMusic.play();
      isMusicPlaying = true;
    }).catch(error => {
      console.log("Audio play prevented.", error);
      isMusicPlaying = false;
    });    
  }
}

////  Pause or Play Music  ////
function toggleAudio() {
  if (isMusicPlaying) {
    gameMusic.pause();
    isMusicPlaying = false;
  } else {
    gameMusic.play();
    isMusicPlaying = true;
  }
}

////  Fade Music Out Upon Game End  ////
function fadeMusic() {
  let vol = 0.20;
  const interval = 100;
  const fadeout = setInterval(
    function() {
      if (vol > 0.02) {
        vol -= 0.02;
        gameMusic.volume = vol;
      } else {
        clearInterval(fadeout);
        gameMusic.pause();
        isMusicPlaying = false;
      }
    }, interval); 
}
