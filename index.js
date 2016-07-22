"use strict";
var lodash_1 = require('lodash');
var NgComponent = (function () {
    function NgComponent() {
        this.__isFirstRender = true;
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
    NgComponent.prototype.$onChanges = function (changes) {
        var oldProps = lodash_1.mapValues(changes, 'previousValue');
        var newProps = lodash_1.mapValues(changes, 'currentValue');
        if (!this.__isFirstRender) {
            this.componentWillReceiveProps(newProps);
        }
        if (this.didPropsChange(newProps, oldProps)) {
            // compute whether we should render or not
            var shouldUpdate = this.shouldComponentUpdate(lodash_1.assign({}, this.props, newProps), lodash_1.assign({}, this.props, oldProps));
            // store the new props
            this.props = lodash_1.assign({}, this.props, newProps);
            if (shouldUpdate) {
                if (!this.__isFirstRender) {
                    this.componentWillUpdate(this.props, this.state);
                }
                this.render(this.props, this.state);
                if (!this.__isFirstRender) {
                    this.componentDidUpdate(this.props, this.state);
                }
                this.__isFirstRender = false;
            }
        }
    };
    NgComponent.prototype.$onInit = function () {
        this.componentWillMount();
    };
    NgComponent.prototype.$postLink = function () {
        this.componentDidMount();
    };
    NgComponent.prototype.$onDestroy = function () {
        this.componentWillUnmount();
    };
    NgComponent.prototype.didPropsChange = function (newProps, oldProps) {
        return lodash_1.some(newProps, function (v, k) { return v !== oldProps[k]; });
    };
    /*
      lifecycle hooks
    */
    NgComponent.prototype.componentWillMount = function () { };
    NgComponent.prototype.componentDidMount = function () { };
    NgComponent.prototype.componentWillReceiveProps = function (props) { };
    NgComponent.prototype.shouldComponentUpdate = function (newProps, oldProps) { return true; };
    NgComponent.prototype.componentWillUpdate = function (props, state) { };
    NgComponent.prototype.componentDidUpdate = function (props, state) { };
    NgComponent.prototype.componentWillUnmount = function () { };
    return NgComponent;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NgComponent;
