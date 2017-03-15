import {assign, mapValues, some} from 'lodash'

abstract class NgComponent<Props, State> {

  private __isFirstRender = true

  protected state: State = {} as State
  public props: Props = {} as Props

  abstract render(props: Props, state: State): void

  /*
    eg. {
      as: {currentValue: [1, 2, 3], previousValue: [1, 2]},
      bs: {currentValue: 42, previousValue: undefined}
    }
  */
  // nb: this method is explicity exposed for unit testing
  public $onChanges(changes: {}) {
    const oldProps = mapValues<{}, Props>(changes, 'previousValue')
    const newProps = mapValues<{}, Props>(changes, 'currentValue')

    if (!this.__isFirstRender) {
      this.componentWillReceiveProps(newProps)
    }

    // store the new props
    this.props = assign({}, this.props, newProps)

    if (this.__isFirstRender) {
      this.render(this.props, this.state)
      this.__isFirstRender = false

    } else if (this.didPropsChange(newProps, oldProps)) {
      const shouldUpdate = this.shouldComponentUpdate(
        assign({}, this.props, newProps),
        assign({}, this.props, oldProps)
      )

      if (shouldUpdate) {
        this.componentWillUpdate(this.props, this.state)
        this.render(this.props, this.state)
        this.componentDidUpdate(this.props, this.state)
      }
    }
  }

  $onInit() {
    this.componentWillMount()
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
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(props: Props) { }
  shouldComponentUpdate(newProps: Props, oldProps: Props): boolean { return true }
  componentWillUpdate(props: Props, state: State) {}
  componentDidUpdate(props: Props, state: State) {}
  componentWillUnmount() {}
}

export default NgComponent
