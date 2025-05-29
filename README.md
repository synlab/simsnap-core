# SimSnap Core

SimSnap Core is the core library for the SimSnap project. This repository contains the main logic, utilities, and APIs required to build interactive, cross-device platforms designed for collaborative environments.

## Features

- Virtual room implementation for simulating cross-device platforms
- Collaborative Virtual Infinite Canvas
- Collaborative Virtual 3D Scene environment
- Built-in event listener system
- Abstraction layer for managing WebSocket communication

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/simsnap-core.git
    ```

2. **Install dependencies:**
    ```bash
    cd simsnap-core
    npm install
    ```

## Usage

Import SimSnap Core into your project and start building your own cross-device platforms for collaborative environments :

Developing locally ? Install it using a relative path:

```bash
npm install ../simsnap-core
```

Or, if the package is published to npm, install it with:

```bash
npm install simsnap-core
```

```js
import { SimSnap } from 'simsnap-core';

const sim = new SimSnap();
sim.run();
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.