import test from 'ava';
import { JSDOM } from 'jsdom';

import { isDomElement, isDomTextNode } from '../dom.js';

const HTML = `<!DOCTYPE html>
<html>
</html>
`;

const ORIGIN_URL = 'https://example.com/';

function createJsDomWindow() {
    const { window } = new JSDOM(HTML, {
        url: ORIGIN_URL,
        referrer: ORIGIN_URL,
        contentType: 'text/html',
    });
    return window;
}

// This should cover https://dom.spec.whatwg.org/#dom-node-nodetype;
let elementNode: Node;
let attrNode: Node;
let textNode: Node;
let cdataNode: Node;
let processingInstructionNode: Node;
let commentNode: Node;
let documentNode: Node;
let documentTypeNode: Node;
let documentFragmentNode: Node;

test.before(() => {
    const window = createJsDomWindow();
    const document = window.document;

    elementNode = document.createElement('h1');
    attrNode = document.createAttribute('attr');
    textNode = document.createTextNode('text');

    const xmlDoc = new window.DOMParser().parseFromString('<xml></xml>', 'application/xml');
    cdataNode = xmlDoc.createCDATASection('cdata');

    processingInstructionNode = document.createProcessingInstruction('processing', 'inst');
    commentNode = document.createComment('comment');
    documentNode = document;
    documentTypeNode = document.doctype!;
    documentFragmentNode = document.createDocumentFragment();
});

test(`isDomElement`, (t) => {
    const testcase: Array<[Node, boolean]> = [
        [elementNode, true],
        [attrNode, false],
        [textNode, false],
        [cdataNode, false],
        [processingInstructionNode, false],
        [commentNode, false],
        [documentNode, false],
        [documentTypeNode, false],
        [documentFragmentNode, false],
    ];

    for (const [value, ok] of testcase) {
        const type = value.nodeType;
        t.is(isDomElement(value), ok, `with nodeType: ${type}`);
    }
});

test(`isDomTextNode`, (t) => {
    const testcase: Array<[Node, boolean]> = [
        [elementNode, false],
        [attrNode, false],
        [textNode, true],
        [cdataNode, false],
        [processingInstructionNode, false],
        [commentNode, false],
        [documentNode, false],
        [documentTypeNode, false],
        [documentFragmentNode, false],
    ];

    for (const [value, ok] of testcase) {
        const type = value.nodeType;
        t.is(isDomTextNode(value), ok, `with nodeType: ${type}`);
    }
});
