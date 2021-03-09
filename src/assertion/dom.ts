// see https://dom.spec.whatwg.org/#dom-node-nodetype
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

export function isDomElement(node: Node): node is Element {
    return node.nodeType === ELEMENT_NODE;
}

export function isDomTextNode(node: Node): node is Text {
    return node.nodeType === TEXT_NODE;
}
