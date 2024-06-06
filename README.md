# ember-classic-import-meta-glob

Implements [RFC#939: import.meta.glob](https://github.com/emberjs/rfcs/pull/939) for ember-classic (pre-embroider).

## Compatibility

See working demos here: https://github.com/NullVoxPopuli/ember-import-meta-glob-demos

- Apps using ember-source v3.28
- ember-auto-import v2
  - unless the paths being imported are under the [`allowAppImports` config](https://github.com/embroider-build/ember-auto-import?tab=readme-ov-file#app-imports)
- _not_ embroider. For embroider, use [`babel-plugin-transform-vite-meta-glob`](https://www.npmjs.com/package/babel-plugin-transform-vite-meta-glob)

## Installation

```
pnpm add ember-classic-import-meta-glob
```

## Usage


Default usage:
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

## Differences from RFC#939

- Extensions in the import paths are optional -- this because they do not exist at runtime, and the implementation for this version of import.meta.glob cannot determine what the original file names were.
- the keys in the return object from `glob` will not contain file name extensions, because they do not exist at runtime.

For ember-classic, this is meant to _ease_ migration to the new, modern features, reducing the overall diff you'd need if you didn't have entire feature sets that are available to embroider.  

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
