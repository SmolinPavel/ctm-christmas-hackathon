const app = new PIXI.Application(APP_WIDTH, APP_HEIGHT, APP_CONFIG);
document.body.appendChild(app.view);

let lives = 3;
let score = 0;
const bricks = [];
const brickWidth = 75;
const brickHeight = 20;
const brickRowCount = 3;
const brickColumnCount = 5;

const paddleWidth = 75;
let paddleX = (APP_WIDTH - paddleWidth) / 2;
let rightPressed = false;
let rightPressedWithShift = false;
let leftPressed = false;
let leftPressedWithShift = false;

function getTextStyle() {
  return new PIXI.TextStyle(UI_TEXT_STYLE);
}

function drawLives() {
  app.stage.addChild(generateUIText("Lives: " + lives, 400, 0));
}

function drawScore() {
  app.stage.addChild(generateUIText("Score: " + score, 8, 0));
}

function getFrameX(frame_width, framePosition) {
  return frame_width * framePosition;
}

function getFrameY(frame_height, framePosition) {
  return frame_height * Math.round(framePosition / 8);
}

app.ticker.add(function(delta) {
  if (rightPressed && santaPerson.x + santaPerson.width < APP_WIDTH) {
    santaPerson.x += 7;
  } else if (leftPressed && santaPerson.x > 0) {
    santaPerson.x -= 7;
  } else if (rightPressedWithShift && rightNullX < APP_WIDTH - paddleWidth) {
    santaPerson.x += 21;
  } else if (leftPressedWithShift && rightNullX > 0) {
    santaPerson.x -= 21;
  }
  for (const index in bricksContainer.children) {
    const child = bricksContainer.children[index];
    if (child.y > APP_HEIGHT) {
      if (Math.abs(child.x - santaPerson.x) < 100) {
        alert("Smash it!");
      }
      bricksContainer.children.splice(index, 1);
    } else {
      child.y += 1;
      child.rotation += 0.1 * delta;
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

  newBricks = generateBricks();
  for (const key in newBricks) {
    if (newBricks.hasOwnProperty(key)) {
      const brick = newBricks[key];
      bricksContainer.addChild(brick);
    }
  }

  deltaUdpate = Date.now() - timeOfLastPartialUpdate;
  if (deltaUdpate > 250 || timeOfLastPartialUpdate === 0) {
    // TODO add cheap checks here
    const t = Math.floor(
      GAME_COUNTDOWN_SECONDS + (start_generation_time - Date.now()) / 1000
    );
    if (t <= 0 && timeOfLastPartialUpdate !== 0) {
      alert("WIN");
    } else {
      document.getElementById("seconds").innerHTML = ("0" + t).slice(-2);
      timeOfLastPartialUpdate = Date.now();
    }
  }
});

let deltaUdpate = 0;
let timeOfLastPartialUpdate = 0;

const santaPerson = generateSantaPerson();
const bricksContainer = generateBricksContainer();
const background = generateBackground();
app.stage.addChild(background);
app.stage.addChild(bricksContainer);
app.stage.addChild(santaPerson);

// drawLives();
// drawScore();

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    if (e.shiftKey) {
      rightPressedWithShift = true;
    } else {
      rightPressed = true;
    }
  } else if (e.keyCode === 37) {
    if (e.shiftKey) {
      leftPressedWithShift = true;
    } else {
      leftPressed = true;
    }
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
    rightPressedWithShift = false;
  } else if (e.keyCode === 37) {
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
