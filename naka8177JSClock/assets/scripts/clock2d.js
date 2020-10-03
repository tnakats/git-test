var canvasLeft = document.getElementById("clockCanvasL");
var canvasMiddle = document.getElementById("clockCanvasM");
var canvasRight = document.getElementById("clockCanvasR");
var contextLeft = canvasLeft.getContext("2d");
var contextMiddle = canvasMiddle.getContext("2d");
var contextRight = canvasRight.getContext("2d");
var hour, minutes, seconds;
var handType

document.getElementById("currentTimeBtn").addEventListener("click", drawClocks);

drawClocks();

function drawClock(canvas, context) {
  var clockRadius = canvas.width / 2;
  var clockOriginX = canvas.width / 2;
  var clockOriginY = canvas.height / 2;
  if (canvas.height > 300) {
     return;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);

  //creates outer circle of clock
  context.beginPath();
  context.arc(clockOriginX, clockOriginY, clockRadius, 0, 2 * Math.PI);
  context.stroke();

  if (canvas.width >= 250) {
   drawNumbers(canvas, context);
   context.translate(-clockOriginX, -clockOriginY);
  }
  drawTime(canvas, context);
  //creates circle in middle of clock
  context.beginPath();
  context.arc(clockOriginX, clockOriginY, 5, 0, 2 * Math.PI);
  context.fill();
  context.stroke();

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
        markLength = clockOriginY - clockRadius + 20;
     }
     else {
        context.lineWidth = 1;
        markLength = clockOriginY - clockRadius + 10;
     }

     context.lineTo(clockOriginX, markLength);
     context.stroke();
     context.restore();
  }
}

function drawTime (canvas, context) {
   var today = new Date();
   hour = today.getHours() % 12;
   minutes = today.getMinutes();
   seconds = today.getSeconds();
   console.log("drawTime");
   drawHand (canvas, hour, context);
   drawHand (canvas, minutes, context);
   drawHand (canvas, seconds, context)
 }

function drawHand(canvas, handType, context) {
   var clockRadius = canvas.width / 2;
   var clockOriginX = canvas.width / 2;
   var clockOriginY = canvas.height / 2;
   context.save();
   context.translate(clockOriginX, clockOriginY);
   if (handType == hour) {
      var calculateRotate = (Math.PI / 180) * (360 / 12) * (handType % 12);
   }
   else {
      var calculateRotate = (Math.PI / 180) * (360 / 60) * (handType % 60);
   }
   context.rotate(calculateRotate);
   context.translate(-clockOriginX, -clockOriginY);

   context.beginPath();
   var lineColor = "teal";
   if (handType == seconds) {
      lineColor = "black";
   }
   context.strokeStyle = lineColor;
   context.fillStyle = lineColor;
   context.moveTo(clockOriginX, clockOriginY + 20);
   if (handType == hour) {
      context.lineWidth = 5;
      context.lineTo(clockOriginX, (clockOriginY - clockRadius / 2));
   }
   else {
      context.lineWidth = 4;
      if (handType == seconds) {
         context.lineWidth = 1;
      }
      context.lineTo(clockOriginX, clockOriginY - (clockRadius - 22));
   }
   context.stroke();
   context.restore();
}

function drawNumbers(canvas, context) {
   var canvasRadius = canvas.width / 2;
   var clockOriginX = canvas.width / 2;
   var clockOriginY = canvas.height / 2;
   var angle;
   var hourNum;
   context.translate(clockOriginX,clockOriginY);
   context.font = canvasRadius*0.15 + "px arial";
   context.textBaseline="middle";
   context.textAlign="center";
   for(hourNum = 1; hourNum < 13; hourNum++){
     angle = hourNum * Math.PI / 6;
     context.rotate(angle);
     context.translate(0, -canvasRadius*0.75);
     context.rotate(-angle);
     context.fillText(hourNum.toString(), 0, 0);
     context.rotate(angle);
     context.translate(0, canvasRadius*0.75);
     context.rotate(-angle);
   }
 }

function drawClocks() {
   drawClock(canvasLeft, contextLeft);
   drawClock(canvasMiddle, contextMiddle);
   drawClock(canvasRight, contextRight);
}
