/**
 * Class representing a skull
 */
import SkullIcon from '../images/skull.svg';
import CrunchSfx from '../sounds/crunch02.mp3';
import BurnSfx from '../sounds/burn.wav';

function getRandomInt(maxValue) {
  return Math.ceil(Math.random() * Math.floor(maxValue));
}

function getRandomIntInRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getXPosition(size, canvasWidth) {
  const edgeOffset = 14;
  return getRandomIntInRange(
    edgeOffset + size,
    canvasWidth - size - edgeOffset
  );
}

function getPointValue(size) {
  const maxPoints = 10;
  return maxPoints - size / 10 + 1;
}

let skullId = 0;

class Skull {
  constructor(canvasWidth, headerHeight, lastTickTime) {
    this.id = skullId++;
    this.size = getRandomInt(10) * 10;
    this.pointValue = getPointValue(this.size);
    this.xPos = getXPosition(this.size, canvasWidth);
    this.yPos = headerHeight - this.size;
    this.lastTickTime = lastTickTime;
    this.offset = 0;
    this.skullImg = new Image();
    this.skullImg.src = SkullIcon;
    this.sfx = {
      crunch: new Audio(),
      burn: new Audio()
    };
    this.sfx.crunch.src = CrunchSfx;
    this.sfx.crunch.volume = 0.2;
    this.sfx.burn.src = BurnSfx;
  }

  draw(ctx) {
    ctx.drawImage(this.skullImg, this.xPos, this.yPos, this.size, this.size);
  }

  move(fallSpeed, thisTickTime, isPaused, pausedTimestamp) {
    // In order to restart after a pause, we need to keep track of this offset
    this.offset = !isPaused ? this.offset : pausedTimestamp - thisTickTime;
    if (!isPaused) {
      // pixels to move = milliseconds since last move * speed per 1000 milliseconds
      this.yPos +=
        (thisTickTime - this.lastTickTime + this.offset) * (fallSpeed / 1000);
      this.lastTickTime = thisTickTime;
      // Need to reset after restarting after a pause.
      this.offset = 0;
    }
  }

  wasClicked(clickPoint) {
    return (
      (clickPoint.xPos - (this.xPos + this.size / 2)) ** 2 +
        (clickPoint.yPos - (this.yPos + this.size / 2)) ** 2 <
      (this.size / 2) ** 2
    );
  }
}

export default Skull;
