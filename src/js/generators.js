let last_generation_time = 0;
let start_generation_time = Date.now();
let delta_treshold = 4000;

function generateBricks() {
  const now = Date.now();
  const delta = now - last_generation_time;
  let outcome = [];
  if ((delta > delta_treshold) || (last_generation_time === 0)){
    delta_treshold = Math.max(delta_treshold * 0.95, 2000);
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

function generateSantaPerson() {
  const texture = PIXI.Texture.fromImage(SANTA_URL);
  const santa = new PIXI.extras.TilingSprite(texture, SANTA_WIDTH, SANTA_HEIGHT);
  santa.y = app.screen.height - SANTA_HEIGHT;
  santa.x = app.screen.width / 2 - SANTA_WIDTH / 2;
  return santa;
}

function generateBomb(top) {
  const texture = PIXI.Texture.fromImage(BOMB_URL);
  const sprite = new PIXI.Sprite(texture);
  sprite.x = Math.random() * APP_WIDTH;
  sprite.y = top;
  sprite.anchor.set(0.5);
  sprite.scale.set(0.1, 0.1);

  return sprite;
}

function generateAxe(top) {
  const texture = PIXI.Texture.fromImage(AXE_URL);
  const sprite = new PIXI.Sprite(texture);
  sprite.x = Math.random() * APP_WIDTH;
  sprite.y = top;
  sprite.anchor.set(0.5);
  sprite.scale.set(0.25, 0.25);
  return sprite;
}

function generateBackground() {
  const texture = PIXI.Texture.fromImage(BACKGROUND_URL);
  const tilingSprite = new PIXI.TilingSprite(texture, APP_WIDTH, APP_HEIGHT);
  tilingSprite.alpha = 0.4;
  return tilingSprite;
}
function generateUIText(text, x, y){
    const richText = new PIXI.Text(text, getTextStyle());
    richText.x = x;
    richText.y = y;
    return richText
}
