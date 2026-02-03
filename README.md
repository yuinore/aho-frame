# Aho Frame

A web app that converts beats to frame numbers. Useful for rhythm games, music timing, and video editing.

**Catchphrase:** _"I use a calculator for frame numbers... because I'm such a fool!"_

## Features

- **Beat–frame conversion table** — Enter beat interval, beat offset, FPS, BPM, and frame offset to get a table mapping beats to frame numbers (integer and decimal).
- **Settings persistence** — Your inputs and language choice are saved in cookies.
- **i18n** — English and 日本語 (Japanese).
- **Link to Bayes BPM Counter** — Quick access to an external BPM counter tool.

## Tech Stack

- [React](https://react.dev/) 19
- [Vite](https://vitejs.dev/) 7
- [TypeScript](https://www.typescriptlang.org/)
- [Bootstrap](https://getbootstrap.com/) 5 & [react-bootstrap](https://react-bootstrap.github.io/)
- [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Yarn](https://yarnpkg.com/) (or npm/pnpm)

### Install

```bash
yarn install
```

### Development

```bash
yarn dev
```

Then open the URL shown in the terminal (e.g. `http://localhost:5173`).

### Build

```bash
yarn build
```

Output is in the `dist/` directory.

### Preview production build

```bash
yarn preview
```

### Lint & format

```bash
yarn lint
yarn prettier
```

## License

See [LICENSE](LICENSE).
