/**
 * Class for score display component
 */

import config from './config.js';

export default class ScoreDisplay {
  constructor() {
    this.label = {
      xPos: 20,
      yPos: 30
    };
    this.score = {
      xPos: 90,
      yPos: 30
    };
  }
  draw(ctx, score) {
    ctx.textAlign = 'start';
    // Score label
    ctx.font = `20px ${config.font}`;
    ctx.fillStyle = config.textColor;
    ctx.fillText('SCORE', this.label.xPos, this.label.yPos);
    // Score
    ctx.fillStyle = config.scoreColor;
    ctx.fillText(score, this.score.xPos, this.score.yPos);
  }
}
