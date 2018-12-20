let last_generation_time = 0;
let start_generation_time = Date.now();
let delta_treshold = 4000;

function generateBricks() {
  const now = Date.now();
  const delta = now - last_generation_time;
  let outcome = [];
  if ((delta > delta_treshold) || (last_generation_time === 0)){
    delta_treshold *= 0.95;
    last_generation_time = now;
    game_time_in_sec = (now - start_generation_time) / 1000;
    if (Math.random() > 0.5) {
      outcome.push(generateBomb(-game_time_in_sec * 10));
    }
    else{
      outcome.push(generateAxe(-game_time_in_sec * 10));
    }
  }
  return outcome;
}

function generateBricksContainer(){
    return new PIXI.Container();
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

  return paddle;
}

function generateBomb(top) {
  const texture = PIXI.Texture.fromImage('./assets/bomb.png');
  const sprite = new PIXI.TilingSprite(texture, texture.width, texture.height);
  sprite.x = Math.random() * APP_WIDTH;
  sprite.y = top;
  sprite.anchor.set(0.5);
  sprite.scale.set(0.1, 0.1);

  return sprite;
}

function generateAxe(top) {
  const texture = PIXI.Texture.fromImage('./assets/axe.png');
  const sprite = new PIXI.TilingSprite(texture, texture.width, texture.height);
  sprite.x = Math.random() * APP_WIDTH;
  sprite.y = top;
  sprite.anchor.set(0.5);
  sprite.scale.set(0.25, 0.25);
  return sprite;
}
