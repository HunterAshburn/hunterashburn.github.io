const canvas = document.getElementById('jelly-canvas');
const ctx = canvas.getContext('2d');
//const jellyRadius = 100;
//const headshotRadius = 50;
//let jellyX = canvas.width / 2;
//let jellyY = canvas.height / 2;
var cx = canvas.width / 2;
var cy = canvas.height / 2;
var radius = canvas.width / 2 - 20;
var currentAmp = 8;
var currentSineCount = 0;
var ampLower = -15;
var ampUpper = 15;
var sineCountLower = 1;
var sineCountUpper = 15;
var rotationSpeed = 0.1;

var lastTime = 0;

var changeJellyTimer = 0;
var changeJellyAfterSeconds = 0.1;

// Main animation loop
function animate(currentTime) {

    var deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //changeJellyTimer += deltaTime;
    //if (changeJellyTimer >= changeJellyAfterSeconds) {
    //    changeJellyTimer = 0;
    //    currentAmp = changeJellyValue(currentAmp, ampLower, ampUpper);
    //    currentSineCount = changeJellyValue(currentSineCount, sineCountLower, sineCountUpper);
    //}
    //currentAmp = changeJellyValue(currentAmp, ampLower, ampUpper);
    //currentSineCount = changeJellyValue(currentSineCount, sineCountLower, sineCountUpper);

    // Draw jelly circle
    drawJellyCircle(deltaTime);
    // Draw headshot
    //drawHeadshot();
    requestAnimationFrame(animate);
}

function changeJellyValue(value, min, max) {
    var change = Math.floor(Math.random() * 3) - 1;
    return Math.max(min, Math.min(value + change, max));
}

// Draw jelly circle
function drawJellyCircle(deltaTime) {
    //ctx.beginPath();
    //ctx.arc(jellyX, jellyY, jellyRadius, 0, Math.PI * 2);
    //ctx.fillStyle = 'rgba(102, 204, 255, 0.5)';
    //ctx.fill();
    //ctx.translate(cx, cy);
    //ctx.rotate(rotationSpeed * deltaTime * Math.PI / 2);
    //ctx.translate(-cx, -cy);
    ctx.beginPath();
    for(var i=0;i<360;i++){
        var angle=i*Math.PI/180;
        var pt=sineCircleXYatAngle(cx,cy,radius,currentAmp,angle,currentSineCount);
        ctx.lineTo(pt.x,pt.y);
    }
    ctx.fillStyle = 'rgba(102, 204, 255, 0.5)';
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

function sineCircleXYatAngle(cx,cy,radius,currentAmp,angle,currentSineCount){
    var x = cx+(radius+currentAmp*Math.sin(currentSineCount*angle))*Math.cos(angle);
    var y = cy+(radius+currentAmp*Math.sin(currentSineCount*angle))*Math.sin(angle);
    return({x:x,y:y});
}

// Draw headshot
function drawHeadshot() {
    const headshotImg = new Image();
    headshotImg.src = '/assets/images/headshot.jpg';
    ctx.drawImage(headshotImg, jellyX - headshotRadius, jellyY - headshotRadius, headshotRadius * 2, headshotRadius * 2);
}

// Ripple effect on mouse move
canvas.addEventListener('mousemove', function(event) {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < radius) {
        console.log("inside circle");
    }
});

requestAnimationFrame(animate);