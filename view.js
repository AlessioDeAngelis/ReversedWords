/**
 * Created by a.deangelis on 19/08/2015.
 */
function drawLetters() {
    for (var i = 0; i < letters.length; i++) {
        var letter = letters[i];
        ctx.beginPath();
        ctx.arc(letter.pos.x, letter.pos.y, letter.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = letterColor;
        ctx.fill();
        //ctx.strokeStyle = "black";
        //ctx.stroke();
        ctx.closePath();
        ctx.save();
        ctx.font = "900 40px Arial";
        ctx.fillStyle = "#eee";
        ctx.fillText(letter.name, letter.pos.x - (letter.radius / 2), letter.pos.y + (letter.radius / 2), letter.radius);
        ctx.strokeStyle = "black";
        //ctx.strokeText(letter.name, letter.pos.x - (letter.radius / 2), letter.pos.y + (letter.radius / 2), letter.radius);
        ctx.restore();
    }
}

function clearView() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    externalContext.clearRect(0, 0, externalCanvas.width, externalCanvas.height);
}

function draw() {
    clearView();
    if (isGameOver) {
        drawGameOverScene();
    } else if (isGameScreen) {
        drawGameScene();
    } else if (isMainScreen) {
        drawMainScreen();
    }

}

function drawGameScene() {
    drawLetters();
    drawPlayer();
    drawWordToMatch();
}

function drawMainScreen() {

    externalContext.save();
    externalContext.font = "900 40px Arial";

    externalContext.fillStyle = "#eee";

    externalContext.fillText("REVERSED", externalCanvas.width / 5, externalCanvas.height / 2 + externalCanvas.height / 15, externalCanvas.width / 2);
    externalContext.strokeStyle = "black";
    externalContext.restore();

    externalContext.save();
    externalContext.font = "900 40px Arial";
    externalContext.fillStyle = "#eee";
    externalContext.translate(externalCanvas.width, externalCanvas.height);
    externalContext.scale(-1, -1);
    externalContext.fillText("WORDS", externalCanvas.width / 5, externalCanvas.height / 2, externalCanvas.width / 2);
    externalContext.strokeStyle = "black";
    externalContext.restore();


    ctx.font = "900 40px Arial";
    ctx.fillStyle = "black";
    var descriptionText = "USE THE ARROWS OR ASWD TO MOVE OUR HERO. COLLECT THE LETTERS IN THE CORRECT ORDER TO FORM THE WORD. WHICH IS THE CORRECT LETTER ORDER? REVERSED, OF COURSE! :D WELCOME IN REVERSED WORDS!!!";
    ctx.fillText(descriptionText, canvas.width - descriptionTextPos, canvas.height / 2 - canvas.height / 8);
    ctx.font = "900 24px Arial";
    ctx.fillStyle = "black";
    var readyText = "ARE YOU READY? PRESS ENTER TO PLAY!!!";
    ctx.fillText(readyText, (canvas.width - ctx.measureText(readyText).width) /2, canvas.height / 2 + canvas.height / 8, canvas.width);
    drawPlayer();
    descriptionTextPos += 2;

    if (descriptionTextPos > canvas.width + 1.5 * ctx.measureText(descriptionText).width) {
        descriptionTextPos = 0;
    }
}

function drawGameOverScene() {
    externalContext.font = "900 40px Arial";
    externalContext.fillStyle = "#eee";
    var gameOverText = "GAME OVER";
    externalContext.fillText(gameOverText, (externalCanvas.width - externalContext.measureText(gameOverText).width) /2, externalCanvas.height / 2 + externalCanvas.height / 5, externalCanvas.width / 2);
    externalContext.strokeStyle = "black";
    var pressEnterText = "PRESS ENTER TO PLAY AGAIN!";
    ctx.font = "900 40px Arial";
    ctx.fillStyle = "black";
    var scoreText = "YOUR SCORE IS: " + totalScore;
    ctx.fillText(scoreText, (canvas.width - ctx.measureText(scoreText).width) / 2, canvas.height / 2 - canvas.height / 8, canvas.width);
    ctx.fillStyle = letterColor;
    var highScoreText = "HIGHSCORE IS: " + highscore;
    ctx.fillText(highScoreText, (canvas.width - ctx.measureText(highScoreText).width) / 2, canvas.height / 2 + canvas.height / 8, canvas.width);
    ctx.strokeStyle = "black";
    ctx.font = "900 24px Arial";
    ctx.fillText(pressEnterText, descriptionTextPos, canvas.height / 2 + canvas.height / 4 + canvas.height / 16, canvas.width);
    ctx.strokeStyle = "black";

    if (descriptionTextPos < 0 && textGoToLeft) {
        textGoToLeft = false;
    } else if (descriptionTextPos > (canvas.width - ctx.measureText(pressEnterText).width) && !textGoToLeft) {
        textGoToLeft = true;
    }

    if (textGoToLeft) {
        descriptionTextPos -= 3;
    } else {
        descriptionTextPos += 3;
    }
}


function drawPlayer() {
    ctx.beginPath();
    //ctx.rect(player.pos.x, player.pos.y, player.radius, player.radius);
    ctx.arc(player.pos.x, player.pos.y, player.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = playerColor;
    ctx.fill();
    ctx.closePath();
}

function drawWordToMatch() {
    externalContext.save();
    externalContext.font = "900 40px Arial";
    externalContext.fillStyle = "black";
    externalContext.translate(externalCanvas.width / 2, externalCanvas.height / 2);
    externalContext.scale(-1, -1);

    externalContext.fillText(wordToMatch, 0, 0);
    if (lettersColletedByPlayer.length > 0) {
        externalContext.fillStyle = "#eee";
        externalContext.fillText(lettersToString(lettersColletedByPlayer), 0, 0);
    }
    externalContext.restore();
    externalContext.save();
    externalContext.font = "900 40px Arial";
    externalContext.fillStyle = backgroundColor;
    externalContext.fillText(totalScore, 3 * externalCanvas.width / 4, externalCanvas.height / 2);
    //ctx.strokeStyle = "black";
    //externalContext.strokeText(score + 10, 3 * canvas.width / 4, canvas.height / 4);
    externalContext.restore();

}