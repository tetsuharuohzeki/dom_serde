import test from 'ava';

import {
    SerializedNodeType,
    SerializedNode,
    SerializedFragment,
    SerializedElement,
    SerializedText,
} from '../../tree_ir.js';

import {
    assertIsSerializedElement,
    assertIsSerializedText,
} from '../tree_ir.js';

const unknown: SerializedNode = {
    type: SerializedNodeType.Unknown,
    children: [],
};

const fragment: SerializedFragment = {
    type: SerializedNodeType.DocumentFragment,
    children: [],
};

const element: SerializedElement = {
    type: SerializedNodeType.Element,
    namespace: null,
    localname: 'h1',
    children: [],
    attributes: [],
};

const text: SerializedText = {
    type: SerializedNodeType.Text,
    children: [],
    text: 'blahblahblah',
};

{
    const testcase: Array<[node: SerializedNode, shouldThrow: boolean]> = [
        [unknown, true],
        [fragment, true],
        [element, true],
        [text, false],
    ];

    for (const [value, shouldThrow] of testcase) {
        const type = SerializedNodeType[value.type];
        test(`assertIsSerializedText with SerializedNodeType: ${type}`, (t) => {
            t.plan(1);

            if (shouldThrow) {
                t.throws(() => {
                    assertIsSerializedText(value);
                });
            } else {
                t.notThrows(() => {
                    assertIsSerializedText(value);
                });
            }
        });
    }
}


{
    const testcase: Array<[node: SerializedNode, shouldThrow: boolean]> = [
        [unknown, true],
        [fragment, true],
        [element, false],
        [text, true],
    ];

    for (const [value, shouldThrow] of testcase) {
        const type = SerializedNodeType[value.type];
        test(`assertIsSerializedElement with SerializedNodeType: ${type}`, (t) => {
            t.plan(1);

            if (shouldThrow) {
                t.throws(() => {
                    assertIsSerializedElement(value);
                });
            } else {
                t.notThrows(() => {
                    assertIsSerializedElement(value);
                });
            }
        });
    }
}
