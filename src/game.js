/**
 * Class representing the game
 */

import Skull from './skull.js';
import TitleScreen from './screens/title-screen.js';
import Header from './components/header.js';
import ControlButton from './components/control-button.js';
import ScoreDisplay from './components/score-display.js';
import SpeedSlider from './components/speed-slider.js';
import Fire from './components/fire.js';
import LifeGauge from './components/life-gauge.js';
import config from './config.js';

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

function skullWasClicked(clickPoint, skull) {
  return (
    (clickPoint.xPos - (skull.xPos + skull.size / 2)) ** 2 +
      (clickPoint.yPos - (skull.yPos + skull.size / 2)) ** 2 <
    (skull.size / 2) ** 2
  );
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
      controlButton: new ControlButton(this.canvas.width),
      header: new Header(this.canvas.width, this.config.headerHeight),
      fire: new Fire(this.ctx, this.canvas.width, this.canvas.height),
      scoreDisplay: new ScoreDisplay(),
      speedSlider: new SpeedSlider(this.canvas.width),
      lifeGauge: new LifeGauge(this.ctx)
    };

    // skull score to display after destroying
    this.displayScores = {};

    // game screens
    this.screens = {
      titleScreen: new TitleScreen(this.canvas.width, this.config.isSmallScreen)
    };

    // the skulls
    this.skulls = {};

    // game state
    this.state = {
      clickPoint: {},
      currentScreen: 'title',
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
      // Click event for the pause/resume button
      if (
        this.state.life > 0 &&
        this.components.controlButton.wasClicked(clickPoint)
      ) {
        this.state.isPaused = !this.state.isPaused;
        this.state.pauseTimestamp = this.state.isPaused
          ? this.state.lastTickTime
          : 0;
      }
      // Click event for the speed adjustment slider
      if (this.components.speedSlider.barWasClicked(clickPoint)) {
        this.components.speedSlider.moveToPointOnBar(clickPoint.xPos);
        this.state.skullFallSpeed = this.components.speedSlider.getSkullFallSpeed();
      }

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
          if (skullWasClicked(clickPoint, skull)) {
            this.state.score += skull.pointValue;
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

  gameMouseDownEvents(clickPoint) {
    if (this.state.currentScreen === 'game') {
      if (this.components.speedSlider.wasClicked(clickPoint)) {
        this.components.speedSlider.isSliding = true;
      }
    }
  }

  gameMouseMoveEvents(evt) {
    if (this.state.currentScreen === 'game') {
      if (this.components.speedSlider.isSliding) {
        this.state.clickPoint = getClickPoint(evt);
        this.components.speedSlider.updateSlider(this.state.clickPoint.xPos);
        this.state.skullFallSpeed = this.components.speedSlider.getSkullFallSpeed();
      }
    }
  }

  gameMouseUpEvents(evt) {
    if (this.state.currentScreen === 'game') {
      if (this.components.speedSlider.isSliding) {
        this.components.speedSlider.isSliding = false;
      }
    }
  }

  addEventListeners() {
    if (this.state.currentScreen === 'title') {
      document.onkeydown = evt => {
        if (evt.keyCode === 13) {
          // Reset the fire sfx
          this.components.fire.sfx.volume = 1;
          this.state.currentScreen = 'game';
        }
      };
      this.canvas.addEventListener('touchstart', evt => {
        this.state.currentScreen = 'game';
      });
    }
    this.canvas.addEventListener('click', evt => {
      this.gameClickEvents(this.state.clickPoint);
    });
    this.canvas.addEventListener('mousedown', evt => {
      this.state.clickPoint = getClickPoint(evt);
      this.gameMouseDownEvents(this.state.clickPoint);
    });
    this.canvas.addEventListener('touchstart', evt => {
      this.state.clickPoint = getClickPoint(evt);
      this.gameClickEvents(this.state.clickPoint);
      this.gameMouseDownEvents(this.state.clickPoint);
    });
    this.canvas.addEventListener('mousemove', evt => {
      this.gameMouseMoveEvents(evt);
    });
    this.canvas.addEventListener('touchmove', evt => {
      this.gameMouseMoveEvents(evt);
    });
    this.canvas.addEventListener('mouseup', evt => {
      this.gameMouseUpEvents(evt);
    });
    this.canvas.addEventListener('touchend', evt => {
      this.gameMouseUpEvents(evt);
    });
  }

  createSkull() {
    return new Skull(
      this.canvas.width,
      this.config.headerHeight,
      this.state.lastTickTime
    );
  }

  addSkulls() {
    if (
      this.state.currentScreen === 'game' &&
      this.state.life > 0 &&
      !this.state.isPaused
    ) {
      if (this.state.lastTickTime - this.state.lastSkullCreateTime >= 1000) {
        const skulls = Object.values(this.skulls);
        if (skulls.length === 0) {
          const newSkull = this.createSkull();
          this.skulls[newSkull.id] = newSkull;
        }
        const lastSkull = skulls[skulls.length - 1];
        // Don't add skulls on top of each other.
        if (lastSkull && lastSkull.yPos >= lastSkull.size) {
          const newSkull = this.createSkull();
          this.skulls[newSkull.id] = newSkull;
        }
        this.state.lastSkullCreateTime = this.state.lastTickTime;
      }
    }
  }

  updateSkulls() {
    Object.values(this.skulls).forEach(skull => {
      if (this.state.currentScreen === 'game') {
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
          if (!this.state.life) {
            this.state.gameOverTime = this.state.lastTickTime;
          }
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

  startGame() {
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
    this.components.header.draw(this.ctx, this.canvas.width);
    this.components.scoreDisplay.draw(this.ctx, this.state.score);
    this.components.speedSlider.draw(this.ctx);
    this.components.controlButton.draw(this.ctx, this.state.isPaused);
    this.components.lifeGauge.draw(this.ctx, this.state.life);
  }

  gameOver() {
    this.ctx.textAlign = 'center';
    this.ctx.font = `${this.config.isSmallScreen ? '40px' : '80px'} Creepster`;
    this.ctx.fillStyle = '#bb0a1e';
    this.ctx.fillText(
      'GAME OVER',
      this.canvas.width / 2,
      this.config.isSmallScreen ? 200 : 300
    );
    if (this.state.lastTickTime - this.state.gameOverTime >= 5000) {
      // Reset game state
      this.state.skullFallSpeed = 10;
      this.skulls = {};
      this.state.life = 10;
      this.state.score = 0;
      this.state.isPaused = false;
      // Reset the speed slider
      this.components.speedSlider.reset();
      // Mute the fire sfx
      this.components.fire.sfx.volume = 0;
      // Go back to title screen
      this.state.currentScreen = 'title';
    }
  }

  update() {
    if (this.state.life > 0) {
      this.updateSkulls();
      this.addSkulls();
    }
  }

  render() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    switch (this.state.currentScreen) {
      case 'game': {
        this.startGame();
        if (this.state.isPaused) {
          this.components.fire.sfx.pause();
        } else {
          this.components.fire.sfx.play();
        }
        break;
      }
      default: {
        this.screens.titleScreen.load(this.ctx, this.config.isSmallScreen);
      }
    }
  }

  run(dTime) {
    this.state.lastTickTime = dTime;
    window.requestAnimationFrame(dTime => this.run(dTime));
    this.update();
    this.render();
  }
}
