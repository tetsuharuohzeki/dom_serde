import { Nullable } from 'option-t/esm/Nullable/Nullable';
import { assertIsSerializedElement, assertIsSerializedText } from './assertion/tree_ir';
import { SerializedElement, SerializedFragment, SerializedNode, SerializedNodeType, SerializedText } from './tree_ir';

export function deserializeTree(root: SerializedFragment): DocumentFragment {
    const fragment = deserializeChildNodes(root);
    return fragment;
}

function deserializeChildNodes(root: SerializedNode): DocumentFragment {
    const fragment = document.createDocumentFragment();
    for (const child of root.children) {
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
    element.appendChild(fragment);

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
