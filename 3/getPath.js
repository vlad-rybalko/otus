function getPath(element) {
    if (!(element instanceof Element))
        return;

    const selectors = [];

    while (element.parentElement) {
        let selector = element.tagName.toLowerCase();

        if (element.id) {
            selector += `#${element.id}`;
            selectors.unshift(selector);
            break;
        } else {
            const classes = Array.from(element.classList);
            const index = Array.from(element.parentElement.children).indexOf(element) + 1;
            selector += classes.length > 0 ? `.${classes.join('.')}:nth-child(${index})` : `:nth-child(${index})`;

            selectors.unshift(selector);
        }

        element = element.parentElement;
    }

    return selectors.join(' ');
}

module.exports = getPath;
