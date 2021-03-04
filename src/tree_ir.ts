import { Nullable } from 'option-t/esm/Nullable/Nullable';

// We would like to sort with https://dom.spec.whatwg.org/#dom-node-nodetype
export enum SerializedNodeType {
    Unknown = 0,
    Element = 1,
    Text = 3,
    DocumentFragment = 11,
}

export interface SerializedNode {
    type: SerializedNodeType;
    children: Array<SerializedNode>;
}

export interface SerializedFragment extends SerializedNode {
    type: SerializedNodeType.DocumentFragment;
    children: Array<SerializedNode>;
}

export interface SerializedElement extends SerializedNode {
    type: SerializedNodeType.Element;
    namespace: Nullable<string>;
    localname: string;
    attributes: Array<SerializedAttribute>;
}

export interface SerializedAttribute {
    name: string;
    // TODO: Handle React JSX's props limitation
    //  - https://github.com/facebook/react/blob/9198a5cec0936a21a5ba194a22fcbac03eba5d1d/packages/react-dom/src/shared/possibleStandardNames.js
    //  - https://github.com/facebook/react/blob/9198a5cec0936a21a5ba194a22fcbac03eba5d1d/packages/react-dom/src/shared/DOMProperty.js
    // reactName?: Nullable<string>;
    value: string;
}

export interface SerializedText extends SerializedNode {
    type: SerializedNodeType.Text;
    text: Nullable<string>;
}
