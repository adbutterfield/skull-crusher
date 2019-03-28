/**
 * Class for fire at the bottom of game screen
 * @description Fire effect adapted from: https://www.ssaurel.com/fireeffect/fireeffect.htm
 */

import FireSfx from '../../sounds/fire-1.wav';

export default class Fire {
  constructor(ctx, canvasWidth, canvasHeight) {
    this.fireHeight = 60;
    this.imageData = ctx.createImageData(canvasWidth, this.fireHeight);
    this.data = this.imageData.data;
    this.fire = [];
    this.fire.length = canvasWidth * this.fireHeight;
    this.fire.fill(0);
    this.sfx = new Audio();
    this.sfx.src = FireSfx;
    this.sfx.addEventListener('ended', () => {
      this.sfx.play();
    });
    this.colors = [];
    this.colors.length = 256;
    for (let i = 0; i < 256; i++) {
      let color = [0, 0, 0];
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
      let bottomLine = canvasWidth * (this.fireHeight - 1);
      // draw random pixels at the bottom line
      for (let x = 0; x < canvasWidth; x++) {
        this.fire[bottomLine + x] = Math.random() > 0.5 ? 255 : 0;
      }

      // move flip upwards, start at bottom
      for (let y = 0; y < this.fireHeight; ++y) {
        for (let x = 0; x < canvasWidth; ++x) {
          let value = 0;
          // Update the fire array
          if (x === 0) {
            value =
              (this.fire[bottomLine] +
                this.fire[bottomLine] +
                this.fire[bottomLine - canvasWidth]) /
              3;
          } else if (x === canvasWidth - 1) {
            value =
              (this.fire[bottomLine + x] +
                this.fire[bottomLine - canvasWidth + x] +
                this.fire[bottomLine + x - 1]) /
              3;
          } else {
            value =
              (this.fire[bottomLine + x] +
                this.fire[bottomLine + x + 1] +
                this.fire[bottomLine + x - 1] +
                this.fire[bottomLine - canvasWidth + x]) /
              4;
          }

          this.fire[bottomLine - canvasWidth + x] = Math.floor(
            value > 1 ? value - 1 : value
          );

          // Update the display data
          let skipRows = 2;
          if (y >= skipRows) {
            let index = y * canvasWidth * 4 + x * 4;
            let value = this.fire[(y - skipRows) * canvasWidth + x];
            this.data[index] = this.colors[value][0];
            this.data[++index] = this.colors[value][1];
            this.data[++index] = this.colors[value][2];
            this.data[++index] =
              !this.colors[value][0] &&
              !this.colors[value][1] &&
              this.colors[value][2] <= 255
                ? 0
                : 200;
          }
        }

        bottomLine -= canvasWidth;
      }
    }

    ctx.putImageData(this.imageData, 0, canvasHeight - this.fireHeight);
  }
}
