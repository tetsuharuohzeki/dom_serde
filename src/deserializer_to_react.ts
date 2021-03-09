import { Nullable } from 'option-t/esm/Nullable/Nullable';
import * as React from 'react';
import { assertIsSerializedElement, assertIsSerializedText } from './assertion/tree_ir';
import { SerializedElement, SerializedFragment, SerializedNode, SerializedNodeType, SerializedText } from './tree_ir';

type MaterialNode = React.ReactChild;
type MaterialText = React.ReactText;

export function deserializeTree(root: SerializedFragment): Array<MaterialNode> {
    const children = deserializeChildNodes(root);
    return children;
}

function deserializeChildNodes(root: SerializedNode): Array<MaterialNode> {
    const children: Array<MaterialNode> = [];
    for (const child of root.children) {
        const node = deserializeNode(child);
        if (!node) {
            continue;
        }
        children.push(node);
    }

    return children;
}

function deserializeNode(root: SerializedNode): Nullable<MaterialNode> {
    let serialized: Nullable<MaterialNode>;
    switch (root.type) {
        case SerializedNodeType.Element:
            assertIsSerializedElement(root);
            serialized = deserializeElement(root);
            break;
        case SerializedNodeType.Text:
            assertIsSerializedText(root);
            serialized = deserializeTextNode(root);
            break;
        default:
            throw new TypeError(`unknown SerializedNodeType: ${root.type}`);
    }

    return serialized;
}

function deserializeElement(root: SerializedElement): MaterialNode {
    const localname = root.localname;
    const props = deserializeAttributes(root);
    const children = deserializeChildNodes(root);
    const element: React.ReactElement = React.createElement(localname, props, ...children);
    return element;
}

function deserializeAttributes(root: SerializedElement): object {
    const props = Object.create(null);
    for (const source of root.attributes) {
        const reactName = source.reactName;
        let propsName: string;
        if (reactName === null || reactName === '') {
            const name = source.name;
            propsName = name;
        } else {
            propsName = reactName;
        }

        const value = source.value;
        props[propsName] = value;
    }
    return props;
}

function deserializeTextNode(root: SerializedText): Nullable<MaterialText> {
    return root.text;
}
