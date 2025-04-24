let paddle, balls, blocks, powerUps;
let level = 0; // nivel actual
let lives = 3; // vidas restantes
let score = 0; // puntaje total
let state = 'READY'; // estado del juego: READY, PLAY, NEXT, WIN, GAMEOVER
let through = false; // power up atravesar bloques
let throughEnd = 0; // tiempo de finalización del power up
const PAD = 5; // margen entre bloques

function setup() {
    createCanvas(800, 600);
    initLevel();
}

function draw() {
    background(30);
    drawHUD(); // dibuja el HUD (puntuación, vidas, nivel)
    drawBlocks(); // dibuja los bloques
    drawPowerUps(); // dibuja los power-ups

    //Logica segun el estado del juego
    if (state === 'READY') drawReady();
    else if (state ==='PLAY') updatePlay();
    else drawEnd();
}

//Funcion del HUD superior
function drawHUD(){
    fill(255); textSize(16); textAlign(LEFT);
    text(`Puntos: ${score}`, 10, 20);
    text(`Nivel: ${level+1}`, 10, 40);
    text(`Vidas: ${lives}`, 10, 60);
}

//Funcion iniciar nivel donde se configuran los bloques, pala, pelotas y powerups para el nivel actual
function initLevel() {
    blocks = [];
    balls = [];
    powerUps = [];
    through = false;
  
    let cfg = LEVELS[level];       // leer configuración
    paddle = new Paddle();         // crear paddle
    balls.push(new Ball(cfg.speed));// una sola pelota
  
    // calcular ancho/alto de bloque con PAD fijo
    let totalPadX = (cfg.cols + 1) * PAD;
    let bw = (width - totalPadX) / cfg.cols;
    let bh = 20;
  
    // crear grid de bloques
    for (let r = 0; r < cfg.rows; r++) {
      for (let c = 0; c < cfg.cols; c++) {
        let x = PAD + c * (bw + PAD);
        let y = 80 + PAD + r * (bh + PAD);
        blocks.push(new Block(x, y, bw, bh, cfg.hits));
      }
    }
  }
  
  // drawBlocks(): recorre y dibuja cada bloque
  function drawBlocks() {
    for (let b of blocks) b.show();
  }
  
  // drawPowerUps(): mueve, dibuja y procesa recolección
  function drawPowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
      let p = powerUps[i];
      p.update(); p.show();
      if (p.hitsPaddle(paddle)) {
        // al tocar pala, aplicar efecto
        if (p.type === 'dup')   spawnDuplicates();
        else                     activateThrough();
        powerUps.splice(i, 1);
      } else if (p.y > height) {
        // si cae fuera del canvas, eliminar
        powerUps.splice(i, 1);
      }
    }
    // desactivar through si expiró el tiempo
    if (through && millis() > throughEnd) through = false;
  }
  
  // drawReady(): pantalla previa al lanzamiento
  function drawReady() {
    paddle.show(); paddle.update();
    balls[0].follow(paddle);
    balls[0].show();
    fill(200); textAlign(CENTER); textSize(24);
    text('Presiona ESPACIO para lanzar', width/2, height/2);
  }
  
  // updatePlay(): lógica de juego en curso
  function updatePlay() {
    paddle.show(); paddle.update();
    // actualizar cada bola
    for (let i = balls.length - 1; i >= 0; i--) {
      let b = balls[i];
      b.update(); b.checkWalls(); b.checkPaddle(paddle);
      b.checkBlocks(blocks); b.show();
      if (b.lost) balls.splice(i, 1); // si cae, quitarla
    }
    // si no quedan bolas → perder vida o game over
    if (balls.length === 0) {
      lives--;
      if (lives > 0) {
        balls = [new Ball(LEVELS[level].speed)];
        state = 'READY';
      } else {
        state = 'GAMEOVER';
      }
    }
    // si todos los bloques destruidos → NEXT o WIN
    if (blocks.every(b => b.destroyed)) {
      state = (level < LEVELS.length - 1) ? 'NEXT' : 'WIN';
    }
  }
  
  // drawEnd(): pantalla NEXT / WIN / GAMEOVER
  function drawEnd() {
    fill(255); textAlign(CENTER); textSize(32);
    if (state === 'NEXT') {
      text('¡Nivel completado! ENTER', width/2, height/2);
    } else if (state === 'WIN') {
      text('¡Ganaste! ENTER', width/2, height/2);
    } else if (state === 'GAMEOVER') {
      text('Game Over – ENTER', width/2, height/2);
    }
  }
  
  // keyPressed(): controla flechas, espacio y enter
  function keyPressed() {
    if (keyCode === LEFT_ARROW)  paddle.move(-1);
    if (keyCode === RIGHT_ARROW) paddle.move(+1);
  
    if (state === 'READY' && key === ' ') {
      balls.forEach(b => b.launch());
      state = 'PLAY';
    }
    if ((state === 'NEXT' || state === 'WIN' || state === 'GAMEOVER') &&
        keyCode === ENTER) {
      if (state === 'NEXT') {
        level++; initLevel(); state = 'READY';
      } else {
        level = 0; lives = 3; score = 0;
        initLevel(); state = 'READY';
      }
    }
  }
  
  // keyReleased(): detener movimiento de la pala al soltar flechas
  function keyReleased() {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
      paddle.move(0);
    }
  }