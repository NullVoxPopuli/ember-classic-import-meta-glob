# ember-classic-import-meta-glob

Implements [RFC#939: import.meta.glob](https://github.com/emberjs/rfcs/pull/939) for ember-classic (pre-embroider).

Example:
```js
// If you type this in your app:
const widgets = import.meta.glob('./widgets/*.js')

// It gets automatically converted into something like this:
const widgets = {
  './widgets/first.js': () => import('./widgets/first.js'),
  './widgets/second.js': () => import('./widgets/second.js'),
}
```

Example with `eager: true`
```js
// If you type this in your app:
const widgets = import.meta.glob('./widgets/*.js', { eager: true } )

// It gets automatically converted into something like this:
import * as a from './widgets/first.js';
import * as b from './widgets/first.js';
const widgets = {
  './widgets/first.js': a,
  './widgets/second.js': b,
}
```

## Compatibility

- Apps using ember-source v3.28
- ember-auto-import v2
- _not_ embroider. For embroider, use [`babel-plugin-transform-vite-meta-glob`](https://www.npmjs.com/package/babel-plugin-transform-vite-meta-glob)

## Installation

```
pnpm add ember-classic-import-meta-glob
```

## Usage

In your JS files:



## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
