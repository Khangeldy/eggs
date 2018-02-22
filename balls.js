const canvas = document.getElementById('bg'),
      context = canvas.getContext('2d'),
      width = canvas.width = document.body.clientWidth,
      height = canvas.height = document.body.clientHeight;

let ballCount = 0;
const ballHistory = [];
const maxBalls = 10;
let ballSpeed = 2;
// ballCount / (10 / 3)
// [0,1,2] = 2;
// [3,4,5] = 3;
// [6,7,8,9] = 4;

context.fillStyle = 'white'
context.fillRect(0, 0, width, height);

const ballType = {
  type: types[0].type,
  x: 300,
  y: 300,
  r: 25,
  color: types[0].color,
  draw: function () {
    context.beginPath()
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
    context.closePath()
    context.fillStyle = this.color;
    context.fill();
  },
  restart: function() {
    clearScene(context, 0, 0, width, height);
    let index = randomRange(0, types.length - 1)
    this.type = types[index].type;
    this.color = types[index].color;
    this.y = 0;
    ballCount++;
    ballSpeed = Math.floor(ballCount / (Math.floor(maxBalls / 3))) + 2;
    this.x = randomRange(this.r, width - this.r);
  }
}

ballType.draw()

animate();

function animate() {
  if(maxBalls > ballCount) {
    window.BALL_GAME = requestAnimationFrame(animate)

    if(ballType.y < height) {
      ballType.y += ballSpeed;
    } else {
      const ifScore = checkCollision(ballType.x, ballType.type, position.x)

      if(ifScore) {
        score++;
        ballHistory.push(ballType.color);
      } else {
        ballHistory.push('gray')
      }

      ballType.restart()
    }

    // context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    clearScene(context, ballType.x - ballType.r, 0, ballType.r * 2, height, true);
    // context.fillRect(0, 0, width, height);
    drawPoints(context, score, ballType.color)
    ballType.draw()
  } else {
    endGame(context, width, height)
  }

}

function checkCollision (ballX, type, posX) {
  if(ballX < posX) {
    console.log('1')
    return false;
  } else if(ballX < posX + allWidth) {
    const collX = Math.floor((ballX - posX) / (doubleGap * 0.5)) % 2 === 0
    const collIndex = Math.floor((ballX - posX) / doubleGap);
    const res = collX && types[collIndex].type === type;
    console.log(res);
    return collX && types[collIndex].type === type;
  } else {
    console.log('3')
    return false;
  }
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function drawPoints(context, score, ballColor) {
  context.fillStyle = 'black';
  context.font = ' 30px Arial';
  context.textAlign = 'right';
  context.fillText(score, width - 40, 35);
  context.beginPath()
  context.arc(width - 20, 25, 12, 0, Math.PI * 2, true);
  context.closePath();
  context.fillStyle = ballColor;
  context.fill();
}

function clearScene(context, x, y, w, h, isAlpha) {
  context.fillStyle = isAlpha ? 'rgba(255, 255, 255, 0.1)': 'white';
  context.fillRect(x, y, w, h)
}

function endGame(context, width, height) {
  clearScene(context, 0, 0, width, height)
  drawPoints(context, score, ballType.color)
  context.textAlign = 'center';
  // context.fillText('End Game', width * 0.5, height * 0.5);
  context.fillText('Your result', width * 0.5, height * 0.4);
  const ballHSize = 15;
  let ballHistoryX = (width * 0.5) - (ballHSize * 3) * (ballHistory.length * 0.5) + ballHSize + ballHSize * 0.5;
  for(let i = 0, l = ballHistory.length; i < l; i++) {
    context.beginPath()
    context.arc(ballHistoryX + i * (ballHSize * 3), height * 0.5, ballHSize, 0, Math.PI * 2, true)
    context.closePath()
    context.fillStyle = ballHistory[i];
    context.fill();
  }
  document.body.classList.add('end-game');
}

function restart() {
  ballCount = 0;
  score = 0;
  ballHistory.length = 0;
  ballSpeed = 2;
  context.clearRect(0, 0, width, height);
  animate();
  document.body.classList.remove('end-game')
}

document.getElementById('restart-game').addEventListener('click', restart)
