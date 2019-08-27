$(document).ready(initiateApp);

const imageArray = [
  'assets/images/edward.jpg',
  'assets/images/ein.jpg',
  'assets/images/faye.jpg',
  'assets/images/jet.jpg',
  'assets/images/julia.jpg',
  'assets/images/punch_and_judy.jpg',
  'assets/images/spike.jpg',
  'assets/images/vicious.jpg',
];
let shuffledDuplicatedImageArray = [];
let firstCardClicked = null;
let secondCardClicked = null;
let firstCardClickedImageURL = null;
let secondCardClickedImageURL = null;
let twoCardsClicked = false;

function initiateApp() {
  const duplicatedImageArray = duplicateArray(imageArray);
  shuffledDuplicatedImageArray = shuffleArray(duplicatedImageArray);
  createMultipleCardElements();
  $(".card").on("click", ".cardFace", handleCardClick);
}

function duplicateArray(someArray) {
  return someArray.reduce(function(res, current, index, array) {
    return res.concat([current, current]);
  }, []);
}

function shuffleArray(someArray) {
  for (let i = someArray.length - 1; i > 0; i--) {
    let k = Math.floor(Math.random() * (i + 1));
    [someArray[i], someArray[k]] = [someArray[k], someArray[i]];
  }
  return someArray;
}

function generateSingleCardElements(imageURL) {
  const cardDivs = $("<div class='card'>")
    .append("<div class='image cardFace'>")
    .append("<div class='image cardBack' style='background-image: url(" + imageURL + ")'>");
  $(".cardsContainer").append(cardDivs);
}

function createMultipleCardElements() {
  shuffledDuplicatedImageArray.map(imageURL => generateSingleCardElements(imageURL));
}

function handleCardClick(event) {
  if (twoCardsClicked) {
    return;
  }
  if (firstCardClicked === null) {
    firstCardClicked = $(event.currentTarget).addClass("hidden");
    firstCardClickedImageURL = firstCardClicked.next().css("background-image");
  } else {
    secondCardClicked = $(event.currentTarget).addClass("hidden");
    secondCardClickedImageURL = secondCardClicked.next().css("background-image");
    twoCardsClicked = true;
    if (firstCardClickedImageURL !== secondCardClickedImageURL) {
      setTimeout(function() {
        twoCardsClicked = false;
        firstCardClicked.removeClass("hidden");
        secondCardClicked.removeClass("hidden");
        firstCardClicked = null;
        secondCardClicked = null;
        firstCardClickedImageURL = null;
        secondCardClickedImageURL = null;
      }, 1500);
    } else {
      twoCardsClicked = false;
      firstCardClicked = null;
      secondCardClicked = null;
    }
  }
}