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

    ctx.font = `${isSmallScreen ? '40px' : '60px'} ${config.font}`;
    ctx.fillStyle = config.textColor;
    ctx.fillText('SKULL CRUSHER', this.centerX, `${isSmallScreen ? 100 : 150}`);

    ctx.font = `${isSmallScreen ? '28px' : '40px'} ${config.font}`;
    ctx.fillText('Start', this.centerX, `${isSmallScreen ? 200 : 400}`);

    ctx.font = `${isSmallScreen ? '20px' : '30px'} ${config.font}`;
    ctx.fillText(
      'TAP or PRESS ENTER',
      this.centerX,
      `${isSmallScreen ? 240 : 440}`
    );
  }
}
