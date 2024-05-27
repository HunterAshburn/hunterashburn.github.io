const conveyorBeltElements = document.querySelectorAll('.conveyor-belt');
const leftBeltElements = document.querySelectorAll('.conveyor-belt-left');
const rightBeltElements = document.querySelectorAll('.conveyor-belt-right');

const conveyorBelts = [];
const leftBelts = [];
const rightBelts = [];

function ConveyorBelt(element) {
    this.element = element;
    this.beltWidth = 0;
    this.containerWidth = 0;
    this.itemWidth = 0;
    this.lastTime = 0;
}

conveyorBeltElements.forEach(conveyorBelt => {
    conveyorBelts.push(new ConveyorBelt(conveyorBelt));
});

leftBeltElements.forEach(conveyorBelt => {
    leftBelts.push(new ConveyorBelt(conveyorBelt));
});

rightBeltElements.forEach(conveyorBelt => {
    rightBelts.push(new ConveyorBelt(conveyorBelt));
});

conveyorBelts.forEach(conveyorBelt => {

    function extendBelt() {
        const items = conveyorBelt.element.querySelectorAll('.tech-box');
        conveyorBelt.itemWidth = conveyorBelt.element.querySelector('.tech-box').offsetWidth;
        conveyorBelt.beltWidth = conveyorBelt.element.offsetWidth;
        conveyorBelt.containerWidth = conveyorBelt.element.parentElement.offsetWidth;
        
        while (conveyorBelt.containerWidth + conveyorBelt.itemWidth * 4 > conveyorBelt.beltWidth) {
            items.forEach(item => {
                conveyorBelt.element.appendChild(item.cloneNode(true));
            });
            conveyorBelt.beltWidth = conveyorBelt.element.offsetWidth;
        }

        console.log("AHHHH");
    }

    function animate(currentTime) {
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
    
    }

    window.addEventListener('resize', extendBelt);

    extendBelt();
    requestAnimationFrame(animate);
});

leftBelts.forEach(conveyorBelt => {

    
});

rightBelts.forEach(conveyorBelt => {
    
});