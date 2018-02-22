const canvasGamePad = document.getElementById('gamepad'),
      ctx = canvasGamePad.getContext('2d'),
      w = canvasGamePad.width = document.body.clientWidth,
      h = canvasGamePad.height = 100;

const types = [
  {type: 'orange', color: '#FF9800'},
  {type: 'blue', color: '#2196F3'},
  {type: 'red', color: '#F44336'},
  {type: 'pink', color: 'pink'},
  {type: 'yellow', color: 'yellow'},
  {type: 'brown', color: '#795548'},
  {type: 'aqua', color: 'aqua'}
]

const drawTypes = types;

let score = 0;

const pLength = types.length;
const pSize = 50;
const doubleGap = 100;
const allWidth = (doubleGap + pSize) * pLength

const mouse = { x: 0, y: 0 },
      position = { x: 0, y: 0 },
      previous = { x: 0, y: 0 },
      velocity = { x: 0, y: 0 },
      FRICTION_COEFF = 0.85;

let dragging = false;
let keyPressed = false;
let mouseStartDiff = 0;

function draw() {
  for(let i = 0; i < pLength; i++) {
    ctx.save();
    ctx.fillStyle = types[i].color;
    ctx.translate(i * doubleGap, 0);
    ctx.fillRect(position.x, h - pSize, pSize, pSize);
    ctx.restore();
  }
}

animateGamePad();

function animateGamePad() {
  requestAnimationFrame(animateGamePad)
//   ctx.save();

  if ( dragging ) {

    previous.x = position.x;

    position.x = mouse.x - mouseStartDiff;

    velocity.x = ( position.x - previous.x );

  } else {
    if(position.x + doubleGap < -allWidth) {
      position.x = w
    } else if(position.x - allWidth > w) {
      position.x = -allWidth
    }

    position.x += velocity.x;

    velocity.x *= FRICTION_COEFF;
  }

  if(keyPressed === 1) {
    // console.log(keyPressed)
    position.x += -5;
  } else if(keyPressed === -1) {
    // console.log(keyPressed)
    position.x += 5;
  }
  ctx.clearRect(0, 0, w, h);

  draw();

}

document.body.addEventListener( 'mousedown', function(e) {
  mouseStartDiff = e.x - position.x;
  dragging = true;
});
document.body.addEventListener( 'mouseup', function() { dragging = false; });
document.addEventListener( 'mousemove', function( event ) {
  mouse.x = event.x;
});

document.addEventListener('keydown', function(e) {
  if(e.keyCode === 37) {
    keyPressed = 1;
  } else if(e.keyCode === 39) {
    keyPressed = -1;
  }
  // debugger;
  console.log(keyPressed, e.keyCode)
});

document.addEventListener('keyup', function() {
  keyPressed = 0;
})

// document.body.addEventListener('touchstart', function(e) {
//   mouseStartDiff = e.touches[0].clientX - position.x;
//   dragging = true;
// }, false);
// document.body.addEventListener('touchmove', function(e) {
//   mouse.x = e.changedTouches[0].clientX
// }, false);
// document.body.addEventListener('touchend', function(e) {
//   dragging = false;
// }, false);
