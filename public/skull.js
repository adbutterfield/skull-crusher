/**
 * Class representing a skull
 */

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
    this.moveButter = 0;
    this.sfx = {
      crunch: new Audio('./sounds/crunch02.mp3'),
      burn: new Audio('./sounds/burn.wav')
    };
    this.sfx.crunch.volume = 0.2;
  }

  draw(ctx) {
    let img = new Image();
    img.height = this.size;
    img.width = this.size;
    img.src = '../assets/skull.svg';
    ctx.drawImage(img, this.xPos, this.yPos, this.size, this.size);
  }

  move(fallSpeed, thisTickTime, isPaused, pausedTimestamp) {
    // In order to restart after a pause, we need to keep track of this offset
    this.offset = !isPaused ? this.offset : pausedTimestamp - thisTickTime;
    if (!isPaused) {
      // pixels to move = milliseconds since last move * speed per 1000 milliseconds
      this.moveButter +=
        (thisTickTime - this.lastTickTime + this.offset) * (fallSpeed / 1000);
      this.lastTickTime = thisTickTime;
      // Only move in whole pixel values
      const pxToMove = Math.floor(this.moveButter);
      if (pxToMove > 0) {
        this.yPos += pxToMove;
        this.moveButter -= pxToMove;
      }
      // Need to reset after restarting after a pause.
      this.offset = 0;
    }
  }
}

export default Skull;
