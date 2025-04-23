// Paddle.js

// Clase Paddle: controla la barra que rebota las pelotas.
class Paddle {
    constructor() {
      // Dimensiones de la barra
      this.w = 100;           // ancho
      this.h = 20;            // alto
      // Posición inicial (centrada horizontal, abajo en el canvas)
      this.x = width/2 - this.w/2;
      this.y = height - this.h - 10;
      this.speed = 8;         // velocidad de movimiento
      this.dir = 0;           // dirección actual: -1 izquierdo, +1 derecho, 0 quieto
    }
  
    // update(): actualiza la posición según dir * speed
    update() {
      // sumamos desplazamiento y restringimos dentro del canvas
      this.x = constrain(this.x + this.dir * this.speed, 0, width - this.w);
    }
  
    // show(): dibuja la barra en pantalla
    show() {
      fill(200);
      rect(this.x, this.y, this.w, this.h);
    }
  
    // move(dir): cambia la dirección de movimiento
    move(direction) {
      this.dir = direction;  // -1 | 0 | +1
    }
  }
  