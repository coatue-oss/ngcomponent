import {assign, mapValues, some} from 'lodash'

abstract class Component<Props, State> {

  protected state: State = undefined
  protected props: Props = undefined

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
    if (this.didPropsChange(newProps, oldProps)) {

      // compute whether we should render or not
      const shouldUpdate = this.shouldComponentUpdate(
        assign({}, this.props, newProps),
        assign({}, this.props, oldProps)
      )

      // store the new props
      this.props = assign({}, this.props, newProps)

      if (shouldUpdate) {
        this.render(this.props, this.state)
      }
    }
  }

  protected didPropsChange(newProps: Props, oldProps: Props): boolean {
    return some(newProps, (v, k) => v !== oldProps[k])
  }

  protected shouldComponentUpdate(newProps: Props, oldProps: Props): boolean {
    return true
  }

  protected abstract render(props: Props, state: State): void
}

export default Component