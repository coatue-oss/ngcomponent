import {assign, mapValues, some} from 'lodash'

abstract class NgComponent<Props, State> {

  private __isFirstRender = true

  protected state: State = {} as State
  public props: Props = {} as Props

  /*
    eg. {
      as: {currentValue: [1, 2, 3], previousValue: [1, 2]},
      bs: {currentValue: 42, previousValue: undefined}
    }
  */
  // nb: this method is explicity exposed for unit testing
  public $onChanges(changes: object) {
    const oldProps = mapValues<{}, Props>(changes, 'previousValue')
    const newProps = mapValues<{}, Props>(changes, 'currentValue')

    const props = assign({}, this.props, newProps)
    const state = assign({}, this.state) // TODO: implement setState and test it with shouldComponentUpdate

    if (this.__isFirstRender) {
      Object.assign(this, { props, state })
      this.componentWillMount()
      this.render()
      this.__isFirstRender = false
    } else {
      this.componentWillReceiveProps(newProps)
      if (!this.didPropsChange(newProps, oldProps)) return
      const shouldUpdate = this.shouldComponentUpdate(props, state)
      Object.assign(this, { props, state })
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

  protected didPropsChange(newProps: Props, oldProps: Props): boolean {
    return some(newProps, (v, k) => v !== oldProps[k])
  }

  /*
    lifecycle hooks
  */
  componentWillMount(): void {}
  componentDidMount(): void {}
  componentWillReceiveProps(props: Props): void { }
  shouldComponentUpdate(nextProps: Props, nextState: State): boolean { return true }
  componentWillUpdate(props: Props, state: State): void {}
  componentDidUpdate(props: Props, state: State): void {}
  componentWillUnmount() {}
  render(): void {}
}

export default NgComponent
