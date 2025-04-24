class PowerUp {
    // x,y: posición inicial central; type: 'dup' o 'thr'
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;    // dup = duplicar pelotas, thr = atravesar bloques
      this.size = 20;      // tamaño del ícono
      this.speed = 3;      // velocidad de caída
    }
  
    // update(): baja la power-up
    update() {
      this.y += this.speed;
    }
  
    // show(): dibuja círculo o cuadrado según tipo
    show() {
      noStroke();
      if (this.type === 'dup') {
        fill(0, 200, 200);
        ellipse(this.x, this.y, this.size);
      } else {
        fill(200, 200, 0);
        rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
      }
    }
  
    // hitsPaddle(p): true si colisiona con la pala
    hitsPaddle(p) {
      return (
        this.x > p.x &&
        this.x < p.x + p.w &&
        this.y + this.size/2 > p.y &&
        this.y - this.size/2 < p.y + p.h
      );
    }
  }
  
  // spawnPU(block): 20% de probabilidad de generar power-up al romper bloque
  function spawnPU(b) {
    if (random() < 0.2) {
      let types = ['dup'];        // siempre posibilidad de duplicar
      if (level > 0) types.push('thr'); // desde nivel 2 activar through
      let t = random(types);
      powerUps.push(new PowerUp(b.x + b.w/2, b.y + b.h/2, t));
    }
  }
  
  // spawnDuplicates(): duplica cada bola existente invirtiendo vx
  function spawnDuplicates() {
    let extras = balls.map(b => {
      let nb = new Ball(b.s);
      nb.x = b.x; nb.y = b.y;
      nb.vx = -b.vx; nb.vy = b.vy;
      nb.served = true;
      return nb;
    });
    balls.push(...extras);
  }
  
  // activateThrough(): habilita modo through por 5 segundos
  function activateThrough() {
    through = true;
    throughEnd = millis() + 5000;
  }
  