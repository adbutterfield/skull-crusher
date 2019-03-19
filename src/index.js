import Game from './game.js';
import './style.scss';

const game = new Game();

// Kick off main game loop
const firstGameTime = window.performance.now();
game.state.lastSkullCreateTime = firstGameTime;
game.run(firstGameTime);
