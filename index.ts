import {assign, mapValues, some} from 'lodash'

abstract class NgComponent<Props, State> {

  private __isFirstRender = true
  private __nextState: State
  private __setStateTriggersLifecycle = true

  props: Props = {} as Props
  protected state: State = {} as State

  /*
    eg. {
      as: {currentValue: [1, 2, 3], previousValue: [1, 2]},
      bs: {currentValue: 42, previousValue: undefined}
    }
  */
  // nb: this method is explicity exposed for unit testing
  $onChanges(changes: object) {
    const oldProps = mapValues<{}, Props>(changes, 'previousValue')
    const newProps = mapValues<{}, Props>(changes, 'currentValue')
    if (!this.__isFirstRender && !this.didPropsChange(newProps, oldProps)) return
    this.lifecycle(newProps, {} as State)
  }

  // note: this isn't meant to exactly replicate React's setState (e.g. http://stackoverflow.com/q/28922275/7816712)
  protected setState(newState: Partial<State>) {
    if (this.__setStateTriggersLifecycle) {
      setTimeout(() => this.lifecycle({} as Props, newState), 0)
    } else {
      this.__nextState = assign({}, this.state, newState)
    }
  }

  private lifecycle(newProps: Partial<Props>, newState: Partial<State>) {
    const nextProps = assign({}, this.props, newProps)
    this.__nextState = assign({}, this.state, newState)

    if (this.__isFirstRender) {
      assign(this, { props: nextProps, state: this.__nextState })
      this.avoidSetStateLifecycle(() => this.componentWillMount())
      this.render()
      this.__isFirstRender = false
    } else {
      this.avoidSetStateLifecycle(() => this.componentWillReceiveProps(nextProps))
      const shouldUpdate = this.shouldComponentUpdate(nextProps, this.__nextState)
      assign(this, { props: nextProps, state: this.__nextState })
      if (!shouldUpdate) return

      this.componentWillUpdate(this.props, this.state)
      this.render()
      this.componentDidUpdate(this.props, this.state)
    }
  }

  $postLink() {
    this.componentDidMount()
  }

  $onDestroy() {
    this.componentWillUnmount()
  }

  private didPropsChange(newProps: Props, oldProps: Props): boolean {
    return some(newProps, (v, k) => v !== oldProps[k])
  }

  private avoidSetStateLifecycle(fn: () => void) {
    this.__setStateTriggersLifecycle = false
    fn()
    this.__setStateTriggersLifecycle = true
  }

  /*
    lifecycle hooks
  */
  componentWillMount(): void {}
  componentDidMount(): void {}
  componentWillReceiveProps(props: Props): void {}
  shouldComponentUpdate(nextProps: Props, nextState: State): boolean { return true }
  componentWillUpdate(props: Props, state: State): void {}
  componentDidUpdate(props: Props, state: State): void {}
  componentWillUnmount() {}
  render(): void {}
}

export default NgComponent
