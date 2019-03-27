/**
 * Class representing title screen
 */

import config from '../config.js';
import SpiderWebIcon from '../../images/spider-web.svg';

export default class TitleScreen {
  constructor(canvasWidth, canvasHeight, isSmallScreen) {
    this.centerX = canvasWidth / 2;
    this.spiderWebImg = new Image();
    this.spiderWebImg.height = isSmallScreen ? 120 : 200;
    this.spiderWebImg.width = isSmallScreen ? 120 : 200;
    this.spiderWebImg.src = SpiderWebIcon;
    this.title = {
      size: isSmallScreen ? 50 : 80
    };
    this.title.yPos = canvasHeight / 2 - this.title.size;

    this.subtitle = {
      size: isSmallScreen ? 28 : 34
    };
    this.subtitle.yPos = canvasHeight / 2 + this.subtitle.size;
  }

  load(ctx, isSmallScreen) {
    ctx.textAlign = 'center';

    ctx.font = `${this.title.size}px ${config.titleFont}`;
    ctx.fillStyle = config.textColor;
    ctx.fillText('SKULL CRUSHER', this.centerX, this.title.yPos);

    ctx.font = `${this.subtitle.size}px  ${config.font}`;
    ctx.fillText('Start', this.centerX, this.subtitle.yPos);

    ctx.drawImage(
      this.spiderWebImg,
      isSmallScreen ? -50 : -80,
      isSmallScreen ? -42 : -72,
      isSmallScreen ? 120 : 200,
      isSmallScreen ? 120 : 200
    );
  }
}
