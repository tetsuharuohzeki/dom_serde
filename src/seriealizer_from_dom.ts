import { Nullable } from 'option-t/esm/Nullable/Nullable';
import {
    SerializedAttribute,
    SerializedElement,
    SerializedFragment,
    SerializedNode,
    SerializedNodeType,
    SerializedText,
} from './tree_ir';

import possibleStandardNames from './third_party/react/possibleStandardNames';
import { isDomElement, isDomTextNode } from './assertion/dom';

export function serializeTree(root: DocumentFragment): SerializedFragment {
    const children = serializeChildNodes(root);
    const result: SerializedFragment = {
        type: SerializedNodeType.DocumentFragment,
        children,
    };

    return result;
}

function serializeChildNodes(root: Node): Array<SerializedNode> {
    const children: Array<SerializedNode> = [];
    const realChildNodes = root.childNodes;
    for (let i = 0, l = realChildNodes.length; i < l; ++i) {
        const child = realChildNodes[i];
        if (!child) {
            throw new RangeError('this loop iteration is something wrong');
        }

        const serialized = serializeRealNode(child);
        if (!serialized) {
            continue;
        }
        children.push(serialized);
    }
    return children;
}

function serializeRealNode(root: Node): Nullable<SerializedNode> {
    if (isDomElement(root)) {
        return serializeRealElement(root);
    }

    if (isDomTextNode(root)) {
        return serializeRealTextNode(root);
    }

    // unsupported node
    return null;
}

function serializeRealElement(root: Element): SerializedElement {
    const type = SerializedNodeType.Element;
    const namespace = root.prefix;
    const localname = root.localName;
    const attributes = serializeAttributes(root);
    const children = serializeChildNodes(root);
    const element: SerializedElement = {
        type,
        namespace,
        localname,
        attributes,
        children,
    };

    return element;
}

function serializeAttributes(element: Element): Array<SerializedAttribute> {
    const attributes: Array<SerializedAttribute> = [];
    const realAttributes = element.attributes;
    for (let i = 0, l = realAttributes.length; i < l; ++i) {
        const real = realAttributes.item(i);
        if (real === null) {
            throw new RangeError();
        }

        const name = real.name;
        const value = real.value;

        const reactName: Nullable<string> = possibleStandardNames[name] ?? null;
        const serialized: SerializedAttribute = {
            name,
            reactName,
            value,
        };

        attributes.push(serialized);
    }
    return attributes;
}

function serializeRealTextNode(root: Text): SerializedText {
    const type = SerializedNodeType.Text;
    const text = root.textContent ?? '';

    const serialized: SerializedText = {
        type,
        text,
        children: [],
    };
    return serialized;
}
