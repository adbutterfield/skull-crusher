/**
 * Class for header component
 */

import config from '../config.js';

export default class Header {
  constructor(canvasWidth, height) {
    this.xPos = 0;
    this.yPos = 0;
    this.width = canvasWidth;
    this.height = height;
  }

  draw(ctx, canvasWidth) {
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);

    ctx.strokeStyle = config.textColor;
    ctx.moveTo(this.xPos, this.height);
    ctx.lineTo(this.width, this.height);
    ctx.stroke();
  }
}
