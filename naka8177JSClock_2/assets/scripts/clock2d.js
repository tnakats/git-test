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
drawAllClocks();
updateSeconds(milliseconds);




/**************************************************************************
Function:      clock2d
Description:   draws the full clock by calling drawNumbers and drawTime
Parameters:    canvas   - the canvas we are drawing on
               hourDif  - the change in hours based on time zone
Returned:      none
**************************************************************************/
function clock2d(canvas, hourDif) {
   const clockRadius = canvas.width / 2;
   const clockOriginX = canvas.width / 2;
   const clockOriginY = canvas.height / 2;
   let context = canvas.getContext("2d");
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

   for (let i = 0; i < 60; i++) {
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
function drawTime(canvas, context, hourDif) {
   let today = new Date();
   hour = today.getHours() % 12 + hourDif;
   minutes = today.getMinutes();
   seconds = today.getSeconds();
   milliseconds = today.getMilliseconds();
   drawHour(canvas, context, hour, minutes);
   drawMinute(canvas, context, minutes, seconds);
   drawSecond(canvas, context, seconds, milliseconds);
}

/**************************************************************************
Function:      drawHand
Description:   draws a hand of the clock
Parameters:    canvas            - the canvas we are drawing on
               context           - the 2d context of the specific canvas
               lineColor         - the color of the hand
               lineWidth         - the width of the hand
               handLength        - the length of the hand
               calculateRotate   - rotation of the hand  
Returned:      none
**************************************************************************/
function drawHand(canvas,context, lineColor, lineWidth, handLength, calculateRotate) {
   const clockOriginX = canvas.width / 2;
   const clockOriginY = canvas.height / 2;

   context.save();
   context.translate(clockOriginX, clockOriginY);

   context.rotate(calculateRotate);
   context.translate(-clockOriginX, -clockOriginY);

   context.beginPath();
   context.strokeStyle = lineColor;
   context.fillStyle = lineColor;
   context.moveTo(clockOriginX, clockOriginY + 20);
   context.lineWidth = lineWidth;
   context.lineTo(clockOriginX, handLength);

   context.stroke();
   context.restore();
}

/**************************************************************************
Function:      drawHour
Description:   draws a hand of the clock
Parameters:    canvas   - the canvas we are drawing on
               context  - the 2d context of the specific canvas
               hour     - hour value 
               minutes  - minute value to calculate the rotation
               
Returned:      none
**************************************************************************/
function drawHour(canvas, context, hour, minutes) {
   const clockRadius = canvas.width / 2;
   const clockOriginY = canvas.height / 2;
   let lineColor = "rgb(60,137,138)";
   let calculateRotate = (Math.PI / 180) * (360 / 12) * (hour % 12);
      calculateRotate += (Math.PI / 180) * (360 / 720) * (minutes);
   let handLength = clockOriginY - clockRadius / 2;
   drawHand(canvas, context, lineColor, 5, handLength, calculateRotate);
}

/**************************************************************************
Function:      drawMinute
Description:   draws a hand of the clock
Parameters:    canvas   - the canvas we are drawing on
               context  - the 2d context of the specific canvas
               minutes  - minute value
               seconds  - second value to calulate the rotation
Returned:      none
**************************************************************************/
function drawMinute(canvas, context, minutes, seconds) {
   const clockRadius = canvas.width / 2;
   const clockOriginY = canvas.height / 2;
   let lineColor = "rgb(60,137,138)";
   let calculateRotate = (Math.PI / 180) * (360 / 60) * (minutes % 60);
      calculateRotate += (Math.PI / 180) * (360 / 3600) * (seconds);
   let handLength = clockOriginY - (clockRadius - 22);
   drawHand(canvas, context, lineColor, 4, handLength, calculateRotate);
}

/**************************************************************************
Function:      drawSecond
Description:   draws a hand of the clock
Parameters:    canvas         - the canvas we are drawing on
               context        - the 2d context of the specific canvas
               seconds        - second value
               milliseconds   - millisecond value to calculate the rotation
Returned:      none
**************************************************************************/
function drawSecond(canvas, context, seconds, millieseconds) {
   const clockRadius = canvas.width / 2;
   const clockOriginY = canvas.height / 2;
   let lineColor = "black";
   let calculateRotate;
   if (clockStyle.innerHTML == "DIGITAL") {
      calculateRotate = (Math.PI / 180) * (360 / 60) * (seconds % 60);
   }
   else {
      calculateRotate = (Math.PI / 180) * (360 / 60) * (seconds % 60);
      calculateRotate += (Math.PI / 180) * (360 / 1440) * (milliseconds/ 41.6);
   }
   let handLength = clockOriginY - (clockRadius - 22);
   drawHand(canvas, context, lineColor, 1, handLength, calculateRotate);
}

/**************************************************************************
Function:      drawNumbers
Description:   draws the numbers vertically on the clock
Parameters:    canvas   - the canvas we are drawing the on
               context  - the 2d context of the specific canvas
Returned:      none
**************************************************************************/
function drawNumbers(canvas, context) {
   const canvasRadius = canvas.width / 2;
   const clockOriginX = canvas.width / 2;
   const clockOriginY = canvas.height / 2;
   let calculateRotate;
   let hourNum;
   context.translate(clockOriginX, clockOriginY);
   context.font = canvasRadius * 0.2 + "px times new roman";
   context.textBaseline = "middle";
   context.textAlign = "center";
   for (hourNum = 1; hourNum < 13; hourNum++) {
      calculateRotate = hourNum * Math.PI / 6;
      context.rotate(calculateRotate);
      context.translate(0, -canvasRadius * 0.7);
      context.rotate(-calculateRotate);
      context.fillText(hourNum.toString(), 0, 0);
      context.rotate(calculateRotate);
      context.translate(0, canvasRadius * 0.7);
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
Description:   changes clockStyle from DIGITAL to ANALOG and vice versa
Parameters:    none
Returned:      none
**************************************************************************/
function changeClock() {
   let clockStyle = document.getElementById("clockStyle");

   if (clockStyle.innerHTML == "DIGITAL") {
      clockStyle.innerHTML = "ANALOG";
   }
   else if (clockStyle.innerHTML == "ANALOG") {
      clockStyle.innerHTML = "DIGITAL";
   }
}

/**************************************************************************
Function:      updateSeconds
Description:   changes the seconds hand from DIGITAL to ANALOG and vice versa
Parameters:    milliseconds - milliseconds between seconds for correction
Returned:      none
**************************************************************************/
function updateSeconds(milliseconds) {
   let intervalID;
   if (clockStyle.innerHTML == "DIGITAL") {
      clearInterval(intervalID);
      intervalID = setInterval(drawAllClocks, 1000 - milliseconds);

   }
   if (clockStyle.innerHTML == "ANALOG") {
      clearInterval(intervalID);
      intervalID = setInterval(drawAllClocks, 41.6);
   }
}