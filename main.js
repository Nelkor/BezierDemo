const width = window.canvas.width;
const height = window.canvas.height;

let ctx = window.canvas.getContext('2d');
let notices = true;
let taken = null;

ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.font = '14px Monospace';
ctx.strokeStyle = '#bcb';
ctx.lineWidth = 3;

let getGeometry = () => {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  };
};

let client = getGeometry();

let points = {
  start: {x: 200, y: 900, color: 'red'},
  cp1: {x: 400, y: 400, color: 'blue'},
  cp2: {x: 1700, y: 100, color: 'blue'},
  finish: {x: 1700, y: 900, color: 'red'}
};

let drawDot = point => {
  ctx.fillStyle = point.color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
};

let drawNotation = point => {
  let x = point.x + (width / 2 - point.x) / 16;
  let y = point.y + (point.y < height / 2 ? 20 : -20);

  ctx.fillStyle = '#444';
  ctx.fillText('x: ' + Math.floor(point.x) + ', y: ' + Math.floor(point.y), x, y);
};

let drawPoint = point => {
  drawDot(point);
  if (notices) drawNotation(point);
};

let render = () => {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.moveTo(points.start.x, points.start.y);
  ctx.bezierCurveTo(points.cp1.x, points.cp1.y, points.cp2.x, points.cp2.y, points.finish.x, points.finish.y);
  ctx.stroke();

  for (let point in points)
    drawPoint(points[point]);

  requestAnimationFrame(render);
};

let realPoint = (x, y) => {
  return {
    x: width / client.width * x,
    y: height / client.height * y
  };
};

window.addEventListener('resize', () => client = getGeometry());
window.notices.addEventListener('click', function () {notices = this.querySelector('input').checked});

window.canvas.addEventListener('mousedown', event => {
  let clientPoint = realPoint(event.clientX, event.clientY);

  for (let point in points)
    if (Math.abs(points[point].x - clientPoint.x) < 10 && Math.abs(points[point].y - clientPoint.y) < 10)
      return taken = points[point];
});

window.canvas.addEventListener('mousemove', event => {
  if ( ! taken) return;

  let clientPoint = realPoint(event.clientX, event.clientY);

  taken.x = clientPoint.x;
  taken.y = clientPoint.y;
});

window.canvas.addEventListener('mouseup', () => taken = null);

render();
