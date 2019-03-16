/**
 * Class representing title screen
 */

import config from '../config.js';

export default class TitleScreen {
  constructor(ctx, canvasWidth, isSmallScreen) {
    this.centerX = canvasWidth / 2;
    this.title = {
      text: 'SKULL CRUSHER',
      size: isSmallScreen ? 40 : 60,
      yPos: isSmallScreen ? 100 : 150
    };
    this.modeLabel = {
      text: 'Mode',
      size: isSmallScreen ? 40 : 50,
      xPos: this.centerX,
      yPos: isSmallScreen ? 200 : 300
    };
    this.selectionTextSize = isSmallScreen ? 20 : 26;
    this.arrow = {
      text: '►',
      xPos: isSmallScreen ? this.centerX - 40 : this.centerX - 60,
      yPos: isSmallScreen ? 240 : 340
    };
    this.skull = {
      xPos: this.centerX - 40,
      yPos: 254
    };
    this.mode1 = {
      text: 'BASIC',
      xPos: isSmallScreen ? this.centerX : this.centerX - 20,
      yPos: isSmallScreen ? 240 : 340
    };
    this.mode1.width = ctx.measureText(this.mode1.text).width * 2;
    this.mode2 = {
      text: 'CHALLENGE',
      xPos: isSmallScreen ? this.centerX : this.centerX - 20,
      yPos: isSmallScreen ? 270 : 380
    };
    this.mode2.width = ctx.measureText(this.mode2.text).width * 2;
  }

  modeWasTouched(clickPoint) {
    const basicWasTouched =
      clickPoint.xPos >= this.mode1.xPos &&
      clickPoint.xPos <= this.mode1.xPos + this.mode1.width &&
      clickPoint.yPos <= this.mode1.yPos &&
      clickPoint.yPos >= this.mode1.yPos - this.selectionTextSize;

    const challengeWasTouched =
      clickPoint.xPos >= this.mode2.xPos &&
      clickPoint.xPos <= this.mode2.xPos + this.mode2.width &&
      clickPoint.yPos <= this.mode2.yPos &&
      clickPoint.yPos >= this.mode2.yPos - this.selectionTextSize;

    return {
      wasTouched: basicWasTouched || challengeWasTouched,
      mode: challengeWasTouched ? 'challenge' : 'basic'
    };
  }

  load(ctx, currentMode, isSmallScreen) {
    ctx.textAlign = 'center';

    ctx.font = `${this.title.size}px ${config.font}`;
    ctx.fillStyle = config.textColor;
    ctx.fillText(this.title.text, this.centerX, this.title.yPos);

    ctx.font = `${this.modeLabel.size}px ${config.font}`;
    ctx.fillText(this.modeLabel.text, this.modeLabel.xPos, this.modeLabel.yPos);

    ctx.textAlign = 'start';
    ctx.font = `${this.selectionTextSize}px ${config.font}`;
    ctx.fillText(this.arrow.text, this.arrow.xPos, this.arrow.yPos);
    ctx.fillText(this.mode1.text, this.mode1.xPos, this.mode1.yPos);
    ctx.fillText(this.mode2.text, this.mode2.xPos, this.mode2.yPos);

    if (isSmallScreen) {
      let img = new Image();
      img.src = '../assets/skull.svg';
      ctx.drawImage(
        img,
        this.skull.xPos,
        this.skull.yPos,
        this.selectionTextSize,
        this.selectionTextSize
      );
    }
  }
}
