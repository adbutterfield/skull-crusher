/**
 * Class representing title screen
 */

import config from '../config.js';
import SpiderWebIcon from '../images/spider-web.svg';

export default class TitleScreen {
  constructor(canvasWidth, isSmallScreen) {
    this.centerX = canvasWidth / 2;
    this.spiderWebImg = new Image();
    this.spiderWebImg.height = isSmallScreen ? 120 : 200;
    this.spiderWebImg.width = isSmallScreen ? 120 : 200;
    this.spiderWebImg.src = SpiderWebIcon;
  }

  load(ctx, isSmallScreen) {
    ctx.textAlign = 'center';

    ctx.font = `${isSmallScreen ? '40px' : '80px'} Creepster`;
    ctx.fillStyle = config.textColor;
    ctx.fillText('SKULL CRUSHER', this.centerX, isSmallScreen ? 140 : 200);

    ctx.font = `${isSmallScreen ? '28px' : '34px'} ${config.font}`;
    ctx.fillText('Start', this.centerX, isSmallScreen ? 220 : 400);

    ctx.font = `${isSmallScreen ? '20px' : '26px'} ${config.font}`;
    ctx.fillText(
      'TAP or PRESS ENTER',
      this.centerX,
      `${isSmallScreen ? 260 : 440}`
    );

    ctx.drawImage(
      this.spiderWebImg,
      isSmallScreen ? -50 : -80,
      isSmallScreen ? -42 : -72,
      isSmallScreen ? 120 : 200,
      isSmallScreen ? 120 : 200
    );
  }
}
