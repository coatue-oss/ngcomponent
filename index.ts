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
    const oldProps: object = clone(changes)
    const newProps: object = clone(changes)
    const changeKeys = Object.getOwnPropertyNames(changes)
    let didPropsChange = false
    for (let i = 0; i < changeKeys.length; ++i) {
      const key = changeKeys[i]
      try {
        oldProps[key] = oldProps[key]['previousValue']
      } catch (e) {}
      try {
        newProps[key] = newProps[key]['currentValue']
      } catch (e) {}
      didPropsChange = didPropsChange || (newProps[key] !== oldProps[key])
    }
    const nextProps = {
        ...(this.props as any as object),
        ...newProps
    } as any as Props
    // TODO: implement nextState (which also means implement this.setState)

    if (this.__isFirstRender) {
      this.props = nextProps
      this.componentWillMount()
      this.render()
      this.__isFirstRender = false
    } else {
      if (!didPropsChange) return
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

function clone(t) {
  return JSON.parse(JSON.stringify(t)) as object
}

export default NgComponent
