const canvas = document.getElementById('jelly-canvas');
const ctx = canvas.getContext('2d');

const headshotGradientColor = getComputedStyle(root).getPropertyValue('--headshot-color').trim();
const headshotImg = new Image();
headshotImg.src = '/assets/images/jellyHeadshot.png';

// Canvas center coordinates
let centerX, centerY;

// Radius properties of all jelly circles
let currentRadius, smallRadius, largeRadius, radiusModifier, radiusTarget, radiusIncrement;

// Amplitude properties of all jelly circles
let currentAmp, ampBoundary, ampIncrement;

// Jiggle properties of all jelly circles
let currentJellyJiggle;
let jellyJiggleMin;
const jellyJiggleMax = 350;
const jellyJiggleDecay = 100;

// Sine wave count for all jelly circles
const sineCount = 3;

// Maximum distance of a jelly circle from the center of the canvas
let translationBoundary;

// Collection of jelly circles.
// Arguments arbitrarily chosen, except 0 for translationSpeed on the last jelly circle so it stays centered.
const jellyCircles = [
    new JellyCircle(0, 20, 90, 0.5),
    new JellyCircle(0, 15, 180, 0.3),
    new JellyCircle(0, 10, 270, -0.4),
    new JellyCircle(0, 0, 0, -0.2),
];

// Last animation frame time
let lastTime = 0;

// Mouse related variables
let lastMouseX, lastMouseY, mousePowerModifier;


// Numbers used to create ratios for consistent functionality across jelly-headshot sizes.
// Numbers specifically chosen based on what looks good.
function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.width;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    smallRadius = canvas.width / 2.5;
    largeRadius = canvas.width / 2.2;
    currentRadius = smallRadius;
    radiusTarget = smallRadius;
    radiusModifier = canvas.clientWidth / 7.2;
    radiusIncrement = canvas.clientWidth / 1;
    ampBoundary = canvas.clientWidth / 45;
    ampIncrement = canvas.clientWidth / 360;
    currentAmp = ampBoundary;
    jellyJiggleMin = canvas.clientWidth / 360;
    currentJellyJiggle = jellyJiggleMin;
    translationBoundary = canvas.clientWidth / 7.2;
    mousePowerModifier = canvas.clientWidth / 18;
}

// Constructor for a jelly circle
function JellyCircle(startingTranslation, translationSpeed, startingRotation, rotationSpeed) {
    this.currentTranslation = startingTranslation;
    this.translationSpeed = translationSpeed;
    this.currentRotation = startingRotation;
    this.rotationSpeed = rotationSpeed;

    // Calculates and sets the rotation for the jelly circle on the current frame
    this.calculateRotation = function(deltaTime) {
        this.currentRotation = this.currentRotation + this.rotationSpeed * deltaTime;
    }

    // Calculates and sets the distance from the center of the canvas for the jelly circle on the current frame
    this.calculateTranslation = function(deltaTime) {
        if (Math.abs(this.currentTranslation) >= translationBoundary) {
            this.translationSpeed = -Math.sign(this.currentTranslation) * Math.abs(this.translationSpeed);
        }
        this.currentTranslation += this.translationSpeed * deltaTime;
    }

    // Draws the jelly circle
    this.draw = function() {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.currentRotation);
        ctx.translate(-centerX, -centerY);
        ctx.translate(this.currentTranslation, this.currentTranslation);
        for(let i = 0; i < 360; i++){
            const angle = i * Math.PI / 180;
            const point = sineCircleXYatAngle(centerX, centerY, currentRadius - radiusModifier, currentAmp, angle, sineCount);
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.restore();
    }
}

// Utility function for calculating a point on a sine wave
function sineCircleXYatAngle(centerX, centerY, currentRadius, currentAmp, angle, sineCount){
    const x = centerX + (currentRadius + currentAmp * Math.sin(sineCount * angle)) * Math.cos(angle);
    const y = centerY + (currentRadius + currentAmp * Math.sin(sineCount * angle)) * Math.sin(angle);
    return({x:x, y:y});
}

// Animation loop
function animate(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    calculateRadius(deltaTime);
    calculateJiggle(deltaTime);
    calculateAmplitude(deltaTime);

    for (const jellyCircle of jellyCircles) {
        jellyCircle.calculateRotation(deltaTime);
        jellyCircle.calculateTranslation(deltaTime);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawJellyCircle();

    requestAnimationFrame(animate);
}

// Calculates and sets the radius of all jelly circles on the current frame
function calculateRadius(deltaTime) {
    if (currentRadius !== radiusTarget) {
        const direction = currentRadius > radiusTarget ? -1 : 1;
        currentRadius += direction * radiusIncrement * deltaTime;

        if ((direction === -1 && currentRadius < radiusTarget) || (direction === 1 && currentRadius > radiusTarget)) {
            currentRadius = radiusTarget;
        }
    }
}

// Calculates and sets the jiggle of all jelly circles on the current frame
function calculateJiggle(deltaTime) {
    currentJellyJiggle = Math.max(currentJellyJiggle - jellyJiggleDecay * deltaTime, jellyJiggleMin);
}

// Calculates and sets the amplitude of all jelly circles on the current frame
function calculateAmplitude(deltaTime) {
    if (Math.abs(currentAmp) >= ampBoundary) {
        ampIncrement = -Math.sign(currentAmp) * Math.abs(ampIncrement);
    }
    currentAmp += ampIncrement * currentJellyJiggle * deltaTime;
}

// Draws all jelly circles with the headshot and color gradient inside
function drawJellyCircle() {
    ctx.save();

    const grd = ctx.createRadialGradient(centerX, centerY, currentRadius / 1.5, centerX + currentRadius / 8, centerY + currentRadius / 8, currentRadius * 2);
    grd.addColorStop(1, headshotGradientColor);
    grd.addColorStop(0, "white");
    ctx.fillStyle = grd;

    ctx.beginPath();

    for (const jellyCircle of jellyCircles) {
        jellyCircle.draw();
    }

    ctx.closePath();
    ctx.fill();
    ctx.clip();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(headshotImg, centerX - currentRadius, centerX - currentRadius * 1.95, currentRadius * 2, currentRadius * 4);
    ctx.restore();
}

// Logic for when the mouse is within the radius of the center jelly circle
window.addEventListener('mousemove', function(event) {
    const mouseX = (event.clientX - canvas.offsetLeft) * (canvas.width / canvas.offsetWidth);
    const mouseY = (event.clientY - canvas.offsetTop) * (canvas.height / canvas.offsetHeight);
    
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < currentRadius) {
        const jellyJiggle = Math.sqrt(Math.pow(lastMouseX - mouseX, 2) + Math.pow(lastMouseY - mouseY, 2)) * mousePowerModifier;
        if (jellyJiggle > currentJellyJiggle) {
            currentJellyJiggle = Math.min(jellyJiggle, jellyJiggleMax);
        }

        radiusTarget = largeRadius;
    } else {
        radiusTarget = smallRadius;
    }
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
});

// Trigger resizeCanvas() when the window is resized
window.addEventListener('resize', resizeCanvas);


// Trigger resizeCanvas() to initialize the remaining variables
resizeCanvas();

// Start the animation loop
requestAnimationFrame(animate);