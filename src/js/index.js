import Game from './game.js';
import spiderWebImg from '../images/spider-web.svg';
import skullImg from '../images/skull.svg';
import playImg from '../images/play.svg';
import pauseImg from '../images/pause.svg';
import '../styles/main.scss';

function preloadImages(cb) {
  const imagesToPreload = [spiderWebImg, skullImg, playImg, pauseImg];
  const images = [];
  for (let i = 0; i < imagesToPreload.length; i++) {
    images[i] = new Image();
    images[i].src = imagesToPreload[i];
  }
  images[images.length - 1].addEventListener('load', () => {
    cb();
  });
}

const game = new Game();

preloadImages(() => {
  // Kick off main game loop
  const firstGameTime = window.performance.now();
  game.state.lastSkullCreateTime = firstGameTime;
  game.run(firstGameTime);
});
