let last_generation_time = 0;
let start_generation_time = Date.now();
let delta_treshold = 1000;

function generateBricks() {
  const now = Date.now();
  const delta = now - last_generation_time;
  let outcome = [];
  if ((delta > delta_treshold) || (last_generation_time === 0)){
    delta_treshold = Math.max(delta_treshold * 0.95, 100);
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
  santa.y = app.screen.height - SANTA_HEIGHT / 2;
  santa.x = app.screen.width / 2 - SANTA_WIDTH / 2;
  santa.anchor.set(0.5);
  return santa;
}

function generateBomb(top) {
  const texture = PIXI.Texture.fromImage(BOMB_URL);
  const sprite = new PIXI.Sprite(texture);
  sprite.x = Math.random() * APP_WIDTH;
  sprite.y = top;
  sprite.anchor.set(0.5);
  sprite.scale.set(0.1, 0.1);
  attachSparckles(sprite);
  return sprite;
}

function generateAxe(top) {
  const texture = PIXI.Texture.fromImage(AXE_URL);
  const sprite = new PIXI.Sprite(texture);
  sprite.x = SANTA_WIDTH / 2 + Math.random() * (APP_WIDTH - SANTA_WIDTH);
  sprite.y = top;
  sprite.anchor.set(0.5);
  sprite.scale.set(0.25, 0.25);
  return sprite;
}

function generateBackground() {
  const texture = PIXI.Texture.fromImage(BACKGROUND_URL);
  const tilingSprite = new PIXI.extras.TilingSprite(texture, APP_WIDTH, APP_HEIGHT);
  tilingSprite.alpha = 0.4;
  return tilingSprite;
}

const generateStartPage = callback => generatePage(START_PAGE_URL, callback, true);
const generateFinishPage = callback => generatePage(FINISH_PAGE_URL, callback, false);
const generateGameOverPage = callback => generatePage(GAME_OVER_PAGE_URL, callback, false);

const startKeyDownHandler = ({ keyCode }, sprite, callback) => {
    if (keyCode === 13) {
        sprite.parent.removeChild(sprite);
        callback();
    }
};

const generatePage = (pageUrl, callback, removeSprite) => {
    const texture = PIXI.Texture.fromImage(pageUrl);
    const sprite = new PIXI.Sprite(texture, APP_WIDTH, APP_HEIGHT);
    document.addEventListener("keydown", (e) => startKeyDownHandler(e, sprite, callback));
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.on('pointerdown', function (e){
        if (removeSprite) {
          sprite.parent.removeChild(sprite);
        }
        callback();
    });

    return sprite;
};