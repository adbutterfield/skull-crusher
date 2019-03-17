/**
 * Class for speed slider component
 */

import config from '../config.js';

export default class SpeedSlider {
  constructor(canvasWidth) {
    this.label = {
      xPos: canvasWidth - 175,
      yPos: 50,
      height: 14
    };
    this.dot = {
      xPos: canvasWidth - 120,
      yPos: 45,
      size: 5
    };
    this.line = {
      xPosStart: canvasWidth - 120,
      xPosEnd: canvasWidth - 20,
      yPos: 45
    };
    this.fillStyle = config.textColor;
    this.strokeStyle = config.textColor;
    this.isSliding = false;
    this.textHeight = 0;
  }

  draw(ctx) {
    ctx.textAlign = 'start';
    // Speed slider label
    ctx.font = `${this.label.height}px ${config.font}`;
    ctx.fillStyle = config.textColor;
    ctx.fillText('SPEED', this.label.xPos, this.label.yPos);
    ctx.beginPath();
    // Speed slider dot
    ctx.arc(this.dot.xPos, this.dot.yPos, this.dot.size, 0, Math.PI * 2, false);
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
    // Speed slider line
    ctx.moveTo(this.line.xPosStart, this.line.yPos);
    ctx.lineTo(this.line.xPosEnd, this.line.yPos);
    ctx.stroke();
  }

  wasClicked(clickPoint) {
    return (
      (clickPoint.xPos - this.dot.xPos) ** 2 +
        (clickPoint.yPos - this.dot.yPos) ** 2 <
      (this.dot.size * 2) ** 2
    );
  }

  updateSlider(newXPos) {
    if (
      this.isSliding &&
      newXPos >= this.line.xPosStart &&
      newXPos <= this.line.xPosEnd
    ) {
      this.dot.xPos = newXPos;
    }
  }

  moveToPointOnBar(newXPos) {
    this.dot.xPos = newXPos;
  }

  barWasClicked(clickPoint) {
    return (
      clickPoint.yPos >= this.label.yPos - this.label.height / 2 &&
      clickPoint.yPos <= this.label.yPos + this.label.height / 2 &&
      clickPoint.xPos >= this.line.xPosStart &&
      clickPoint.xPos <= this.line.xPosEnd
    );
  }

  getSkullFallSpeed() {
    const percent = Math.floor(
      ((this.dot.xPos - this.line.xPosStart) /
        (this.line.xPosEnd - this.line.xPosStart)) *
        100
    );
    const range = this.line.xPosEnd - this.line.xPosStart;
    const value = Math.floor((percent / 100) * 90) + 10;
    return value;
  }
}
