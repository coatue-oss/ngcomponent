# NgComponent [![Build Status][build]](https://circleci.com/gh/bcherny/ngcomponent) [![npm]](https://www.npmjs.com/package/ngcomponent) [![mit]](https://opensource.org/licenses/MIT)

[build]: https://img.shields.io/circleci/project/bcherny/ngcomponent.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/ngcomponent.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/ngcomponent.svg?style=flat-square

> Angular components with React-style APIs

## Installation

```sh
npm install --save ngcomponent
```

## Usage

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

## Full Usage Example

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