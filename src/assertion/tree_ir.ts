import { SerializedElement, SerializedNode, SerializedNodeType, SerializedText } from '../tree_ir';

function assertIs<T extends SerializedNode>(
    v: SerializedNode,
    type: SerializedNodeType,
    typeName: string
): asserts v is T {
    const actualType = v.type;
    const ok = actualType === type;
    if (!ok) {
        throw new TypeError(`passed value is not ${typeName}, actual: ${actualType}`);
    }
}

export function assertIsSerializedElement(v: SerializedNode): asserts v is SerializedElement {
    assertIs(v, SerializedNodeType.Element, 'SerializedElement');
}

export function assertIsSerializedText(v: SerializedNode): asserts v is SerializedText {
    assertIs(v, SerializedNodeType.Text, 'SerializedText');
}
