import {mock} from 'angular'
import {$compile, $rootScope} from 'ngimport'
import NgComponent from './'

describe('Component', function() {

  interface Props {
    a: number
    b: string
  }

  describe('#$onChanges', function() {
    it('should call #render if any prop has changed', function() {
      class A extends NgComponent<Props, {}> {
        render() {}
      }
      const a = new A
      const spy = spyOn(a, 'render')

      // call #1
      a.$onChanges({
        a: {currentValue: 42, previousValue: undefined, isFirstChange: () => true},
        b: {currentValue: undefined, previousValue: undefined, isFirstChange: () => true}
      })
      expect(spy.calls.mostRecent().args[0])
        .toEqual({ a: 42, b: undefined })

      // call #2
      a.$onChanges({
        a: {currentValue: 60, previousValue: 42, isFirstChange: () => false},
        b: {currentValue: 'foo', previousValue: undefined, isFirstChange: () => false}
      })
      expect(spy.calls.mostRecent().args[0])
        .toEqual({ a: 60, b: 'foo' })

      // call #3
      a.$onChanges({
        b: {currentValue: 'bar', previousValue: 'foo', isFirstChange: () => false}
      })
      expect(spy.calls.mostRecent().args[0])
        .toEqual({ a: 60, b: 'bar' })

      // call #4
      a.$onChanges({
        a: {currentValue: -10, previousValue: 60, isFirstChange: () => false}
      })
      expect(spy.calls.mostRecent().args[0])
        .toEqual({ a: -10, b: 'bar' })
    })
    it('should not call #render if no props have changed', function() {
      class A extends NgComponent<Props, {}> {
        render() {}
      }
      const a = new A
      const spy = spyOn(a, 'render')

      // call #1
      a.$onChanges({
        a: { currentValue: 42, previousValue: undefined, isFirstChange: () => true },
        b: { currentValue: undefined, previousValue: undefined, isFirstChange: () => true }
      })
      expect(spy.calls.count()).toBe(1)

      // call #2
      a.$onChanges({
        a: { currentValue: 42, previousValue: 42, isFirstChange: () => false },
        b: { currentValue: undefined, previousValue: undefined, isFirstChange: () => false }
      })
      expect(spy.calls.count()).toBe(1)

    })
  })

  describe('#shouldComponentUpdate', function() {
    it('should not get called on the initial render', function() {
      class A extends NgComponent<Props, {}> {
        render() {}
      }
      const spy = spyOn(A.prototype, 'shouldComponentUpdate')
      const a = new A
      expect(spy).not.toHaveBeenCalled()
    })
    it('should get called on subsequent renders', function() {
      class A extends NgComponent<Props, {}> {
        render() {}
      }
      const spy = spyOn(A.prototype, 'shouldComponentUpdate')
      const a = new A
      a.$onChanges({
        a: { currentValue: 42, previousValue: 10, isFirstChange: () => true },
        b: { currentValue: 'foo', previousValue: undefined, isFirstChange: () => true }
      })
      expect(spy).toHaveBeenCalledWith({a: 42, b: 'foo'}, {a: 10, b: undefined})
    })
    it('should accept a custom comparator', function() {
      class A extends NgComponent<Props, {}> {
        render() {}
        shouldComponentUpdate(newProps: Props, oldProps: Props): boolean {
          return newProps.a > oldProps.a
        }
      }
      const a = new A
      const spy = spyOn(a, 'render')

      // call #1
      a.$onChanges({
        a: { currentValue: 42, previousValue: 10, isFirstChange: () => true },
        b: { currentValue: 'foo', previousValue: undefined, isFirstChange: () => true }
      })
      expect(spy.calls.count()).toBe(1)
      expect(spy.calls.mostRecent().args[0])
        .toEqual({ a: 42, b: 'foo' })

      // call #2
      a.$onChanges({
        a: { currentValue: 30, previousValue: 42, isFirstChange: () => true },
        b: { currentValue: 'bar', previousValue: 'foo', isFirstChange: () => true }
      })
      expect(spy.calls.count()).toBe(1)

      // call #3
      a.$onChanges({
        a: { currentValue: 31, previousValue: 30, isFirstChange: () => true },
        b: { currentValue: 'bar', previousValue: 'foo', isFirstChange: () => true }
      })
      expect(spy.calls.count()).toBe(2)
      expect(spy.calls.mostRecent().args[0])
        .toEqual({ a: 31, b: 'bar' })
    })
  })
  describe('#componentWillMount', function() {
    it('should get called when the component mounts', function() {

      class A extends NgComponent<Props, {}> {
        render() {}
        shouldComponentUpdate(newProps: Props, oldProps: Props): boolean {
          return newProps.a > oldProps.a
        }
      }
      const spy = spyOn(A.prototype, 'componentWillMount')

      const component: angular.IComponentOptions = {
        bindings: {
          a: '<',
          b: '<'
        },
        controller: A
      }

      angular.module('test', []).component('component', component)
      angular.bootstrap(angular.element(), ['test'])


      const a = new A
      expect(spy).toHaveBeenCalledWith()
    })
  })
})