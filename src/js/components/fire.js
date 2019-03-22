/**
 * Class for fire at the bottom of game screen
 * @description Fire effect borrowed from: https://www.ssaurel.com/fireeffect/fireeffect.htm
 */

import FireSfx from '../../sounds/fire-1.wav';
const FIRE_HEIGHT = 57;

export default class Fire {
  constructor(ctx, canvasWidth, canvasHeight) {
    this.threshold = 0.5;
    this.imageData = ctx.createImageData(canvasWidth, FIRE_HEIGHT);
    this.data = this.imageData.data;
    this.fire = [];
    this.fire.length = canvasWidth * FIRE_HEIGHT;
    this.fire.fill(0);
    this.sfx = new Audio();
    this.sfx.src = FireSfx;
    this.colors = [];
    this.colors.length = 256;
    for (let i = 0; i < 256; i++) {
      let color = [];
      color[0] = color[1] = color[2] = color[3] = 0;
      this.colors[i] = color;
    }

    for (let i = 0; i < 32; ++i) {
      this.colors[i][2] = i << 1;
      this.colors[i + 32][0] = i << 3;
      this.colors[i + 32][2] = 64 - (i << 1);
      this.colors[i + 64][0] = 255;
      this.colors[i + 64][1] = i << 3;
      this.colors[i + 96][0] = 255;
      this.colors[i + 96][1] = 255;
      this.colors[i + 96][2] = i << 2;
      this.colors[i + 128][0] = 255;
      this.colors[i + 128][1] = 255;
      this.colors[i + 128][2] = 64 + (i << 2);
      this.colors[i + 160][0] = 255;
      this.colors[i + 160][1] = 255;
      this.colors[i + 160][2] = 128 + (i << 2);
      this.colors[i + 192][0] = 255;
      this.colors[i + 192][1] = 255;
      this.colors[i + 192][2] = 192 + i;
      this.colors[i + 224][0] = 255;
      this.colors[i + 224][1] = 255;
      this.colors[i + 224][2] = 224 + i;
    }
  }

  draw(ctx, canvasWidth, canvasHeight, isPaused) {
    if (!isPaused) {
      let bottomLine = canvasWidth * (FIRE_HEIGHT - 1);
      // draw random pixels at the bottom line
      for (let x = 0; x < canvasWidth; x++) {
        let value = 0;

        if (Math.random() > this.threshold) value = 255;

        this.fire[bottomLine + x] = value;
      }

      // move flip upwards, start at bottom
      let value = 0;

      for (let y = 0; y < FIRE_HEIGHT; ++y) {
        for (let x = 0; x < canvasWidth; ++x) {
          if (x === 0) {
            value = this.fire[bottomLine];
            value += this.fire[bottomLine];
            value += this.fire[bottomLine - canvasWidth];
            value /= 3;
          } else if (x === canvasWidth - 1) {
            value = this.fire[bottomLine + x];
            value += this.fire[bottomLine - canvasWidth + x];
            value += this.fire[bottomLine + x - 1];
            value /= 3;
          } else {
            value = this.fire[bottomLine + x];
            value += this.fire[bottomLine + x + 1];
            value += this.fire[bottomLine + x - 1];
            value += this.fire[bottomLine - canvasWidth + x];
            value /= 4;
          }

          if (value > 1) value -= 1;

          value = Math.floor(value);
          let index = bottomLine - canvasWidth + x;
          this.fire[index] = value;
        }

        bottomLine -= canvasWidth;
      }
    }

    let skipRows = 2; // skip the bottom 2 rows
    // render the flames using our color table
    for (let y = skipRows; y < FIRE_HEIGHT; ++y) {
      for (let x = 0; x < canvasWidth; ++x) {
        let index = y * canvasWidth * 4 + x * 4;
        let value = this.fire[(y - skipRows) * canvasWidth + x];
        this.data[index] = this.colors[value][0];
        this.data[++index] = this.colors[value][1];
        this.data[++index] = this.colors[value][2];
        this.data[++index] = 255;
      }
    }
    ctx.putImageData(this.imageData, 0, canvasHeight - FIRE_HEIGHT);
  }
}
