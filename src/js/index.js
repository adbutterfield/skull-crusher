import Game from './game.js';
import '../styles/main.scss';

const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  // Kick off main game loop
  const firstGameTime = window.performance.now();
  game.state.lastSkullCreateTime = firstGameTime;
  game.run(firstGameTime);
});
