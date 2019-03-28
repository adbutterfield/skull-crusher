/**
 * Class representing the game
 */

import Skull from './skull.js';
import TitleScreen from './screens/title-screen.js';
import Fire from './components/fire.js';
import config from './config.js';

function toggleCanvasOverlay() {
  const canvasOverlayEl = document.getElementById('game-canvas-overlay');
  canvasOverlayEl.classList.toggle('canvas__overlay--active');
}

function toggleHeader() {
  const headerEl = document.getElementById('game-header');
  headerEl.classList.toggle('header--hidden');
}

function updateScore(pointValue) {
  const scoreEl = document.getElementById('game-score');
  scoreEl.dataset.score =
    pointValue !== 0 ? Number(scoreEl.dataset.score) + pointValue : 0;
}

function updateLife(lifePoints) {
  const lifeEl = document.getElementById('game-life');
  lifeEl.style['min-width'] = `${lifePoints}0px`;
}

function getClickPoint(evt) {
  let clickPoint = {};
  if (evt.targetTouches && evt.targetTouches.length === 1) {
    // Touch event is fired before click event.
    // Cancel click event in case of mobile.
    evt.preventDefault();
    const touch = evt.targetTouches[0];
    clickPoint = {
      xPos: touch.pageX,
      yPos: touch.pageY
    };
  } else {
    clickPoint = {
      xPos: evt.offsetX,
      yPos: evt.offsetY
    };
  }
  return clickPoint;
}

export default class Game {
  constructor() {
    // configuration settings
    this.config = {
      isSmallScreen: window.innerWidth < 800,
      headerHeight: 60
    };

    // canvas element
    this.canvas = document.getElementById('game');
    this.canvas.width = this.config.isSmallScreen ? window.innerWidth : 800;
    this.canvas.height = window.innerHeight;
    // canvas context
    this.ctx = this.canvas.getContext('2d');

    // display components
    this.components = {
      fire: new Fire(this.ctx, this.canvas.width, this.canvas.height)
    };

    // skull score to display after destroying
    this.displayScores = {};

    // game screens
    this.screens = {
      titleScreen: new TitleScreen(
        this.canvas.width,
        this.canvas.height,
        this.config.isSmallScreen
      )
    };

    // the skulls
    this.skulls = {};

    // game state
    this.state = {
      currentScreen: 'title',
      isGameTabHidden: false,
      isPaused: false,
      lastSkullCreateTime: 0,
      lastTickTime: 0,
      life: 10,
      pauseTimestamp: 0,
      score: 0,
      skullFallSpeed: 10
    };

    // initialize event listeners
    this.addEventListeners();
  }

  // Events
  gameClickEvents(clickPoint) {
    if (this.state.currentScreen === 'game') {
      // Click event for skulls
      // Don't run check if game is over.
      // Don't run check if paused.
      // Don't need to run check if there's no skulls.
      // Don't allow skulls to pop when clicked in the header.
      if (
        this.state.life > 0 &&
        !this.state.isPaused &&
        Object.keys(this.skulls).length > 0 &&
        clickPoint.yPos > this.config.headerHeight
      ) {
        Object.values(this.skulls).forEach(skull => {
          if (skull.wasClicked(clickPoint)) {
            updateScore(skull.pointValue);
            skull.sfx.crunch.play();
            this.displayScores[skull.id] = {
              id: skull.id,
              pointValue: skull.pointValue,
              xPos: skull.xPos + skull.size / 2,
              yPos: skull.yPos + skull.size / 2,
              time: this.state.lastTickTime
            };
            delete this.skulls[skull.id];
          }
        });
      }
    }
  }

  titleScreenClickEvents() {
    if (this.state.currentScreen === 'title') {
      this.state.currentScreen = 'game';
      toggleHeader();
      this.components.fire.sfx.play();
      this.components.fire.sfx.volume = 1;
    }
  }

  visibilityChangeEvent() {
    // Event for when tab loses focus
    document.addEventListener('visibilitychange', () => {
      this.state.isGameTabHidden = document.hidden;
      if (
        this.state.currentScreen === 'game' &&
        this.state.life > 0 &&
        !this.state.isPaused
      ) {
        this.state.isPaused = true;
        this.state.pauseTimestamp = this.state.lastTickTime;
        this.components.fire.sfx.pause();
        const gameControlsEl = document.getElementById('game-controls');
        gameControlsEl.classList.toggle('play-control--paused');
        toggleCanvasOverlay();
      }
      if (this.state.life === 0) {
        this.state.isGameTabHidden
          ? this.components.fire.sfx.pause()
          : this.components.fire.sfx.play();
      }
    });
  }

  speedSliderEvent() {
    // Click event for the speed slider control
    const speedSliderBarEl = document.getElementById(
      'game-speed-control-slider'
    );
    speedSliderBarEl.addEventListener('input', evt => {
      this.state.skullFallSpeed = speedSliderBarEl.value;
    });
  }

  playControlEvent() {
    // Click event for the pause/resume button
    const gameControlsEl = document.getElementById('game-controls');
    gameControlsEl.addEventListener('click', () => {
      if (this.state.life > 0) {
        gameControlsEl.classList.toggle('play-control--paused');
        this.state.isPaused = !this.state.isPaused;
        toggleCanvasOverlay();
        if (this.state.isPaused) {
          this.state.pauseTimestamp = this.state.lastTickTime;
          this.components.fire.sfx.pause();
        } else {
          this.components.fire.sfx.play();
        }
      }
    });
  }

  addEventListeners() {
    this.visibilityChangeEvent();
    this.speedSliderEvent();
    this.playControlEvent();

    this.canvas.addEventListener('touchstart', evt => {
      this.titleScreenClickEvents();
      this.gameClickEvents(getClickPoint(evt));
    });

    this.canvas.addEventListener('click', evt => {
      this.titleScreenClickEvents();
      this.gameClickEvents(getClickPoint(evt));
    });
  }

  createSkull() {
    const newSkull = new Skull(
      this.canvas.width,
      this.config.headerHeight,
      this.state.lastTickTime
    );
    this.skulls[newSkull.id] = newSkull;
  }

  addSkulls() {
    // Add a new skull every second
    if (this.state.lastTickTime - this.state.lastSkullCreateTime >= 1000) {
      const skulls = Object.values(this.skulls);
      if (skulls.length === 0) {
        this.createSkull();
      } else {
        const lastSkull = skulls[skulls.length - 1];
        // Avoid adding skulls on top of each other.
        if (lastSkull && lastSkull.yPos >= lastSkull.size) {
          this.createSkull();
        }
      }
      this.state.lastSkullCreateTime = this.state.lastTickTime;
    }
  }

  updateSkulls() {
    Object.values(this.skulls).forEach(skull => {
      skull.move(
        this.state.skullFallSpeed,
        this.state.lastTickTime,
        this.state.isPaused,
        this.state.pauseTimestamp
      );
      // Remove if out of bounds
      if (skull.yPos >= this.canvas.height + skull.size) {
        skull.sfx.burn.play();
        delete this.skulls[skull.id];
        this.state.life -= 1;
        updateLife(this.state.life);
        if (!this.state.life) {
          this.state.gameOverTime = this.state.lastTickTime;
        }
      }
    });
  }

  drawScores() {
    Object.values(this.displayScores).forEach(score => {
      if (this.state.lastTickTime - score.time <= 500) {
        this.ctx.textAlign = 'start';
        this.ctx.font = `20px ${config.font}`;
        this.ctx.fillStyle = config.scoreColor;
        this.ctx.fillText(`+${score.pointValue}`, score.xPos, score.yPos);
      } else {
        delete this.displayScores[score.id];
      }
    });
  }

  runGame() {
    if (this.state.isPaused) {
      this.components.fire.sfx.pause();
    } else if (!this.components.fire.sfx.played.length) {
      // Start fire sfx if it has not yet
      this.components.fire.sfx.play();
    }

    // Draw components and skulls
    this.components.fire.draw(
      this.ctx,
      this.canvas.width,
      this.canvas.height,
      this.state.isPaused
    );
    Object.values(this.skulls).forEach(skull => {
      skull.draw(this.ctx);
    });
    if (this.state.life === 0) {
      this.gameOver();
    }
    this.drawScores();
  }

  resetGameState() {
    this.state.skullFallSpeed = 10;
    this.skulls = {};
    this.state.life = 10;
    updateLife(this.state.life);
    this.state.score = 0;
    updateScore(0);
    this.state.isPaused = false;
    // Reset the speed slider
    const speedSliderBarEl = document.getElementById(
      'game-speed-control-slider'
    );
    speedSliderBarEl.value = 10;
  }

  gameOver() {
    this.ctx.textAlign = 'center';
    const fontHeight = this.config.isSmallScreen ? 50 : 80;
    this.ctx.font = `${fontHeight}px ${config.titleFont}`;
    this.ctx.fillStyle = '#bb0a1e';
    this.ctx.fillText(
      'GAME OVER',
      this.canvas.width / 2,
      this.canvas.height / 2 - fontHeight
    );
    if (this.state.isGameTabHidden) {
      this.state.gameOverTime +=
        this.state.lastTickTime - this.state.gameOverTime;
    }
    if (this.state.lastTickTime - this.state.gameOverTime >= 5000) {
      // Reset game state
      this.resetGameState();
      // Mute the fire sfx
      this.components.fire.sfx.volume = 0;
      // Remove the header
      toggleHeader();
      // Go back to title screen
      this.state.currentScreen = 'title';
    }
  }

  update() {
    if (this.state.currentScreen === 'game' && this.state.life > 0) {
      this.updateSkulls();
      if (!this.state.isPaused) {
        this.addSkulls();
      }
    }
  }

  render() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    switch (this.state.currentScreen) {
      case 'game': {
        this.runGame();
        break;
      }
      default: {
        this.screens.titleScreen.load(this.ctx, this.config.isSmallScreen);
      }
    }
  }

  run(dTime) {
    // Floor the delta to avoid float based math, and make animation smoother
    this.state.lastTickTime = Math.floor(dTime);
    window.requestAnimationFrame(dTime => this.run(dTime));
    this.update();
    this.render();
  }
}
