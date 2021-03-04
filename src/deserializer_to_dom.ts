import { Nullable } from 'option-t/esm/Nullable/Nullable';
import { SerializedElement, SerializedFragment, SerializedNode, SerializedNodeType, SerializedText } from './tree_ir';

export function deserializeTree(root: SerializedFragment): DocumentFragment {
    const fragment = document.createDocumentFragment();

    for (const child of root.children) {
        const domChild = deserializeNode(child);
        if (!domChild) {
            continue;
        }

        fragment.appendChild(fragment);
    }

    return fragment;
}

function deserializeNode(root: SerializedNode): Nullable<Node> {
    switch (root.type) {
        case SerializedNodeType.Element:
            // @ts-expect-error
            return deserializeElement(root);
        case SerializedNodeType.Text:
            // @ts-expect-error
            return deserializeTextNode(root);
        default:
            throw new TypeError();
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

    for (const source of root.children) {
        const child = deserializeNode(source);
        if (!child) {
            continue;
        }

        element.appendChild(child);
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
