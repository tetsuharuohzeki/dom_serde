import { Nullable } from 'option-t/esm/Nullable/Nullable';
import {
    SerializedAttribute,
    SerializedElement,
    SerializedFragment,
    SerializedNode,
    SerializedNodeType,
    SerializedText,
} from './tree_ir';

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
    let serialized = null;
    // see https://dom.spec.whatwg.org/#dom-node-nodetype
    switch (root.nodeType) {
        case 1: // ELEMENT_NODE
            // @ts-expect-error
            serialized = serializeRealElement(root);
            break;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        case 3: // TEXT_NODE
            // @ts-expect-error
            serialized = serializeRealTextNode(root);
            break;
        default:
            serialized = null;
    }

    return serialized;
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

        // TODO: Handle React JSX's props limitation
        //  - https://github.com/facebook/react/blob/9198a5cec0936a21a5ba194a22fcbac03eba5d1d/packages/react-dom/src/shared/possibleStandardNames.js
        //  - https://github.com/facebook/react/blob/9198a5cec0936a21a5ba194a22fcbac03eba5d1d/packages/react-dom/src/shared/DOMProperty.js
        const serialized: SerializedAttribute = {
            name,
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
