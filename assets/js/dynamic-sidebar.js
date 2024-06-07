const sidebarList = document.getElementById('sidebar-list');
const listItems = sidebarList.querySelectorAll('li');
const hrs = sidebarList.querySelectorAll('hr');
const contentItems = document.querySelectorAll('.sidebar-content-item');

const viewingColor = hexToRgb(getComputedStyle(root).getPropertyValue('--sidebar-viewing-color').trim());
const notViewingColor = hexToRgb(getComputedStyle(root).getPropertyValue('--sidebar-not-viewing-color').trim());

const lowerFontSize = 1;
const upperFontSize = 1.2;

function interpolateColor(color1, color2, percentage) {
    let result = color1.slice();

    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + percentage * (color2[i] - color1[i]));
    }

    return 'rgb(' + result.join(', ') + ')';
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');

    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return [r, g, b];
}

function rgbStringToRgb(rgbString) {
    return rgbString.match(/\d+/g).map(Number);
}

function interpolateFontSize(lowerSize, upperSize, percentage) {
    return (lowerSize + (upperSize - lowerSize) * percentage);
}

function elementVisibilityPercentage(element) {
    const elementRect = element.getBoundingClientRect();
    const elementTop = elementRect.top;
    const elementBottom = elementRect.bottom;
    const elementHeight = elementRect.height;

    const viewportHeight = window.innerHeight;
    const viewportTop = 0;
    const viewportBottom = viewportTop + viewportHeight;

    if (elementBottom < viewportTop || elementTop > viewportBottom) {
        return 0;
    }

    if (elementTop <= viewportTop && elementBottom >= viewportBottom) {
        return 1;
    }

    const visibleHeight = Math.min(elementBottom, viewportBottom) - Math.max(elementTop, viewportTop);
    const percentageVisible = (visibleHeight / elementHeight);

    return percentageVisible;
}

function updateSidebar() {
    for (let i = 0; i < contentItems.length; i++) {
        visibilityPercentage = elementVisibilityPercentage(contentItems[i]);
        listItems[i].style.color = interpolateColor(notViewingColor, viewingColor, visibilityPercentage);
        listItems[i].style.fontSize = interpolateFontSize(lowerFontSize, upperFontSize, visibilityPercentage) + 'em';

        if (i > 0) {
            hrs[i - 1].style.borderColor = interpolateColor(rgbStringToRgb(listItems[i - 1].style.color), rgbStringToRgb(listItems[i].style.color), 0.5);
        }
    }
}

window.addEventListener('scroll', updateSidebar);

window.addEventListener('resize', updateSidebar);


updateSidebar();