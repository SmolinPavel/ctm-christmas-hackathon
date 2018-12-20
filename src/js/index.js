const app = new PIXI.Application(APP_WIDTH, APP_HEIGHT, {
  backgroundColor: 0x9f9f9f
});
document.body.appendChild(app.view);

let lives = 3;
let score = 0;
const bricks = [];
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const brickRowCount = 3;
const brickColumnCount = 5;

let dx = 2;
let dy = -2;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (APP_WIDTH - paddleWidth) / 2;
let rightPressed = false;
let rightPressedWithShift = false;
let leftPressed = false;
let leftPressedWithShift = false;

function getTextStyle() {
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    fill: ["#0095DD"], //, '#00ff99'], // gradient
    //stroke: '#4a1850',
    //strokeThickness: 5,
    //dropShadow: true,
    //dropShadowColor: '#000000',
    //dropShadowBlur: 4,
    // dropShadowAngle: Math.PI / 6,
    //dropShadowDistance: 6,
    wordWrap: true
    //wordWrapWidth: 440
  });
  return style;
}

function drawLives() {
  const richText = new PIXI.Text("Lives: " + lives, getTextStyle());
  richText.x = 400;
  richText.y = 0;
  app.stage.addChild(richText);
}

function drawScore() {
  const richText = new PIXI.Text("Score: " + score, getTextStyle());
  richText.x = 8;
  richText.y = 0;
  app.stage.addChild(richText);
}

const paddleItem = generatePaddle();
const bricksContainer = generateBricks();

app.ticker.add(function(delta) {
  if (rightPressed && paddleItem.x + paddleItem.width < APP_WIDTH) {
    paddleItem.x += 7;
  } else if (leftPressed && paddleItem.x > 0) {
    paddleItem.x -= 7;
  } else if (rightPressedWithShift && rightNullX < APP_WIDTH - paddleWidth) {
    paddleItem.x += 21;
  } else if (leftPressedWithShift && rightNullX > 0) {
    paddleItem.x -= 21;
  }
  bricksContainer.y += 0.1;
});

app.stage.addChild(bricksContainer);
app.stage.addChild(paddleItem);
drawLives();
drawScore();

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
