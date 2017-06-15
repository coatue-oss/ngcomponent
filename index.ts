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
    const oldProps = Object.keys(changes).reduce((acc, key) => {
      try {
        acc[key] = changes[key]['previousValue']
      } catch (_) {}
      return acc
    }, {} as any)
    const newProps = Object.keys(changes).reduce((acc, key) => {
      try {
        acc[key] = changes[key]['currentValue']
      } catch (_) {}
      return acc
    }, {} as any)
    const nextProps = {
        ...(this.props as any as object),
        ...newProps
    }
    // TODO: implement nextState (which also means implement this.setState)

    if (this.__isFirstRender) {
      this.props = nextProps
      this.componentWillMount()
      this.render()
      this.__isFirstRender = false
    } else {
      if (!this.didPropsChange(newProps, oldProps)) return
      this.componentWillReceiveProps(nextProps)
      const shouldUpdate = this.shouldComponentUpdate(nextProps, this.state)
      this.props = nextProps
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
    return Object.keys(newProps as any as object).find(key => oldProps[key] !== newProps[key]) !== undefined
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
