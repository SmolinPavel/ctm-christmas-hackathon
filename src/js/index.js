const app = new PIXI.Application(APP_WIDTH, APP_HEIGHT, APP_CONFIG);
document.body.appendChild(app.view);

let lives = 3;
let score = 0;

let startGameTimestamp;

const paddleWidth = 75;
let paddleX = (APP_WIDTH - paddleWidth) / 2;
const emptyKeybEvent =  {shiftKey : false, keyCode:0};
let lastKeybEvent = emptyKeybEvent;

const startPage = generateStartPage();
const santaPerson = generateSantaPerson();
const bricksContainer = generateBricksContainer();
const background = generateBackground();

function getFrameX(frame_width, framePosition) {
  return -frame_width * framePosition;
}

function getFrameY(frame_height, framePosition) {
  return -frame_height * Math.floor(framePosition / 9);
}

function wrapUpdate(santaPerson, bricksContainer, background) {
    return function update(delta) {
        const halfOfSanta = santaPerson.width / 2;
        let speed =  lastKeybEvent.shiftKey ? 21 : 7;
        let turn = 0;
        if (lastKeybEvent.keyCode === 39){
            turn = 1;
        }
        else if (lastKeybEvent.keyCode === 37){
            turn = -1;
        }
        if (turn !== 0) {
            speed *= turn;
            santaPerson.scale.set(-turn, 1);
            let rightCorellation = Math.min(santaPerson.x + speed, APP_WIDTH - halfOfSanta);
            santaPerson.x = Math.max(rightCorellation, halfOfSanta);
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

        const santaFrame = (delta_santa / 1000 / SANTA_FRAMES_PER_SECOND - 1);
        santaPerson.tilePosition.x = getFrameX(SANTA_WIDTH, Math.round(santaFrame % 51));
        santaPerson.tilePosition.y = getFrameY(SANTA_HEIGHT, Math.round(santaFrame % 51));
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
      const secondsLeft = Math.ceil(
        GAME_COUNTDOWN_SECONDS + (startGameTimestamp - Date.now()) / 1000
      );
      if (secondsLeft <= 0 && timeOfLastPartialUpdate !== 0) {
        finishGame();
      } else {
        const minutes = Math.floor(secondsLeft/60);
        const seconds = secondsLeft % 60;
        document.getElementById("minutes").innerHTML = `${minutes}:`;
        document.getElementById("seconds").innerHTML = `0${seconds}`.slice(
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
  const ifrm = document.createElement("iframe");
  ifrm.setAttribute("src", "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/371455856&color=%23ff5500&auto_play=true");
  ifrm.setAttribute("style", "opacity: 0;")
  setTimeout(() => document.body.appendChild(ifrm), 1000);

}

function keyDownHandler(e) {
  lastKeybEvent = e;
}

function keyUpHandler(e) {
  lastKeybEvent = emptyKeybEvent;
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - APP_OFFSET_LEFT;
  if (relativeX > paddleWidth / 2 && relativeX < APP_WIDTH - paddleWidth / 2) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function gameOver() {
  startGameTimestamp = null;
  const gameOverPage = generateGameOverPage();
  app.stage.removeChild(background);
  app.stage.removeChild(bricksContainer);
  app.stage.removeChild(santaPerson);
  app.stage.addChild(gameOverPage);
}

function finishGame() {
  startGameTimestamp = null;
  const finishGamePage = generateFinishPage();
  app.stage.removeChild(background);
  app.stage.removeChild(bricksContainer);
  app.stage.removeChild(santaPerson);
  app.stage.addChild(finishGamePage);
}

loadStartPage();
