/**
 * Class for life gauge component
 */

import config from '../config.js';

export default class SpeedSlider {
  constructor(ctx) {
    this.label = {
      xPos: 20,
      yPos: 50,
      height: 14,
      width: ctx.measureText('LIFE').width + 10
    };
  }

  draw(ctx, life) {
    ctx.textAlign = 'start';
    ctx.font = `${this.label.height}px ${config.font}`;
    ctx.fillStyle = config.textColor;
    ctx.fillText('LIFE', this.label.xPos, this.label.yPos);
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i < life ? '#ffffff' : '#bb0a1e';
      ctx.fillRect(
        this.label.xPos + this.label.width + 10 + i * 10,
        this.label.yPos - 11,
        6,
        this.label.height - 2
      );
    }
  }
}
