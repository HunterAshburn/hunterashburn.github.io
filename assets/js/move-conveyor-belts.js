const RIGHT = 1;
const LEFT = -1;

const rightBeltElements = document.querySelectorAll('.conveyor-belt-right');
const leftBeltElements = document.querySelectorAll('.conveyor-belt-left');

// Collection to hold conveyor belts
const conveyorBelts = [];

// Speed of all conveyor belts
const beltSpeed = 30;


// Constructor for a conveyor belt
function ConveyorBelt(element, direction) {
    this.element = element;
    this.direction = direction;
    this.lastTime = 0
    this.beltWidth;
    this.containerWidth;
    this.itemWidth;
    this.startingPos;
    this.currentDist;
    this.targetDist;
}

// Instantiates conveyor belts that will move right
rightBeltElements.forEach(conveyorBelt => {
    conveyorBelts.push(new ConveyorBelt(conveyorBelt, RIGHT));
});

// Instantiates conveyor belts that will move left
leftBeltElements.forEach(conveyorBelt => {
    conveyorBelts.push(new ConveyorBelt(conveyorBelt, LEFT));
});

// Iterate through all instantiated conveyor belts
conveyorBelts.forEach(conveyorBelt => {

    // Updates element sizing and positioning, and adds more items if necessary
    function extendBelt() {
        const items = Array.from(conveyorBelt.element.children);
        conveyorBelt.itemWidth = conveyorBelt.element.firstElementChild.offsetWidth + parseFloat(window.getComputedStyle(conveyorBelt.element).getPropertyValue('gap'));
        conveyorBelt.beltWidth = conveyorBelt.element.offsetWidth;
        conveyorBelt.containerWidth = conveyorBelt.element.parentElement.offsetWidth;
        conveyorBelt.startingPos = conveyorBelt.itemWidth * 2 * -conveyorBelt.direction;
        conveyorBelt.targetDist = conveyorBelt.itemWidth;
        
        while (conveyorBelt.containerWidth + conveyorBelt.itemWidth * 4 > conveyorBelt.beltWidth) {
            items.forEach(item => {
                conveyorBelt.element.appendChild(item.cloneNode(true));
            });
            conveyorBelt.beltWidth = conveyorBelt.element.offsetWidth;
        } 
    }

    // Resets the current distance and position
    function setToStartingPos() {
        conveyorBelt.currentDist = 0;
        conveyorBelt.element.style.transform = `translateX(${conveyorBelt.startingPos}px)`;
    }

    // Animation loop
    function animate(currentTime) {
        const deltaTime = (currentTime - conveyorBelt.lastTime) / 1000;
        conveyorBelt.lastTime = currentTime;

        conveyorBelt.currentDist += beltSpeed * deltaTime;
        conveyorBelt.element.style.transform = `translateX(${conveyorBelt.startingPos + conveyorBelt.currentDist * conveyorBelt.direction}px)`;

        if (conveyorBelt.currentDist >= conveyorBelt.targetDist) {
            switch (conveyorBelt.direction) {
                case RIGHT:
                    conveyorBelt.element.insertBefore(conveyorBelt.element.lastElementChild, conveyorBelt.element.firstElementChild);
                    break;
                case LEFT:
                    conveyorBelt.element.appendChild(conveyorBelt.element.firstElementChild);
                    break;
            }
            setToStartingPos();
        }
    
        requestAnimationFrame(animate);
    }

    // Trigger extendBelt() when the window is resized
    window.addEventListener('resize', extendBelt);


    // Trigger extendBelt() to initialize most conveyor belt properties 
    extendBelt();

    // Trigger setToStartingPos() to initialize current distance and position
    setToStartingPos();

    // Start the animation loop
    requestAnimationFrame(animate);
});