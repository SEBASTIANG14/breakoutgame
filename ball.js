class Ball {
    // constructor(speed): recibe la velocidad base para este nivel
    constructor(speed) {
      this.r = 12;     // radio de la pelota
      this.s = speed;  // velocidad base
      this.reset();    // posición y estado inicial
    }
  
    reset() {
      // centro horizontal y justo encima de la pala
      this.x = width/2;
      this.y = paddle.y - this.r - 2;
      // velocidad cero hasta que se lance
      this.vx = 0;
      this.vy = 0;
      this.served = false;  // no ha sido lanzada
      this.lost = false;    // flag para detectar que cayó fuera
    }
  
    // follow(p): antes de lanzarse, la pelota sigue la pala
    follow(p) {
      this.x = p.x + p.w/2;
      this.y = p.y - this.r - 2;
    }
  
    // launch(): inicializa vx/vy con un ángulo aleatorio y activa la pelota
    launch() {
      let a = random(-PI/4, PI/4);     // ángulo entre -45° y +45°
      this.vx = this.s * cos(a);       // componente X
      this.vy = -this.s * sin(a) - this.s; // componente Y (hacia arriba)
      this.served = true;
    }
  
    // update(): mueve la pelota si ya fue lanzada
    update() {
      if (!this.served) return;  // si no está en juego, no avanza
      this.x += this.vx;
      this.y += this.vy;
    }
  
    // checkWalls(): detecta colisiones con paredes y suelo/superior
    checkWalls() {
      if (!this.served) return;
      // pared izquierda
      if (this.x < this.r) {
        this.x = this.r; this.vx *= -1;
      }
      // pared derecha
      if (this.x > width - this.r) {
        this.x = width - this.r; this.vx *= -1;
      }
      // techo
      if (this.y < this.r) {
        this.y = this.r; this.vy *= -1;
      }
      // si cae por debajo del canvas → marcar como perdida
      if (this.y > height + this.r) {
        this.lost = true;
      }
    }
  
    // checkPaddle(p): rebota en la pala ajustando el ángulo
    checkPaddle(p) {
      if (!this.served) return;
      // colisión AABB entre círculo y rectángulo
      if (
        this.x > p.x &&
        this.x < p.x + p.w &&
        this.y + this.r > p.y &&
        this.y - this.r < p.y + p.h
      ) {
        // ajustar posición justo sobre la pala
        this.y = p.y - this.r - 1;
        // invertir vy para rebotar
        this.vy *= -1;
        // calcular offset para controlar ángulo de salida
        let off = this.x - (p.x + p.w/2);
        let nvx = this.s * (off / (p.w/2));  // nueva componente X
        let nvy = this.vy;                   // nueva componente Y
        // normalizar (mantener magnitud s constante)
        let m = sqrt(nvx*nvx + nvy*nvy);
        this.vx = nvx/m * this.s;
        this.vy = nvy/m * this.s;
      }
    }
  
    // checkBlocks(blocks): colisión con cada bloque
    checkBlocks(arr) {
      if (!this.served) return;
      for (let b of arr) {
        if (!b.destroyed &&
            this.x > b.x &&
            this.x < b.x + b.w &&
            this.y - this.r < b.y + b.h &&
            this.y + this.r > b.y
        ) {
          // invertir vy
          this.vy *= -1;
          // reposicionar fuera del bloque
          this.y += this.vy > 0 ? this.r + 1 : -(this.r + 1);
  
          // si modo through activo o se le acaban golpes:
          if (through || --b.hits <= 0) {
            b.destroyed = true;    // marcar bloque como roto
            score++;               // sumar punto
            spawnPU(b);            // posible generar power-up
          }
          break;  // solo colisiona con un bloque cada frame
        }
      }
    }
  
    // show(): dibuja la pelota
    show() {
      fill(255, 100, 100);
      ellipse(this.x, this.y, this.r*2);
    }
  }
  