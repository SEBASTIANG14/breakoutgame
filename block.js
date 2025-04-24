class Block {
    // x,y: posición; w,h: dimensiones; hits: golpes que aguanta
    constructor(x, y, w, h, hits) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.hits = hits;       // contador de impactos restantes
      this.destroyed = false; // si ya fue roto
    }
  
    // show(): dibuja el bloque con color según hits
    show() {
      if (this.destroyed) return;
      let col;
      if (this.hits >= 3)      col = [255, 0, 0];    // rojo
      else if (this.hits === 2) col = [255, 165, 0];  // naranja
      else                      col = [0, 255, 0];    // verde
      fill(...col);
      rect(this.x, this.y, this.w, this.h);
    }
  }
  