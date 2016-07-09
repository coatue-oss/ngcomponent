"use strict";
const lodash_1 = require('lodash');
class Component {
    constructor() {
        this.state = undefined;
        this.props = undefined;
    }
    /*
      eg. {
        as: {currentValue: [1, 2, 3], previousValue: [1, 2]},
        bs: {currentValue: 42, previousValue: undefined}
      }
    */
    // nb: this method is explicity exposed for unit testing
    $onChanges(changes) {
        const oldProps = lodash_1.mapValues(changes, 'previousValue');
        const newProps = lodash_1.mapValues(changes, 'currentValue');
        if (this.didPropsChange(newProps, oldProps)) {
            // compute whether we should render or not
            const shouldUpdate = this.shouldComponentUpdate(lodash_1.assign({}, this.props, newProps), lodash_1.assign({}, this.props, oldProps));
            // store the new props
            this.props = lodash_1.assign({}, this.props, newProps);
            if (shouldUpdate) {
                this.render(this.props, this.state);
            }
        }
    }
    didPropsChange(newProps, oldProps) {
        return lodash_1.some(newProps, (v, k) => v !== oldProps[k]);
    }
    shouldComponentUpdate(newProps, oldProps) {
        return true;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
