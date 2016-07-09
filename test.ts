import {mock} from 'angular'
import NgComponent from './'

describe('Component', function() {

  interface Props {
    a: number
    b: string
  }

  beforeEach(function() {
    mock.module('coatue')
  })
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
    it('should accept a custom comparator', function() {
      class A extends NgComponent<Props, {}> {
        render() {}
        protected shouldComponentUpdate(newProps: Props, oldProps: Props): boolean {
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
})