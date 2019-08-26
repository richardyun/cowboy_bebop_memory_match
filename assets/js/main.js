$(document).ready(initiateApp);

const imageArray = [
  'assets/images/annie.jpg',
  'assets/images/edward.jpg',
  'assets/images/ein.jpg',
  'assets/images/faye.jpg',
  'assets/images/jet.jpg',
  'assets/images/julia.jpg',
  'assets/images/punch_and_judy.jpg',
  'assets/images/spike.jpg',
  'assets/images/vicious.jpg',
];
let duplicatedImageArray = [];
let shuffledDuplicatedImageArray = [];

function initiateApp() {
  duplicatedImageArray = duplicateArray(imageArray);
  shuffledDuplicatedImageArray = shuffleArray(duplicatedImageArray);
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

function generateSingleCardElements() {
  
}