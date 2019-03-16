/**
 * Class for pause/resume game control component
 */

import config from './config.js';

export default class ControlButton {
  constructor(canvasWidth) {
    this.text = {
      width: 0,
      xPos: canvasWidth - 60,
      yPos: 30
    };
    this.image = {
      xPos: canvasWidth - 50,
      yPos: 12,
      size: 24
    };
  }

  draw(ctx, isPaused) {
    const displayText = isPaused ? 'RESUME' : 'PAUSE';
    this.text.width = ctx.measureText(displayText).width;
    ctx.textAlign = 'end';
    ctx.font = `20px ${config.font}`;
    ctx.fillStyle = config.textColor;
    ctx.fillText(displayText, this.text.xPos, this.text.yPos);
    let img = new Image();
    img.src = `../assets/${isPaused ? 'play' : 'pause'}.svg`;
    ctx.drawImage(
      img,
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

  preloadImages(ctx) {
    let playImg = new Image();
    playImg.src = '../assets/play.svg';
    ctx.drawImage(playImg, -1, -1, 1, 1);
    let pauseImg = new Image();
    pauseImg.src = '../assets/pause.svg';
    ctx.drawImage(pauseImg, -1, -1, 1, 1);
  }
}
