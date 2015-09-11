/**
 * Created by a.deangelis on 19/08/2015.
 */
function generateLetters() {
    var speedFactor = 2 * Math.log(numberOfWordsCompleted + Math.PI / 4);
    for (var i = 0; i < maxNumLetterInField; i++) {
        var letterPos = new Vector2(Math.random() * canvas.width, Math.random() * canvas.height);
        var letterSpeed = new Vector2(Math.random() * speedFactor, Math.random() * speedFactor);
        //if the new spawned letter is close to the player don't generate it
        var acceptedDistanceLetterPlayer = 40;
        var tmpLetter = new Letter('a', letterPos, letterSpeed, 20 + acceptedDistanceLetterPlayer);
        if (areCircleColliding(tmpLetter, player)) {
            i--;
        } else {
            var letter;

            if (i < wordToMatch.length) {
                letter = new Letter(wordToMatch.charAt(i), letterPos, letterSpeed, 20);
            } else if (letters.length < maxNumLetterInField) { //add random letters while there are not enough letters in the field
                letter = new Letter(randomUppercaseChar(), letterPos, letterSpeed, 20);
            } else {
                break;
            }
            console.log("pushing letter " + letter.name);
            letters.push(letter);
        }

    }
    console.log(lettersToString(letters) + " maxnumletters " + maxNumLetterInField);
}

function initPlayer() {
    player = new Player(new Vector2(canvas.width / 2, canvas.height / 2), new Vector2(5, 5), 10);
}


function startGame() {
    console.log("START NEW GAME");
    highscore = localStorage.highscore;
    clearGame();
    if (typeof (highscore) === "undefined") {
        highscore = 0;
    }
    initPlayer();
    gameLoop();
}
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (isMainScreen && !isGameOver && !isGameScreen) {
        updatePlayer(); // I like to move the player in the main screen
        if (enterPressed || screenTouched) {
            isGameOver = false;
            isMainScreen = false;
            isGameScreen = true;
            descriptionTextPos = 0;
            generateNewWord(3); // it is here to avoid collision of the letters with the player when it is moved
        }
    } else if (!isGameOver && isGameScreen) {
        updatePlayer();
        updateLetters();
        checkGameover();
    } else {
        if ((enterPressed || screenTouched) && !isGameScreen) {
            isGameOver = false;
            isMainScreen = true;
            isGameScreen = false;
            descriptionTextPos = 0;
            clearGame();
            clearView();
            location.reload(); //TODO: do it better
        }
    }
}

function clearGame() {
    letters = [];
    lettersColletedByPlayer = [];
    totalScore = 0;
    lastCollectedLetter = null;
    wordToMatch = '';
    numberOfWordsCompleted = 0;
    player = initPlayer();
}

function lettersToString(lettersArray) {
    var res = "";
    for (var i = 0; i < lettersArray.length; i++) {
        res += lettersArray[i].name;
    }
    return res;
}


function checkGameover() {
    if (lastCollectedLetter !== null) {
        var indexToCheck = lettersColletedByPlayer.length;
        var playerCollectedCorrectLetter = lastCollectedLetter.name === wordToMatch.charAt(indexToCheck - 1);
        var playerCollectedTooLetters = indexToCheck > wordToMatch.length;
        console.log("wordtomatch " + wordToMatch.toString() + " letterscollectedbyplaer " + lettersToString(lettersColletedByPlayer));
        if (!playerCollectedTooLetters && playerCollectedCorrectLetter) {
            totalScore++;
            console.log("correctly collected " + lastCollectedLetter.name);
            if (wordToMatch.length === lettersColletedByPlayer.length) {
                numberOfWordsCompleted++;
                var newLen = (numberOfWordsCompleted % maxNumLetterInField) + 3;
                generateNewWord(newLen);
            }
            //music
            //var collisionSoundURL = jsfxr([0, , 0.2317, , 0.4106, 0.2058, , 0.142, , , , , , 0.2282, , , , , 1, , , , , 0.5]);
            var collisionSoundURL = jsfxr([0, , 0.3329, , 0.1743, 0.4561, , 0.2364, , , , , , 0.3579, , , , , 1, , , , , 0.5]);
            var collisionAudio = new Audio();
            collisionAudio.src = collisionSoundURL;
            collisionAudio.play();
        } else {
            console.log("GAMEOVER wrong letter " + lastCollectedLetter.name + " while expecting " + wordToMatch.charAt(indexToCheck - 1));
            isGameOver = true;
            isGameScreen = false;
            if (totalScore > highscore) {
                localStorage.highscore = totalScore;
                highscore = totalScore;
            }
            //music
            var collisionAudio = new Audio();
            var wrongCollisionSoundURL = jsfxr([2, 0.0001, 0.5442, 0.2463, 0.9633, 0.5364, , -0.1436, -0.1128, 0.5597, -0.1804, -0.5688, -0.3256, , 0.386, -0.8779, -0.2851, -0.0715, 0.449, 0.2076, 0.7912, 0.8487, -0.7268, 0.5]);
            collisionAudio.src = wrongCollisionSoundURL;
            collisionAudio.play();
        }
        lastCollectedLetter = null;
    }
}

function generateNewWord(len) {
    lettersColletedByPlayer = [];
    wordToMatch = randomString(len);
    player.radius = player.radius + 1.5;
    generateLetters();
}

function randomString(len) {
    var rString = "";
    for (var i = 0; i < len; i++) {
        rString += randomUppercaseChar();
    }
    return rString;
}

function randomUppercaseChar() {
    var ascii = Math.floor((Math.random() * 26) + 65); //random char from 65 (A) to 90 (Z)
    return String.fromCharCode(ascii);
}
function updatePlayer() {
    if (leftPressed && player.pos.x - player.speed.x - player.radius > 0) {
        player.pos.x -= player.speed.x;
    }
    if (rightPressed && player.pos.x + player.speed.x + player.radius < canvas.width) {
        player.pos.x += player.speed.x;
    }
    if (upPressed && player.pos.y - player.speed.y - player.radius > 0) {
        player.pos.y -= player.speed.y;
    }
    if (downPressed && player.pos.y + player.speed.y + player.radius < canvas.height) {
        player.pos.y += player.speed.y;
    }
    if (angleBetweenPlayerAndTouch) {
            player.pos.x += player.speed.x * Math.cos(angleBetweenPlayerAndTouch);
            player.pos.y += player.speed.y * Math.sin(angleBetweenPlayerAndTouch);
    }
}


function areCircleColliding(thisCircle, otherCircle) {
    var collision = false;
    var dx = thisCircle.pos.x - otherCircle.pos.x;
    var dy = thisCircle.pos.y - otherCircle.pos.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < thisCircle.radius + otherCircle.radius) {
        collision = true;
    }
    return collision;
}

function updateLetters() {
    for (var i = 0; i < letters.length; i++) {
        var letter = letters[i];
        //collision with walls
        if (letter.pos.x < 0 || letter.pos.x > canvas.width) {
            letter.speed.x *= -1;
        }
        if (letter.pos.y < 0 || letter.pos.y > canvas.height) {
            letter.speed.y *= -1;
        }

        //collision with other letters
        for (var j = 0; j < letters.length; j++) {
            if (i != j) {
                var otherLetter = letters[j];
                if (areCircleColliding(letter, otherLetter)) {
                    letter.speed.x *= -1;
                    otherLetter.speed.x *= -1;
                    letter.speed.y *= -1;
                    otherLetter.speed.y *= -1;
                }
            }
        }
        //collision with player
        if (areCircleColliding(letter, player)) {
            letter.collidedWithPlayer = true;
        }
        letter.pos.x += letter.speed.x;
        letter.pos.y += letter.speed.y;

    }
    var tmpLetters = [];
    for (var i = 0; i < letters.length; i++) {
        var letter = letters[i];
        if (letter.collidedWithPlayer) {
            lettersColletedByPlayer.push(letter);
            lastCollectedLetter = letter;
        } else {
            tmpLetters.push(letter);
        }
    }
    letters = tmpLetters;
}
