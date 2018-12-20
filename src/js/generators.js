function generateBricks() {
    const bricksContainer = new PIXI.Container();
    for (let rowIndex = 0; rowIndex < brickRowCount; rowIndex++){
        for (let colIndex = 0; colIndex < brickColumnCount; colIndex++){
            const brickContainer = new PIXI.Graphics();
            brickContainer.lineStyle(2, 0x000000, 1);
            brickContainer.beginFill(0x0095DD, 0.25);
            brickContainer.drawRect(colIndex * (brickWidth + brickPadding) + brickOffsetLeft, rowIndex * (brickHeight + brickPadding) + brickOffsetTop, brickWidth, brickHeight, 15);
            brickContainer.endFill();
            bricksContainer.addChild(brickContainer);
        }
    }
    const texture = PIXI.Texture.fromImage('./assets/bomb.png');
    const bomb = new PIXI.Sprite(texture);
    bomb.alpha = 0.1;
    bricksContainer.addChild(bomb);
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
