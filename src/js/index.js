import Game from './game.js';
import spiderWebImg from '../images/spider-web.svg';
import skullImg from '../images/skull.svg';
import playImg from '../images/play.svg';
import pauseImg from '../images/pause.svg';
import '../styles/main.scss';

function preloadImages(cb) {
  const imagesToPreload = [spiderWebImg, skullImg, playImg, pauseImg];
  const images = [];
  imagesToPreload.forEach((image, index) => {
    images[index] = new Image();
    images[index].src = image;
  });
  images[images.length - 1].addEventListener('load', () => {
    cb();
  });
}

const game = new Game();

preloadImages(() => {
  // Ensure a fresh game state
  game.resetGameState();
  // Kick off main game loop
  const firstGameTime = window.performance.now();
  game.state.lastSkullCreateTime = firstGameTime;
  game.run(firstGameTime);
});
