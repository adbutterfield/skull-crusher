import Game from './game.js';

function preloadImages(cb) {
  const imagesToPreload = [
    '/assets/spider-web.svg',
    '/assets/skull.svg',
    '/assets/play.svg',
    '/assets/pause.svg'
  ];
  const images = [];
  for (let i = 0; i < imagesToPreload.length; i++) {
    images[i] = new Image();
    images[i].src = imagesToPreload[i];
  }
  images[images.length - 1].onload = () => {
    cb();
  };
}

const game = new Game();

preloadImages(() => {
  // Kick off main game loop
  game.run(window.performance.now());
});
