var canvasLeft = document.getElementById("clockCanvasL");
var canvasMiddle = document.getElementById("clockCanvasM");
var canvasRight = document.getElementById("clockCanvasR");
var contextLeft = canvasLeft.getContext("2d");
var contextMiddle = canvasMiddle.getContext("2d");
var contextRight = canvasRight.getContext("2d");

var hourMarkLength = 20;
var minuteMarkLength = hourMarkLength / 2;
var hour, minutes, seconds;

drawClock(canvasLeft, contextLeft);
drawClock(canvasMiddle, contextMiddle);
drawClock(canvasRight, contextRight);

function drawClock(canvas, context) {
  var clockRadius = canvas.width / 2;
  var clockOriginX = canvas.width / 2;
  var clockOriginY = canvas.height / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.arc(clockOriginX, clockOriginY, clockRadius, 0, 2 * Math.PI);
  context.stroke();

  context.beginPath();
  context.arc(clockOriginX, clockOriginY, 2, 0, 2 * Math.PI);
  context.fill();
  context.stroke();

  var startingMarkerX = clockOriginX;
  var startingMarkerY = clockOriginY - clockRadius + 10;

  for (var i = 0; i < 60; i++) {
     context.save();

     context.translate(clockOriginX, clockOriginY);
     var calculateRotate = (Math.PI / 180) * (360 / 60) * i;
     context.rotate(calculateRotate);
     context.translate(-clockOriginX, -clockOriginY);

     context.beginPath();
     context.moveTo(clockOriginX, clockOriginY - clockRadius);
     var markLength;
     if (i % 5 === 0) {
        context.lineWidth = 2;
        markLength = clockOriginY - clockRadius + hourMarkLength;
     }
     else {
        context.lineWidth = 1;
        markLength = clockOriginY - clockRadius + minuteMarkLength;
     }

     context.lineTo(clockOriginX, markLength);
     context.stroke();
     context.restore();
  }
}

function drawTime (hour, minutes, seconds) {
  var today = new Date();
  hour = today.getHours() % 12;
  minutes = today.getMinutes();
  seconds = today.getSeconds();
  console.log("drawTime");
  drawTime(hour, minutes, seconds);

}

