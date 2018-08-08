/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import * as ReactIs from "./react-is"
import * as React from 'react';

const REACT_STATICS:{
    [key:string]:boolean
} = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

const KNOWN_STATICS:{
    [key:string]:boolean
} = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
};

// const TYPE_STATICS = {
//     [ReactIs.ForwardRef]: {
//         ['$$typeof']: true,
//         render: true
//     }
// };

const defineProperty = Object.defineProperty;
const getOwnPropertyNames = Object.getOwnPropertyNames;
// const getOwnPropertySymbols = Object.getOwnPropertySymbols;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const getPrototypeOf = Object.getPrototypeOf;
const objectPrototype = Object.prototype;

export default function hoistNonReactStatics(targetComponent:any, sourceComponent:any, blacklist:{[key:string]:boolean} = {}) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

        if (objectPrototype) {
            const inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        const keys:string[] = getOwnPropertyNames(sourceComponent);

        // if (getOwnPropertySymbols) {
        //     keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        // }

        const targetStatics = (ReactIs.typeOf(React.createElement(targetComponent))) ?
        { ['$$typeof']: true,render: true } : REACT_STATICS;
        const sourceStatics = (ReactIs.typeOf(React.createElement(targetComponent))) ?
        { ['$$typeof']: true,render: true } : REACT_STATICS;

        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            if (!KNOWN_STATICS[key] &&
                !(blacklist && blacklist[key]) &&
                !(sourceStatics && sourceStatics[key]) &&
                !(targetStatics && targetStatics[key])
            ) {
                const descriptor = getOwnPropertyDescriptor(sourceComponent, key) as PropertyDescriptor
                try { // Avoid failures from read-only properties
                    defineProperty(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }

        return targetComponent;
    }

    return targetComponent;
};