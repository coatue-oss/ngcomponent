# NgComponent [![Build Status][build]](https://circleci.com/gh/coatue/ngcomponent) [![npm]](https://www.npmjs.com/package/ngcomponent) [![mit]](https://opensource.org/licenses/MIT)

[build]: https://img.shields.io/circleci/project/coatue/ngcomponent.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/ngcomponent.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/ngcomponent.svg?style=flat-square

> A clean React-like abstraction for rendering non-Angular components within an Angular app.

## Installation

```sh
npm install --save ngcomponent
```

## Usage

*Note: This example is in TypeScript, but it works just as well in vanilla JavaScript*

```ts
import {IComponentOptions} from 'angular'
import NgComponent from 'ngcomponent

interface Props {
  foo: number
  bar: string[]
}

interface State {}

const myComponent: IComponentOptions = {
  bindings: {
    foo: '<',
    bar: '<
  },
  template: `
    <div></div>
  `,
  controller: class extends NgComponent<Props, State> {
    ...
  }
}
```

## Full Example

```ts

interface Props {
  data: number[]
  type: "bar"|"line"
}

interface State {
  chart: Chart
}

const chartJSWrapper: IComponentOptions = {
  bindings: {
    data: '<',
    type: '<
  },
  template: `<canvas></canvas>`,
  constructor(private $element: JQuery){}
  controller: class extends NgComponent<Props, State> {

    componentDidMount() {
      this.state.chart = new Chart($element.find('canvas'), {
        data: props.data,
        type: props.type
      })
    }

    render(props: Props, state: State) {
      state.chart.data = props.data
      state.chart.type = props.type
      state.chart.update()
    }

    componentWillUnmount() {
      this.state.chart.destroy()
    }
  }
}
```

## Lifecycle Hooks

NgComponent has a React-like component lifecycle API:

- `componentWillMount()`
- `componentDidMount()`
- `componentWillReceiveProps(props)`
- `shouldComponentUpdate(props, state)`
- `componentWillUpdate(props, state)`
- `componentDidUpdate(props, state)`
- `componentWillUnmount()`

## Running the Tests

```sh
npm test
```

## Hacking On It

```sh
# Just watch TypeScript:
npm run watch

# Or, watch TypeScript and run tests on change:
npm run tdd
```

## License

MIT