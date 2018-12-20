const app = new PIXI.Application(APP_WIDTH, APP_HEIGHT, APP_CONFIG);
document.body.appendChild(app.view);

let startGameTimestamp;

const paddleWidth = 75;
let paddleX = (APP_WIDTH - paddleWidth) / 2;
const emptyKeybEvent =  {shiftKey : false, keyCode:0};
let lastKeybEvent = emptyKeybEvent;
let santaDiedTime = 0;

function getFrameX(frame_width, framePosition) {
  return -frame_width * framePosition;
}

function getFrameY(frame_height, framePosition) {
  return -frame_height * Math.floor(framePosition / 9);
}

function wrapUpdate(santaPerson, bricksContainer, background) {
    return function update(delta) {

        if (santaDiedTime === 0){
            const halfOfSanta = santaPerson.width / 2;
            let speed =  lastKeybEvent.shiftKey ? 21 : 7;
            let turn = 0;
            if (lastKeybEvent.key === "ArrowRight"){
                turn = 1;
            }
            else if (lastKeybEvent.key === "ArrowLeft"){
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
                        santaDiedTime = Date.now();

                    }
                    bricksContainer.children.splice(index, 1);
                } else {
                    child.y += 1;
                    child.rotation += 0.05 * delta;
                }
            }
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
        }
        else{
            if ((Date.now() - santaDiedTime) > 3000){
                app.ticker.remove(update);
                gameOver(santaPerson, bricksContainer, background);
            }
        }



        let delta_santa = Date.now() - start_generation_time;
        const santaFrame = (delta_santa / 1000 / SANTA_FRAMES_PER_SECOND - 1);
        if (santaDiedTime !== 0){
            santaPerson.tilePosition.x = getFrameX(SANTA_WIDTH, Math.round(53 - santaFrame % 2));
            santaPerson.tilePosition.y = getFrameY(SANTA_HEIGHT, Math.round( 53 - santaFrame % 2));
        }
        else{
            santaPerson.tilePosition.x = getFrameX(SANTA_WIDTH, Math.round(santaFrame % 50));
            santaPerson.tilePosition.y = getFrameY(SANTA_HEIGHT, Math.round(santaFrame % 50));
        }



  };
}

let deltaUdpate = 0;
let timeOfLastPartialUpdate = 0;

function loadStartPage() {
  app.stage.addChild(generateStartPage(loadGame));
}

function loadGame() {
  const santaPerson = generateSantaPerson();
  const bricksContainer = generateBricksContainer();
  const background = generateBackground();
  app.stage.addChild(background);
  app.stage.addChild(bricksContainer);
  app.stage.addChild(santaPerson);

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
  document.addEventListener("mousemove", mouseMoveHandler);

  app.ticker.add(wrapUpdate(santaPerson, bricksContainer, background));

  startGameTimestamp = Date.now();   
}

function keyDownHandler(e) {
    if (["ArrowRight", "ArrowLeft"].indexOf(e.key) !== -1){
        lastKeybEvent = e;
    }
    else{
        lastKeybEvent = {
            key : lastKeybEvent.key,
            shiftKey : e.shiftKey
        };
    }
}

function keyUpHandler(e) {
    if (["ArrowRight", "ArrowLeft"].indexOf(e.key) !== -1){
        lastKeybEvent = {
            key : "",
            shiftKey : e.shiftKey
        };
    }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - APP_OFFSET_LEFT;
  if (relativeX > paddleWidth / 2 && relativeX < APP_WIDTH - paddleWidth / 2) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function gameOver(santaPerson, bricksContainer, background) {
  const gameOverPage = generateGameOverPage();
  app.stage.removeChild(background);
  app.stage.removeChild(bricksContainer);
  app.stage.removeChild(santaPerson);
  app.stage.addChild(gameOverPage);
}

function finishGame(santaPerson, bricksContainer, background) {
  const finishGamePage = generateFinishPage();
  app.stage.removeChild(background);
  app.stage.removeChild(bricksContainer);
  app.stage.removeChild(santaPerson);
  app.stage.addChild(finishGamePage);
}

loadStartPage();
