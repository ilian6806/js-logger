/**
 * Log formated html element
 */
console.traverseHTMLElement = function (element, spacing) {

    if (!element) {
        throw '[traverseHTMLElement]: No HTML element provided as first argument';
    }

    spacing = spacing || '';

    var nodeName = element.nodeName.toLowerCase();
    var startTag = element.outerHTML.slice(0, element.outerHTML.indexOf('>') + 1)
    var endTag = '</' + nodeName + '>';
    var tab = '   ';

    // Empty element or element with one empty text node
    if (!element.childNodes.length ||
       (element.childNodes.length === 1 &&
        element.childNodes[0].nodeType === 3 &&
       !element.childNodes[0].nodeValue.trim().length)) {
            console.log(spacing + startTag + endTag);
            return;
    }

    console.log(spacing + startTag);

    for (var i = 0, len = element.childNodes.length; i < len; i += 1) {
        var child = element.childNodes[i];
        if (child.nodeType === 1) { // Element
            console.traverseHTMLElement(child, spacing + tab);
        }
        if (child.nodeType === 3) { // Text
            var length = child.nodeValue.trim();
            if (length) {
                if (child.nodeValue.indexOf('\n') > -1) {
                    console.log(child.nodeValue.replace(/\n/g, '\n' + spacing + tab));
                } else {
                    console.log(spacing + tab + child.nodeValue);
                }
            }
        }
        if (child.nodeType === 8) { // Comment
            console.log(spacing + tab + '<!-- ' + child.nodeValue + ' -->');
        }
    }

    console.log(spacing + endTag);
}

/**
 * Custom log metohd for development
 */
window.log = function (message, separator, title) {

    var log = '';
    var method = 'log';

    if (separator) console.log(separator);

    if (window.jQuery && message instanceof jQuery) {
        message = message[0];
    }

    if (message instanceof HTMLElement) {
        method = 'traverseHTMLElement';
        log = message;
    } else if (message instanceof Array) {
        log = JSON.stringify(message);
    } else if (message instanceof Object) {
        if (message.constructor === Function) {
            log = message;
        } else {
            log = JSON.stringify(message, JSON.replacer, JSON.indent);
        }
    } else {
        log = message;
    }

    if (title) {
        console.log(title.toUpperCase() + ': ' + log);
    } else {
        console[method](log);
    }

    if (separator) console.log(separator);
}

/**
 * Returns tag, id, class, html and all computed styles for html element
 */
window.cssInspect = function(selector) {

    var element = document.querySelector(selector);

    if (!element) {
        throw '[cssInspect]: Can\'t find element with selector "' + selector + '".';
    }

    var style;
    var returns = {};
    var header = '--------CSS Inspect-----------\n';
    header += 'TAG: ' + element.tagName + '\n';
    header += 'ID: ' + element.id + '\n';
    header += 'CLASS: ' + element.className + '\n';
    header += 'HTML:\n' + element.outerHTML + '\n\n';
    header += 'CSS:';

    log(header);

    if (window.getComputedStyle) {
        style = window.getComputedStyle(element, null);
        for (var i = 0, l = style.length; i < l; i++) {
            var prop = style[i];
            var camel = prop.replace(/\-([a-z])/g, function (a, b) {
                return b.toUpperCase();
            });
            var val = style.getPropertyValue(prop);
            returns[camel] = val;
        }
        log(returns);
        return;
    }

    if (style === element.currentStyle) {
        for (var pr in style) {
            if (style.hasOwnProperty(pr)) {
                returns[pr] = style[pr];
            }
        }
        log(returns);
        return;
    }

    if (window.jQuery) {
        log($(element).css());
    }
}
