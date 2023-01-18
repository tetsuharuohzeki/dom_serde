import { Nullable } from 'option-t/esm/Nullable/Nullable';
import { assertIsSerializedElement, assertIsSerializedText } from './assertion/tree_ir.js';
import {
    SerializedElement,
    SerializedFragment,
    SerializedNode,
    SerializedNodeType,
    SerializedText,
} from './tree_ir.js';

export function deserializeTree(root: SerializedFragment): Nullable<DocumentFragment> {
    const fragment = deserializeChildNodes(root);
    return fragment;
}

function deserializeChildNodes(root: SerializedNode): Nullable<DocumentFragment> {
    const children = root.children;
    if (children.length === 0) {
        return null;
    }

    const fragment = document.createDocumentFragment();
    for (const child of children) {
        const node = deserializeNode(child);
        if (!node) {
            continue;
        }

        fragment.appendChild(fragment);
    }

    return fragment;
}

function deserializeNode(root: SerializedNode): Nullable<Node> {
    switch (root.type) {
        case SerializedNodeType.Element:
            assertIsSerializedElement(root);
            return deserializeElement(root);
        case SerializedNodeType.Text:
            assertIsSerializedText(root);
            return deserializeTextNode(root);
        default:
            throw new TypeError(`unknown SerializedNodeType: ${root.type}`);
    }
}

function deserializeElement(root: SerializedElement): Element {
    const localname = root.localname;
    const element = document.createElement(localname);

    for (const source of root.attributes) {
        const name = source.name;
        const value = source.value;
        element.setAttribute(name, value);
    }

    const fragment = deserializeChildNodes(root);
    if (fragment !== null) {
        element.appendChild(fragment);
    }

    return element;
}

function deserializeTextNode(root: SerializedText): Nullable<Text> {
    const text = root.text;
    if (text === null) {
        return null;
    }

    const t = document.createTextNode(text);
    return t;
}
