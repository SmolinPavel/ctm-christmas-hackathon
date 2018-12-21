const app = new PIXI.Application(APP_WIDTH, APP_HEIGHT, APP_CONFIG);
document.body.appendChild(app.view);

let startGameTimestamp;

const paddleWidth = 75;
let paddleX = (APP_WIDTH - paddleWidth) / 2;
const emptyKeybEvent =  {shiftKey : false, keyCode:0};
let lastKeybEvent = emptyKeybEvent;
let santaDiedTime = 0;
let paused = false;
let pauseTime = 0;
let pauseStartedTime = 0;

function getFrameX(frame_width, framePosition) {
  return -frame_width * framePosition;
}

function getFrameY(frame_height, framePosition) {
  return -frame_height * Math.floor(framePosition / 9);
}

function updateKeys(santaPerson){
    const halfOfSanta = santaPerson.width / 2;
    let speed = lastKeybEvent.shiftKey ? 21 : 7;
    let turn = 0;
    if (lastKeybEvent.key === "ArrowRight") {
        turn = 1;
    } else if (lastKeybEvent.key === "ArrowLeft") {
        turn = -1;
    }
    if (turn !== 0) {
        speed *= turn;
        santaPerson.scale.set(-turn, 1);
        let rightCorellation = Math.min(santaPerson.x + speed, APP_WIDTH - halfOfSanta);
        santaPerson.x = Math.max(rightCorellation, halfOfSanta);
    }
}

function updateSantaAnimation(santaPerson){
    let delta_santa = Date.now() - start_generation_time;
    const santaFrame = (delta_santa / 1000 / SANTA_FRAMES_PER_SECOND - 1);
    if (santaDiedTime !== 0) {
        santaPerson.tilePosition.x = getFrameX(SANTA_WIDTH, Math.round(53 - santaFrame % 2));
        santaPerson.tilePosition.y = getFrameY(SANTA_HEIGHT, Math.round(53 - santaFrame % 2));
    } else {
        santaPerson.tilePosition.x = getFrameX(SANTA_WIDTH, Math.round(santaFrame % 50));
        santaPerson.tilePosition.y = getFrameY(SANTA_HEIGHT, Math.round(santaFrame % 50));
    }
}

function updateAnimations(santaPerson, bricksContainer, background, delta){
    let index = 0;
    for (let index = 0; index< bricksContainer.children.length; index++) {
        const child = bricksContainer.children[index];
        child.y += 1;
        if (child.isSin){
            child.x = child.startX + 50 * Math.cos((Date.now() - startGameTimestamp) / 100);
        }
        child.rotation += child.rotationSpeed * delta;
        if (child.y > APP_HEIGHT + child.height){
            if (child.emitter) {
                cancelAnimationFrame(child.updateId);
                child.updateId = 0;
                child.emitter.emit = false;
                child.emitter.destroy();
                particles_attached -= 1;
            }
            child.removeChildren();
            bricksContainer.removeChild(child);
            child.destroy();
            index --;
        }
        else if ((child.y > APP_HEIGHT - santaPerson.height/2) && (child.y < APP_HEIGHT - child.height/4)) {
            if (Math.abs(child.x - santaPerson.x) < santaPerson.width/2) {
                santaDiedTime = Date.now();
                const ifrm = document.getElementById("sndframe");
                ifrm.setAttribute("src", "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/282913659&color=%23ff5500&auto_play=true");
            }
        }
    }
    background.tilePosition.y += 1 + 2*( Date.now() - start_generation_time)/GAME_COUNTDOWN_SECONDS/1000;
}

function updateBricks(bricksContainer){
    const newBricks = generateBricks();
    for (const key in newBricks) {
        if (newBricks.hasOwnProperty(key)) {
            const brick = newBricks[key];
            bricksContainer.addChild(brick);
        }
    }
}

function updateGameStatus(updateFunc){
    deltaUdpate = Date.now() - timeOfLastPartialUpdate;
    if (
        startGameTimestamp &&
        (deltaUdpate > 250 || timeOfLastPartialUpdate === 0)
    ) {
        // TODO add cheap checks here
        const secondsLeft = Math.ceil(
            GAME_COUNTDOWN_SECONDS + (startGameTimestamp - Date.now()) / 1000 + pauseTime
        );
        if (secondsLeft <= 0 && timeOfLastPartialUpdate !== 0) {
            app.ticker.remove(updateFunc);
            finishGame();
        } else {
            const minutes = Math.floor(secondsLeft / 60);
            const seconds = secondsLeft % 60;
            document.getElementById("minutes").innerHTML = `${minutes}:`;
            document.getElementById("seconds").innerHTML = `0${seconds}`.slice(
                -2
            );
            timeOfLastPartialUpdate = Date.now();
        }
    }
}

function wrapUpdate(santaPerson, bricksContainer, background) {
    return function update(delta) {
        if (!paused) {
            if (santaDiedTime === 0) {
                updateKeys(santaPerson);
                updateAnimations(santaPerson, bricksContainer, background, delta);
                updateBricks(bricksContainer);
                updateGameStatus(update);
            } else {
                if ((Date.now() - santaDiedTime) > 3000) {
                    app.ticker.remove(update);
                    gameOver(santaPerson, bricksContainer, background);
                }
            }
            if ((Date.now() - startGameTimestamp > 20000) || (santaDiedTime !== 0)) {
                updateSantaAnimation(santaPerson, delta);
            }
        }
    }
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
  const ifrm = document.createElement("iframe");
  ifrm.setAttribute("id", "sndframe");
  ifrm.setAttribute("src", "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/371455856&color=%23ff5500&auto_play=true");
  ifrm.setAttribute("style", "opacity: 0;")
  setTimeout(() => document.body.appendChild(ifrm), 1000);

}

function keyDownHandler(e) {
    if (["Space", "Escape"].indexOf(e.code) !== -1){
        if (paused){
            pauseTime += (Date.now() -pauseStartedTime) / 1000;
        }
        else{
            pauseStartedTime = Date.now();
        }
        paused = !paused;
    }
    else {
        if (["ArrowRight", "ArrowLeft"].indexOf(e.key) !== -1) {
            lastKeybEvent = e;
        } else {
            lastKeybEvent = {
                key: lastKeybEvent.key,
                shiftKey: e.shiftKey
            };
        }
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
  startGameTimestamp = null;
    document.getElementById("countdown").innerHTML = "";
    const gameOverPage = generateGameOverPage(() => window.location.reload());
  app.stage.removeChild(background);
  app.stage.removeChild(bricksContainer);
  app.stage.removeChild(santaPerson);
  app.stage.addChild(gameOverPage);
}

function finishGame(santaPerson, bricksContainer, background) {
    document.getElementById("countdown").innerHTML = "";
    startGameTimestamp = null;
  const finishGamePage = generateFinishPage(() => window.location.reload());
  app.stage.removeChild(background);
  app.stage.removeChild(bricksContainer);
  app.stage.removeChild(santaPerson);
  app.stage.addChild(finishGamePage);
}

loadStartPage();
