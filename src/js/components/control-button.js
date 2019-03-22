/**
 * Class for pause/resume game control component
 */

import config from '../config.js';
import PlayIcon from '../../images/play.svg';
import PauseIcon from '../../images/pause.svg';

export default class ControlButton {
  constructor(canvasWidth) {
    this.text = {
      width: 0,
      xPos: canvasWidth - 115,
      yPos: 30
    };
    this.image = {
      xPos: canvasWidth - 105,
      yPos: 14,
      size: 18
    };
    this.playImg = new Image();
    this.playImg.height = this.image.size;
    this.playImg.width = this.image.size;
    this.playImg.src = PlayIcon;
    this.pauseImg = new Image();
    this.pauseImg.height = this.image.size;
    this.pauseImg.width = this.image.size;
    this.pauseImg.src = PauseIcon;
  }

  draw(ctx, isPaused) {
    const displayText = isPaused ? 'RESUME' : 'PAUSE';
    this.text.width = ctx.measureText(displayText).width;
    ctx.textAlign = 'end';
    ctx.font = `20px ${config.font}`;
    ctx.fillStyle = config.textColor;
    ctx.fillText(displayText, this.text.xPos, this.text.yPos);
    ctx.drawImage(
      isPaused ? this.playImg : this.pauseImg,
      this.image.xPos,
      this.image.yPos,
      this.image.size,
      this.image.size
    );
  }

  wasClicked(clickPoint) {
    return (
      clickPoint.xPos >= this.text.xPos - this.text.width &&
      clickPoint.xPos <= this.image.xPos + this.image.size &&
      clickPoint.yPos >= this.image.yPos &&
      clickPoint.yPos <= this.image.yPos + this.image.size
    );
  }
}
