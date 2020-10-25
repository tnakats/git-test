/**************************************************************************
File name:     clock2d.js
Author:        Tyler Nakata 
Date:          10/6/20
Class:         CS360
Assignment:    JSClock
Purpose:       Draw clocks
**************************************************************************/
var canvasLeft = document.getElementById("clockCanvasL");
var canvasMiddle = document.getElementById("clockCanvasM");
var canvasRight = document.getElementById("clockCanvasR");
var context;
var canvas;
var hour, minutes, seconds, milliseconds;
var handType, handValue;
var hourDif;
var clockStyle = document.getElementById("clockStyle");

document.getElementById("clockStyle").addEventListener("click", changeClock);
document.getElementById("clockStyle").addEventListener("click", updateSeconds);
drawAllClocks();
updateSeconds();




/**************************************************************************
Function:      clock2d
Description:   draws the full clock by calling drawNumbers and drawTime
Parameters:    canvas   - the canvas we are drawing on
               hourDif  - the change in hours based on time zone
Returned:      none
**************************************************************************/
function clock2d(canvas, hourDif) {
  var clockRadius = canvas.width / 2;
  var clockOriginX = canvas.width / 2;
  var clockOriginY = canvas.height / 2;
  context = canvas.getContext("2d");
  if (canvas.height > 300 || canvas.height < 100) {
     return;
   }
  context.clearRect(0, 0, canvas.width, canvas.height);

  //creates outer circle of clock
  context.beginPath();
  context.arc(clockOriginX, clockOriginY, clockRadius, 0, 2 * Math.PI);
  context.stroke();

  //prevents any clock 250px or smaller to show numbers
  if (canvas.width >= 250) {
   drawNumbers(canvas, context);
   context.translate(-clockOriginX, -clockOriginY);
  }

  //draws hands before the circle in the middle
  drawTime(canvas, context, hourDif);

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

/**************************************************************************
Function:      drawTime
Description:   gets the current time and calls drawHand for each hand
Parameters:    canvas   - the canvas we are drawing on
               context  - the 2d context of the specific canvas
               hourDif  - the change in hours based on time zone
            
Returned:      none
**************************************************************************/
function drawTime (canvas, context, hourDif) {
   var today = new Date();
   hour = today.getHours() % 12;
   hour += hourDif;
   minutes = today.getMinutes();
   seconds = today.getSeconds();
   milliseconds = today.getMilliseconds();
   drawHand (canvas, "hour", hour, context);
   drawHand (canvas, "minutes", minutes, context);
   drawHand (canvas, "seconds", seconds, context);
 }

/**************************************************************************
Function:      drawHand
Description:   draws a specific hand of the clock
Parameters:    canvas   - the canvas we are drawing on
               handType - the type of hand that is being drawn (hour, minutes,
                          or seconds)
               context  - the 2d context of the specific canvas
            
Returned:      none
**************************************************************************/
function drawHand(canvas, handType, handValue, context) {
   var clockRadius = canvas.width / 2;
   var clockOriginX = canvas.width / 2;
   var clockOriginY = canvas.height / 2;
   var lineColor = "rgb(60,137,138)";

   if (handType == "seconds") {
      lineColor = "black";
   }
   
   context.save();
   context.translate(clockOriginX, clockOriginY);
   if (handType == "hour") {
      var calculateRotate = (Math.PI / 180) * (360 / 12) * (handValue % 12);
      calculateRotate += (Math.PI / 180) * (360 / 43200) * (seconds);
   }
   else if (handType == "minutes"){
      var calculateRotate = (Math.PI / 180) * (360 / 60) * (handValue % 60);
      calculateRotate += (Math.PI / 180) * (360 / 3600) * (seconds);
   }
   else {
      if (handType == "seconds" && clockStyle.innerHTML == "DIGITAL") {
         var calculateRotate = (Math.PI / 180) * (360 / 60) * (handValue % 60);
      }
      else {
         var calculateRotate = (Math.PI / 180) * (360 / 60) * (handValue % 60);
         calculateRotate+= (Math.PI / 180) * (360 / 1440) * (milliseconds / 41.6);
      }
   }
   context.rotate(calculateRotate);
   context.translate(-clockOriginX, -clockOriginY);

   context.beginPath();
   context.strokeStyle = lineColor;
   context.fillStyle = lineColor;
   //this moveTo allows us to draw the line past the centerpoint
   context.moveTo(clockOriginX, clockOriginY + 20);
   if (handType == "hour") {
      context.lineWidth = 5;
      context.lineTo(clockOriginX, (clockOriginY - clockRadius / 2));
   }
   else {
      context.lineWidth = 4;
      if (handType == "seconds") {
         context.lineWidth = 1;
      }
      context.lineTo(clockOriginX, clockOriginY - (clockRadius - 22));
   }
   context.stroke();
   context.restore();
}

/**************************************************************************
Function:      drawNumbers
Description:   draws the numbers vertically on the clock
Parameters:    canvas   - the canvas we are drawing the on
               context  - the 2d context of the specific canvas
            
Returned:      none
**************************************************************************/
function drawNumbers(canvas, context) {
   var canvasRadius = canvas.width / 2;
   var clockOriginX = canvas.width / 2;
   var clockOriginY = canvas.height / 2;
   var calculateRotate;
   var hourNum;
   context.translate(clockOriginX,clockOriginY);
   context.font = canvasRadius*0.2 + "px times new roman";
   context.textBaseline="middle";
   context.textAlign="center";
   for(hourNum = 1; hourNum < 13; hourNum++){
     calculateRotate = hourNum * Math.PI / 6;
     context.rotate(calculateRotate);
     context.translate(0, -canvasRadius*0.7);
     context.rotate(-calculateRotate);
     context.fillText(hourNum.toString(), 0, 0);
     context.rotate(calculateRotate);
     context.translate(0, canvasRadius*0.7);
     context.rotate(-calculateRotate);
   }
 }

/**************************************************************************
Function:      drawAllClocks
Description:   draws all three clocks to allow for a singluar callback 
               function
Parameters:    none
Returned:      none
**************************************************************************/
function drawAllClocks() {
   clock2d(canvasLeft, 0);
   clock2d(canvasMiddle, 1);
   clock2d(canvasRight, 2);
   document.getElementById("clockStyle").addEventListener("click", updateSeconds(milliseconds));
}

/**************************************************************************
Function:      changeClock
Description:   changes DIGITAL to ANALOG and vice versa
Parameters:    none
Returned:      none
**************************************************************************/
function changeClock() {
   var clockStyle = document.getElementById("clockStyle");

   if(clockStyle.innerHTML == "DIGITAL") {
      clockStyle.innerHTML = "ANALOG";
   }
   else if (clockStyle.innerHTML == "ANALOG") {
      clockStyle.innerHTML = "DIGITAL";
   }
}

/**************************************************************************
Function:      changeClock
Description:   changes DIGITAL to ANALOG and vice versa
Parameters:    none
Returned:      none
**************************************************************************/
function updateSeconds(milliseconds) {
   var intervalID;
   if (clockStyle.innerHTML == "DIGITAL") {
      clearInterval (intervalID);
      intervalID = setInterval (drawAllClocks, 1000 - milliseconds);

   }
   if (clockStyle.innerHTML == "ANALOG") {
      clearInterval (intervalID);
      intervalID = setInterval(drawAllClocks, 41.6);
   }
   

}