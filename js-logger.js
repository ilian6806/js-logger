/**
 * Log formated html element
 */
console.traverseHTMLElement = function (element) {
    function traverse(element, spacing) {

        var nodeName = element.nodeName.toLowerCase();
        var startTag = element.outerHTML.slice(0, element.outerHTML.indexOf('>') + 1)
        var endTag = '</' + nodeName + '>';
        var tab = '   ';

        // Empty element or element with one empty text node
        if (!element.childNodes.length || 
           (element.childNodes.length == 1 &&
            element.childNodes[0].nodeType === 3 &&
           !element.childNodes[0].nodeValue.trim().length)) {
                console.log(spacing + startTag + endTag);
                return;
        }

        console.log(spacing + startTag);

        for (var i = 0, len = element.childNodes.length; i < len; i += 1) {
            var child = element.childNodes[i];
            if (child.nodeType === 1) { // Element
                traverse(child, spacing + tab);
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
                console.log(spacing + tab + '<!-- ' +child.nodeValue + ' -->');
            }
        }

        console.log(spacing + endTag);
    }
    traverse(element, '');
}

/**
 * Custom log metohd for development 
 */
window.log = function (message, separator, title) {

    var log = '';
    var method = 'log';

    if (separator) console.log(separator);

    if (message instanceof jQuery) {
        message = message[0];
    }

    if (message instanceof HTMLElement) {
        method = 'traverseHTMLElement';
        log = message;
    } else if (message instanceof Array) {
        log = JSON.stringify(message);
    } else if (message instanceof Object) {
        log = JSON.stringify(message, JSON.replacer, JSON.indent);
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
function cssInspect(selector) {

    var dom = $(selector)[0];
    var style;
    var returns = {};
    var header = '--------CSS Inspect-----------\n';
    header += 'TAG: ' + dom.tagName + '\n';
    header += 'ID: ' + dom.id + '\n';
    header += 'CLASS: ' + dom.className + '\n';
    header += 'HTML:\n' + dom.outerHTML + '\n\n';
    header += 'CSS:';

    log(header);

    if (window.getComputedStyle) {
        var camelize = function (a, b) {
            return b.toUpperCase();
        };
        style = window.getComputedStyle(dom, null);
        for (var i = 0, l = style.length; i < l; i++) {
            var prop = style[i];
            var camel = prop.replace(/\-([a-z])/g, camelize);
            var val = style.getPropertyValue(prop);
            returns[camel] = val;
        }
        log(returns);
        return;
    }
    if (style = dom.currentStyle) {
        for (var prop in style) {
            returns[prop] = style[prop];
        }
        log(returns);
        return;
    }
    log($(dom).css());
}
