const APP_WIDTH = 800;
const APP_HEIGHT = 600;

const app = new PIXI.Application(APP_WIDTH, APP_HEIGHT, {
  backgroundColor: 0xffffff
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

function drawBricks() {
  const bricksContainer = new PIXI.Graphics();
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricksContainer.lineStyle(2, 0x000000, 1);
      bricksContainer.beginFill(0x0095dd, 0.25);
      bricksContainer.drawRect(
        c * (brickWidth + brickPadding) + brickOffsetLeft,
        r * (brickHeight + brickPadding) + brickOffsetTop,
        brickWidth,
        brickHeight,
        15
      );
      bricksContainer.endFill();
    }
  }
  return bricksContainer;
}

function generatePaddle() {
  const paddle = new PIXI.Graphics();

  paddle.drawRect(
    paddleX,
    APP_HEIGHT - paddleHeight,
    paddleWidth,
    paddleHeight
  );
  paddle.beginFill(0x0095dd, 0.25);
  paddle.lineStyle(2, 0x000000, 1);
  paddle.drawRect(
    paddleX,
    APP_HEIGHT - paddleHeight,
    paddleWidth,
    paddleHeight,
    15
  );
  paddle.endFill();

  //   if (rightPressed && paddleX < APP_WIDTH - paddleWidth) {
  //     paddleX += 7;
  //   } else if (leftPressed && paddleX > 0) {
  //     paddleX -= 7;
  //   } else if (rightPressedWithShift && paddleX < canvas.width - paddleWidth) {
  //     paddleX += 21;
  //   } else if (leftPressedWithShift && paddleX > 0) {
  //     paddleX -= 21;
  //   }

  return paddle;
}

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
  var richText = new PIXI.Text("Lives: " + lives, getTextStyle());
  richText.x = 400;
  richText.y = 0;
  app.stage.addChild(richText);
}

function drawScore() {
  var richText = new PIXI.Text("Score: " + score, getTextStyle());
  richText.x = 8;
  richText.y = 0;
  app.stage.addChild(richText);
}

const bricksContainer = drawBricks();
const paddleItem = generatePaddle();

app.ticker.add(function(delta) {
  bricksContainer.x += 0.1;
});

app.stage.addChild(bricksContainer);
app.stage.addChild(paddleItem);
drawLives();
drawScore();
