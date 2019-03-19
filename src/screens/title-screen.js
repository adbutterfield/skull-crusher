/**
 * Class representing title screen
 */

import config from '../config.js';
import SpiderwebIcon from '../images/spider-web.svg';

export default class TitleScreen {
  constructor(canvasWidth) {
    this.centerX = canvasWidth / 2;
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

    let img = new Image();
    img.height = isSmallScreen ? 120 : 200;
    img.width = isSmallScreen ? 120 : 200;
    img.src = SpiderwebIcon;
    ctx.drawImage(
      img,
      isSmallScreen ? -50 : -80,
      isSmallScreen ? -42 : -72,
      isSmallScreen ? 120 : 200,
      isSmallScreen ? 120 : 200
    );
  }
}
