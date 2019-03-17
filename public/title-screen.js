/**
 * Class representing title screen
 */

import config from './config.js';

export default class TitleScreen {
  constructor(canvasWidth) {
    this.centerX = canvasWidth / 2;
  }

  load(ctx, isSmallScreen) {
    ctx.textAlign = 'center';

    ctx.font = `${isSmallScreen ? '40px' : '80px'} Creepster`;
    ctx.fillStyle = config.textColor;
    ctx.fillText('SKULL CRUSHER', this.centerX, isSmallScreen ? 100 : 200);

    ctx.font = `${isSmallScreen ? '28px' : '34px'} ${config.font}`;
    ctx.fillText('Start', this.centerX, isSmallScreen ? 200 : 400);

    ctx.font = `${isSmallScreen ? '20px' : '26px'} ${config.font}`;
    ctx.fillText(
      'TAP or PRESS ENTER',
      this.centerX,
      `${isSmallScreen ? 240 : 440}`
    );

    let img = new Image();
    img.src = '../assets/spider-web.svg';
    ctx.drawImage(
      img,
      isSmallScreen ? -40 : -80,
      isSmallScreen ? -36 : -72,
      isSmallScreen ? 100 : 200,
      isSmallScreen ? 100 : 200
    );
  }
}
