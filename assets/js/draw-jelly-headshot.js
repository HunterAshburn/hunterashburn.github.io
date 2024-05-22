const canvas = document.getElementById('jelly-canvas');
const ctx = canvas.getContext('2d');

const headshotImg = new Image();
headshotImg.src = '/assets/images/jellyHeadshot.png';

//const jellyRadius = 100;
//const headshotRadius = 50;
//let jellyX = canvas.width / 2;
//let jellyY = canvas.height / 2;
var centerX; //= canvas.width / 2;
var centerY; //= canvas.height / 2;

var smallRadius; //= canvas.width / 2 - 70;
var largeRadius; //= smallRadius + 50;
var radius; //= smallRadius;
var radiusTarget;
var radiusIncrement = 5;
var radiusTimer = 0;
var radiusDuration = 0.01;

var currentAmp;
var ampIncrement = 1;
//var ampTarget = 0;
var ampBoundary;
var ampBoundaryDecay = 0.5;
var ampBoundaryMin;
var ampMax;
var ampTimer = 0;
var ampDuration = 0.5;

var currentJellyJiggle = 0;
var jellyJiggleDecay = 100;
var jellyJiggleMax = 350;

var currentSineCount = 3;
var sineTarget = 0;
var sineCountLower = 3;
var sineCountUpper = 3;
var sineTimer = 0;
var sineDuration = 1;

var rotationSpeed1 = -0.2;
var lastRotation1 = 0;

var rotationSpeed2 = 0.5;
var lastRotation2 = 90;

var rotationSpeed3 = 0.3;
var lastRotation3 = 180;

var rotationSpeed4 = -0.4;
var lastRotation4 = 270;

var currentTranslation1 = 0;
var translationSpeed1 = 20;
var currentTranslation2 = 0;
var translationSpeed2 = 15;
var currentTranslation3 = 0;
var translationSpeed3 = 10;
var translationBoundary = 50;

var lastTime = 0;

var changeJellyTimer = 0;
var changeJellyAfterSeconds = 0.025;

var lastAngle = 0;

var lastMouseX;
var lastMouseY;
var lastDistance = canvas.parentElement.clientWidth;
var mousePowerModifier;

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.width;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    smallRadius = canvas.width / 2 - 85;
    largeRadius = smallRadius + 50;
    radius = smallRadius;
    radiusTarget = smallRadius;
    ampMax = canvas.clientWidth / 15;
    ampBoundaryMin = canvas.clientWidth / 45;
    currentAmp = ampBoundaryMin;
    ampBoundary = ampBoundaryMin;
    mousePowerModifier = ampMax / 20;
}

window.addEventListener('resize', resizeCanvas);

// Main animation loop
function animate(currentTime) {
    var deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sineTimer += deltaTime;
    if (sineTimer >= sineDuration / (sineCountUpper * 2)) {
        sineTimer = 0;
    //    currentAmp = changeJellyValue(currentAmp, ampLower, ampUpper);
    //    currentSineCount = changeJellyValue(currentSineCount, sineCountLower, sineCountUpper);
        if (currentSineCount < sineTarget) {
            currentSineCount++;
        } else if (sineTarget > sineCountLower) {
            sineTarget--;
            currentSineCount--;
        }

        //if (currentAmp >= ampBoundary || currentAmp <= -ampBoundary) {
        //    ampIncrement = -ampIncrement;
        //}
        //currentAmp += ampIncrement;
    }

    ampTimer += deltaTime;
    if (ampTimer >= ampDuration / (ampBoundary * 4)) {
        //if (ampBoundary > ampBoundaryMin) {
            ampTimer = 0;
            if (currentAmp >= ampBoundary) {
                if (ampBoundary > ampBoundaryMin) {
                    ampBoundary -= ampBoundaryDecay;
                }
                ampIncrement = -Math.abs(ampIncrement);
            } else if (currentAmp <= -ampBoundary) {
                if (ampBoundary > ampBoundaryMin) {
                    ampBoundary -= ampBoundaryDecay;   
                }
                ampIncrement = Math.abs(ampIncrement);
            }
            currentAmp += ampIncrement;
        //}
    //    if (ampTarget > 0) {
    //        if (currentAmp > ampTarget) {
    //            ampIncrement = -Math.abs(ampIncrement);
    //            currentAmp = ampTarget + ampIncrement;
    //            ampTarget--;
    //        } else if (currentAmp < -ampTarget) {
    //            ampIncrement = Math.abs(ampIncrement);
    //            currentAmp = -ampTarget + ampIncrement;
    //            ampTarget--;
    //        } else {
    //            currentAmp += ampIncrement;
    //        }
    //    }
    }

    if (sineTarget <= sineCountLower) {
        //currentAmp = ampBoundaryMin;
        ampBoundary = ampBoundaryMin;
    }

    radiusTimer += deltaTime;
    if (radiusTimer >= radiusDuration) {
        radiusTimer = 0;
        if (radius > radiusTarget) {
            radius -= radiusIncrement;
        } else if (radius < radiusTarget) {
            radius += radiusIncrement;
        }
    }

    if (currentTranslation1 >= translationBoundary) {
        translationSpeed1 = -Math.abs(translationSpeed1);
    } else if (currentTranslation1 <= -translationBoundary) {
        translationSpeed1 = Math.abs(translationSpeed1);
    }
    currentTranslation1 += translationSpeed1 * deltaTime;

    if (currentTranslation2 >= translationBoundary) {
        translationSpeed2 = -Math.abs(translationSpeed2);
    } else if (currentTranslation2 <= -translationBoundary) {
        translationSpeed2 = Math.abs(translationSpeed2);
    }
    currentTranslation2 += translationSpeed2 * deltaTime;

    if (currentAmp >= ampBoundary) {
        if (ampBoundary > ampBoundaryMin) {
            ampBoundary -= ampBoundaryDecay;
        }
        ampIncrement = -Math.abs(ampIncrement);
    } else if (currentAmp <= -ampBoundary) {
        if (ampBoundary > ampBoundaryMin) {
            ampBoundary -= ampBoundaryDecay;   
        }
        ampIncrement = Math.abs(ampIncrement);
    }
    if (currentJellyJiggle > 0) {
        currentJellyJiggle -= jellyJiggleDecay * deltaTime;
    }
    currentAmp += ampIncrement * deltaTime * currentJellyJiggle;
    
    //currentAmp = changeJellyValue(currentAmp, ampLower, ampUpper);
    //currentSineCount = changeJellyValue(currentSineCount, sineCountLower, sineCountUpper);

    // Draw jelly circle
    //drawHeadshot();
    drawJellyCircle(deltaTime);
    // Draw headshot
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
    //ctx.save();
    //ctx.setTransform(1, 0, 0, 1, 0, 0);
    //ctx.fillStyle = 'rgba(102, 204, 255, 1)';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctx.restore();
    ctx.save();

    //ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    const grd = ctx.createRadialGradient(centerX, centerY, radius / 1.5, centerX + radius / 8, centerY + radius / 8, radius * 2);
    grd.addColorStop(1, "blue");
    grd.addColorStop(0, "white");
    ctx.fillStyle = grd;

    ctx.beginPath();

    if (currentSineCount <= sineCountLower) {
        lastRotation1 = lastRotation1 + rotationSpeed1 * deltaTime;
        ctx.translate(centerX, centerY);
        ctx.rotate(lastRotation1);
        ctx.translate(-centerX, -centerY);
        ampDuration = 3;
        //ctx.save();
        //ctx.setTransform(1, 0, 0, 1, 0, 0);
        //lastRotation2 = lastRotation2 + rotationSpeed2 * deltaTime;
        //ctx.translate(centerX, centerY);
        //ctx.rotate(lastRotation2);
        //ctx.translate(-centerX, -centerY);
        //for(var i=0;i<360;i++){
        //    var angle=i*Math.PI/180;
        //    var pt=sineCircleXYatAngle(centerX,centerY,radius,currentAmp,angle,1);
        //    ctx.lineTo(pt.x,pt.y);
        //}
        //ctx.restore();

    } else {
        ampDuration = 0.5;
        lastRotation1 = 0;
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    lastRotation2 = lastRotation2 + rotationSpeed2 * deltaTime;
    ctx.translate(centerX, centerY);
    ctx.rotate(lastRotation2);
    ctx.translate(-centerX, -centerY);
    ctx.translate(currentTranslation1, currentTranslation1);
    for(var i=0;i<360;i++){
        var angle=i*Math.PI/180;
        var pt=sineCircleXYatAngle(centerX,centerY,radius-50,currentAmp,angle,currentSineCount);
        ctx.lineTo(pt.x,pt.y);
    }
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    lastRotation3 = lastRotation3 + rotationSpeed3 * deltaTime;
    ctx.translate(centerX, centerY);
    ctx.rotate(lastRotation3);
    ctx.translate(-centerX, -centerY);
    ctx.translate(currentTranslation2, currentTranslation2);
    for(var i=0;i<360;i++){
        var angle=i*Math.PI/180;
        var pt=sineCircleXYatAngle(centerX,centerY,radius-50,currentAmp,angle,currentSineCount);
        ctx.lineTo(pt.x,pt.y);
    }
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    lastRotation4 = lastRotation4 + rotationSpeed4 * deltaTime;
    ctx.translate(centerX, centerY);
    ctx.rotate(lastRotation4);
    ctx.translate(-centerX, -centerY);
    ctx.translate(currentTranslation3, currentTranslation3);
    for(var i=0;i<360;i++){
        var angle=i*Math.PI/180;
        var pt=sineCircleXYatAngle(centerX,centerY,radius-50,currentAmp,angle,currentSineCount);
        ctx.lineTo(pt.x,pt.y);
    }
    ctx.fill();
    ctx.restore();

    //ctx.closePath();
    //ctx.fill();

    //ctx.beginPath();
    for(var i=0;i<360;i++){
        var angle=i*Math.PI/180;
        var pt=sineCircleXYatAngle(centerX,centerY,radius-50,currentAmp,angle,currentSineCount);
        ctx.lineTo(pt.x,pt.y);
    }

    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.closePath();

    ctx.clip();
    
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fill();

    ctx.drawImage(headshotImg, centerX - radius, centerX - radius * 2, radius * 2, radius * 4);

    //ctx.stroke();
    ctx.restore();
}

function sineCircleXYatAngle(centerX,centerY,radius,currentAmp,angle,currentSineCount){
    var x = centerX+(radius+currentAmp*Math.sin(currentSineCount*angle))*Math.cos(angle);
    var y = centerY+(radius+currentAmp*Math.sin(currentSineCount*angle))*Math.sin(angle);
    return({x:x,y:y});
}

// Draw headshot
function drawHeadshot() {
    ctx.drawImage(headshotImg, centerX - radius, centerY - radius, radius * 2, radius * 2);
}

// Ripple effect on mouse move
window.addEventListener('mousemove', function(event) {
    var mouseX = (event.clientX - canvas.offsetLeft) * (canvas.width / canvas.offsetWidth);
    var mouseY = (event.clientY - canvas.offsetTop) * (canvas.height / canvas.offsetHeight);
    var currentDistance = Math.sqrt(Math.pow(centerX - mouseX, 2) + Math.pow(centerY - mouseY, 2));
    
    if ((currentDistance < radius)) {
        var angle = Math.atan2(mouseY - centerY, mouseX - centerX) + Math.PI;

        //var amp = Math.sqrt(Math.pow(lastMouseX - mouseX, 2) + Math.pow(lastMouseY - mouseY, 2)) * mousePowerModifier;
        //if (amp > ampBoundary) {
        //    ampBoundary = amp;
        //    if (amp > ampMax) {
        //        ampBoundary = ampMax;
        //    }
        //}

        var jellyJiggle = Math.sqrt(Math.pow(lastMouseX - mouseX, 2) + Math.pow(lastMouseY - mouseY, 2)) * 20;
        if (jellyJiggle > currentJellyJiggle) {
            currentJellyJiggle = jellyJiggle;
            if (currentJellyJiggle > jellyJiggleMax) {
                currentJellyJiggle = jellyJiggleMax;
            }
        }

        ctx.translate(centerX, centerY);
        ctx.rotate(angle - lastAngle);
        ctx.translate(-centerX, -centerY);
        lastAngle = angle;
        sineTarget = sineCountUpper;
    }

    if (currentDistance < radius) {
        radiusTarget = largeRadius;
    } else {
        radiusTarget = smallRadius;
    }
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    lastDistance = currentDistance;
});

resizeCanvas();
requestAnimationFrame(animate);