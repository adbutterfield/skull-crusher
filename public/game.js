/**
 * Class representing the game
 */

import Skull from './skull.js';
import TitleScreen from './title-screen.js';
import Header from './header.js';
import ControlButton from './control-button.js';
import ScoreDisplay from './score-display.js';
import SpeedSlider from './speed-slider.js';
import Fire from './fire.js';

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
      speedSlider: new SpeedSlider()
    };

    // game screens
    this.screens = {
      titleScreen: new TitleScreen(this.canvas.width)
    };

    // the skulls
    this.skulls = {};

    // game state
    this.state = {
      clickPoint: {},
      currentScreen: 'title',
      isPaused: false,
      lastTickTime: 0,
      pauseTimestamp: 0,
      score: 0,
      skullFallSpeed: 10
    };

    // initialize event listeners
    this.addEventListeners();
    // Start skull factory
    this.addSkulls();
  }

  // Events
  gameClickEvents(clickPoint) {
    if (this.state.currentScreen === 'game') {
      // Click event for the pause/resume button
      if (this.components.controlButton.wasClicked(clickPoint)) {
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
      // Don't run check if paused.
      // Don't need to run check if there's no skulls.
      // Don't allow skulls to pop when clicked in the header.
      if (
        !this.state.isPaused &&
        Object.keys(this.skulls).length > 0 &&
        clickPoint.yPos > this.config.headerHeight
      ) {
        Object.values(this.skulls).forEach(skullClone => {
          if (skullWasClicked(clickPoint, skullClone)) {
            this.state.score += skullClone.pointValue;
            skullClone.sfx.play();
            delete this.skulls[skullClone.id];
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
    setInterval(() => {
      if (this.state.currentScreen === 'game' && !this.state.isPaused) {
        const skulls = Object.values(this.skulls);
        if (skulls.length === 0) {
          const newSkull = this.createSkull();
          this.skulls[newSkull.id] = newSkull;
        }
        const lastSkull = skulls[skulls.length - 1];
        // Don't add skulls on top of each other.
        // And add some randomness to rate of fall.
        if (lastSkull && lastSkull.yPos >= lastSkull.size) {
          const newSkull = this.createSkull();
          this.skulls[newSkull.id] = newSkull;
        }
      }
    }, 1000);
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
          delete this.skulls[skull.id];
        }
      }
    });
  }

  startGame() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    this.components.header.draw(this.ctx, this.canvas.width);
    this.components.scoreDisplay.draw(this.ctx, this.state.score);
    this.components.speedSlider.draw(this.ctx);
    this.components.controlButton.draw(this.ctx, this.state.isPaused);
  }

  update() {
    this.updateSkulls();
  }

  render() {
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
