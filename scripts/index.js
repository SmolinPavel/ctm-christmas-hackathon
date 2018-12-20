var app = new PIXI.Application(800, 600, {backgroundColor: 0xFFFFFF});
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

//var container = new PIXI.Container();

function generateBricks() {
    var bricksContainer = new PIXI.Container();
    for (let rowIndex = 0; rowIndex < brickRowCount; rowIndex++){
        for (let colIndex = 0; colIndex < brickColumnCount; colIndex++){
            var brickContainer = new PIXI.Graphics();
            brickContainer.lineStyle(2, 0x000000, 1);
            brickContainer.beginFill(0x0095DD, 0.25);
            brickContainer.drawRect(colIndex * (brickWidth + brickPadding) + brickOffsetLeft, rowIndex * (brickHeight + brickPadding) + brickOffsetTop, brickWidth, brickHeight, 15);
            brickContainer.endFill();
            bricksContainer.addChild(brickContainer);
        }
    }
    return bricksContainer;
}

function getTextStyle(){
    var style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fill: ['#0095DD'],//, '#00ff99'], // gradient
        //stroke: '#4a1850',
        //strokeThickness: 5,
        //dropShadow: true,
        //dropShadowColor: '#000000',
        //dropShadowBlur: 4,
       // dropShadowAngle: Math.PI / 6,
        //dropShadowDistance: 6,
        wordWrap: true,
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

var bricksContainer = generateBricks();

app.ticker.add(function(delta) {
    bricksContainer.x += 0.1
});

app.stage.addChild(bricksContainer);
drawLives();
drawScore();