const app = new PIXI.Application(APP_WIDTH, APP_HEIGHT, APP_CONFIG);
document.body.appendChild(app.view);

let lives = 3;
let score = 0;

let startGameTimestamp;

const paddleWidth = 75;
let paddleX = (APP_WIDTH - paddleWidth) / 2;
let rightPressed = false;
let rightPressedWithShift = false;
let leftPressed = false;
let leftPressedWithShift = false;

const startPage = generateStartPage();
const santaPerson = generateSantaPerson();
const bricksContainer = generateBricksContainer();
const background = generateBackground();

function getFrameX(frame_width, framePosition) {
  return frame_width * framePosition;
}

function getFrameY(frame_height, framePosition) {
  return frame_height * Math.round(framePosition / 8);
}

function wrapUpdate(santaPerson, bricksContainer, background) {
  return function update(delta) {
    const santaRight = santaPerson.x + santaPerson.width / 2;
    const santaLeft = santaPerson.x - santaPerson.width / 2;
    if (rightPressed && santaRight < APP_WIDTH) {
      santaPerson.x += 7;
      santaPerson.scale.set(-1, 1);
    } else if (leftPressed && santaLeft > 0) {
      santaPerson.x -= 7;
      santaPerson.scale.set(1, 1);
    } else if (rightPressedWithShift && santaRight < APP_WIDTH) {
      santaPerson.x += 21;
    } else if (leftPressedWithShift && santaLeft > 0) {
      santaPerson.x -= 21;
    }
    for (const index in bricksContainer.children) {
      const child = bricksContainer.children[index];
      if (child.y > APP_HEIGHT) {
        if (Math.abs(child.x - santaPerson.x) < 100) {
          gameOver();
        }
        bricksContainer.children.splice(index, 1);
      } else {
        child.y += 1;
        child.rotation += 0.05 * delta;
      }
    }

    let delta_santa = Date.now() - start_generation_time;
    santaPerson.tilePosition.x = getFrameX(
      SANTA_WIDTH,
      Math.round(delta_santa / 1000 / SANTA_FRAMES_PER_SECOND)
    );
    santaPerson.tilePosition.y = getFrameY(
      SANTA_HEIGHT,
      Math.round(delta_santa / 1000 / SANTA_FRAMES_PER_SECOND)
    );
    background.tilePosition.y += 1;
    const newBricks = generateBricks();
    for (const key in newBricks) {
      if (newBricks.hasOwnProperty(key)) {
        const brick = newBricks[key];
        bricksContainer.addChild(brick);
      }
    }

    deltaUdpate = Date.now() - timeOfLastPartialUpdate;
    if (
      startGameTimestamp &&
      (deltaUdpate > 250 || timeOfLastPartialUpdate === 0)
    ) {
      // TODO add cheap checks here
      const secondsLeft = Math.floor(
        GAME_COUNTDOWN_SECONDS + (startGameTimestamp - Date.now()) / 1000
      );
      if (secondsLeft <= 0 && timeOfLastPartialUpdate !== 0) {
        finishGame();
      } else {
        document.getElementById("minutes").innerHTML = "0:";
        document.getElementById("seconds").innerHTML = `0${secondsLeft}`.slice(
          -2
        );
        timeOfLastPartialUpdate = Date.now();
      }
    }
  };
}

let deltaUdpate = 0;
let timeOfLastPartialUpdate = 0;

function loadStartPage() {
  app.stage.addChild(startPage);
}

function loadGame() {
  app.stage.removeChild(startPage);
  app.stage.addChild(background);
  app.stage.addChild(bricksContainer);
  app.stage.addChild(santaPerson);

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
  document.addEventListener("mousemove", mouseMoveHandler);

  app.ticker.add(wrapUpdate(santaPerson, bricksContainer, background));

  startGameTimestamp = Date.now();
}

function keyDownHandler({ keyCode, shiftKey }) {
  if (keyCode === 39) {
    if (shiftKey) {
      rightPressedWithShift = true;
    } else {
      rightPressed = true;
    }
  } else if (keyCode === 37) {
    if (shiftKey) {
      leftPressedWithShift = true;
    } else {
      leftPressed = true;
    }
  }
}

function keyUpHandler({ keyCode }) {
  if (keyCode === 39) {
    rightPressed = false;
    rightPressedWithShift = false;
  } else if (keyCode === 37) {
    leftPressed = false;
    leftPressedWithShift = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - APP_OFFSET_LEFT;
  if (relativeX > paddleWidth / 2 && relativeX < APP_WIDTH - paddleWidth / 2) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function gameOver() {
  const gameOverPage = generateGameOverPage();
  app.stage.removeChild(background);
  app.stage.removeChild(bricksContainer);
  app.stage.removeChild(santaPerson);
  app.stage.addChild(gameOverPage);
}

function finishGame() {
  const finishGamePage = generateFinishPage();
  app.stage.removeChild(background);
  app.stage.removeChild(bricksContainer);
  app.stage.removeChild(santaPerson);
  app.stage.addChild(finishGamePage);
}

loadStartPage();
