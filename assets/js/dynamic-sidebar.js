const sidebarList = document.getElementById('sidebar-list');
const listItems = sidebarList.querySelectorAll('li');
const hrs = sidebarList.querySelectorAll('hr');
const contentItems = document.querySelectorAll('.sidebar-content-item');

const navbar = document.getElementById('header-layout');
const belowNavbarSpacer = 10;

const viewingColorHex = getComputedStyle(root).getPropertyValue('--sidebar-viewing-color').trim();
const viewingColor = hexToRgb(viewingColorHex);
const notViewingColor = hexToRgb(getComputedStyle(root).getPropertyValue('--sidebar-not-viewing-color').trim());
const darkTextColor = getComputedStyle(root).getPropertyValue('--dark-text-color').trim();

const baselineFontSizeElement = document.getElementById('javascript-li-font-size-baseline');
const fontSizeMultiplier = 1.2;

const cssListItemHoverClass = 'sidebar-li-hover'
const cssHoverTransitionSpeed = '0.15s'


// Adds hover styling to a sidebar list item, as well as the adjacent hr elements
function addHoverStyle() {
    const index = Array.from(listItems).indexOf(this);

    this.classList.add(cssListItemHoverClass);
    this.style.transition = 
        'background-color ' + cssHoverTransitionSpeed + 
        ', color ' + cssHoverTransitionSpeed + 
        ', font-size ' + cssHoverTransitionSpeed;
    this.style.color = darkTextColor;
    this.style.fontSize = interpolateFontSize(1) + 'px';

    if (index > 0) {
        const prevHr = hrs[index - 1];
        prevHr.style.transition = 'border-color ' + cssHoverTransitionSpeed;
        prevHr.style.borderColor = viewingColorHex;
    }

    if (index < listItems.length - 1) {
        const nextHr = hrs[index];
        nextHr.style.transition = 'border-color ' + cssHoverTransitionSpeed;
        nextHr.style.borderColor = viewingColorHex;
    }
}

// Removes hover styling from a sidebar list item, as well as the adjacent hr elements
function removeHoverStyle() {
    const index = Array.from(listItems).indexOf(this);

    this.classList.remove(cssListItemHoverClass);
    updateSidebarItem(listItems[index], index);

    if (index > 0) {
        updateSidebarItemBorder(index);
    }

    if (index < listItems.length - 1) {
        updateSidebarItemBorder(index + 1);
    }
}

// Causes the viewport to scroll to the content on the page that is logically linked to the sidebar item being clicked on
function listItemClick() {
    const index = Array.from(listItems).indexOf(this);
    
    window.scrollTo({
        top: contentItems[index].getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - belowNavbarSpacer,
        behavior: 'smooth'
    });
}

// Creates a new color between two colors.
// Percentage closer to 0 means the new color is closer to color1.
// Percentage closer to 1 means the new color is closer to color2.
function interpolateColor(color1, color2, percentage) {
    let result = color1.slice();

    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + percentage * (color2[i] - color1[i]));
    }

    return 'rgb(' + result.join(', ') + ')';
}

// Converts a hex value to an rgb array
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');

    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return [r, g, b];
}

// Converts an rgb string to an rgb array
function rgbStringToRgb(rgbString) {
    return rgbString.match(/\d+/g).map(Number);
}

// Creates a new font size between an upper and lower size.
// Percentage closer to 0 means the new size is closer to the lower size.
// Percentage closer to 1 means the new size is closer to the upper size.
function interpolateFontSize(percentage) {
    const lowerSize = parseFloat(window.getComputedStyle(baselineFontSizeElement).fontSize);
    const upperSize = lowerSize * fontSizeMultiplier;

    return (lowerSize + (upperSize - lowerSize) * percentage);
}

// Calculates a percentage (value between 0 and 1).
// When the element is larger than the viewport, the return value is the percent of the viewport that is taken up by the element.
// When the viewport is larger than the element, the return value is the percent of the element that the viewport can see.
function elementVisibilityPercentage(element) {
    const elementRect = element.getBoundingClientRect();
    const elementTop = elementRect.top;
    const elementBottom = elementRect.bottom;
    const elementHeight = elementRect.height;

    const viewportHeight = window.innerHeight;
    const viewportTop = 0;

    if (elementBottom < viewportTop || elementTop > viewportHeight) {
        return 0;
    }

    const visibleHeight = Math.min(elementBottom, viewportHeight) - Math.max(elementTop, viewportTop);

    if (elementHeight > viewportHeight) {
        return (visibleHeight  / viewportHeight);
    } else {
        return (visibleHeight / elementHeight);
    }
}

// Obtains a percentage and styles a sidebar list item accordingly.
function updateSidebarItem(listItem, i) {
    visibilityPercentage = elementVisibilityPercentage(contentItems[i]);
    listItem.style.color = interpolateColor(notViewingColor, viewingColor, visibilityPercentage);
    listItem.style.fontSize = interpolateFontSize(visibilityPercentage) + 'px';
}

// Styles an hr element.
function updateSidebarItemBorder(i) {
    hrs[i - 1].style.borderColor = interpolateColor(rgbStringToRgb(listItems[i - 1].style.color), rgbStringToRgb(listItems[i].style.color), 0.5);
}

// Iterates through all sidebar list items so they can be styled under the right conditions.
function updateSidebar() {
    for (let i = 0; i < contentItems.length; i++) {
        const listItem = listItems[i];

        if (!listItem.classList.contains(cssListItemHoverClass)) {
            listItem.style.transition = '';
            updateSidebarItem(listItem, i);
        
            if (i > 0 && !listItems[i - 1].classList.contains(cssListItemHoverClass)) {
                hrs[i - 1].style.transition = '';
                updateSidebarItemBorder(i);
            }
        }
    }
}

// Trigger updateSidebar() when the page is scrolled.
window.addEventListener('scroll', updateSidebar);

// Trigger updateSidebar() when the window is resized.
window.addEventListener('resize', updateSidebar);

// Trigger addHoverStyle() when a sidebar list item is hovered over.
// Trigger removeHoverStyle() when a sidebar list item is no longer hovered over.
// Trigger listItemClick() when a sidebar list item is clicked on.
listItems.forEach(function(item) {
    item.addEventListener('mouseover', addHoverStyle);
    item.addEventListener('mouseout', removeHoverStyle);
    item.addEventListener('click', listItemClick);
});


// Trigger updateSidebar() to initialize the styling of sidebar list items.
updateSidebar();