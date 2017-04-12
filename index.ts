import {assign, mapValues, some} from 'lodash'

abstract class NgComponent<Props, State> {

  private __isFirstRender = true
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
  protected setState(newState: State) {
    if (this.__setStateTriggersLifecycle) {
      setTimeout(() => this.lifecycle({} as Props, newState), 0)
    } else {
      this.state = assign({}, this.state, newState)
    }
  }

  private lifecycle(newProps: Props, newState: State) {
    const nextProps = assign({}, this.props, newProps)
    const nextState = assign({}, this.state, newState)

    if (this.__isFirstRender) {
      assign(this, { props: nextProps, state: nextState })
      this.avoidSetStateLifecycle(() => this.componentWillMount())
      this.render()
      this.__isFirstRender = false
    } else {
      this.avoidSetStateLifecycle(() => this.componentWillReceiveProps(nextProps))
      const shouldUpdate = this.shouldComponentUpdate(nextProps, nextState)
      assign(this, { props: nextProps, state: nextState })
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
