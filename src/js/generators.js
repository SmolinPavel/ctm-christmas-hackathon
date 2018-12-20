function generateBricks() {
  const bricksContainer = new PIXI.Container();
  bricksContainer.addChild(generateBomb());
  bricksContainer.addChild(generateAxe());
  return bricksContainer;
}

function generatePaddle() {
  const paddle = new PIXI.Graphics();

  paddle.drawRect(0, 0, paddleWidth, paddleHeight);
  paddle.beginFill(0x0095dd, 0.25);
  paddle.lineStyle(2, 0x000000, 1);
  paddle.drawRect(0, 0, paddleWidth, paddleHeight, 15);
  paddle.x = paddleX;
  paddle.y = APP_HEIGHT - paddleHeight;

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

function generateBomb() {
  const texture = PIXI.Texture.fromImage('./assets/bomb.png');
  return new PIXI.Sprite(texture);
}

function generateAxe() {
  const texture = PIXI.Texture.fromImage('./assets/axe.png');
  return new PIXI.Sprite(texture);
}
