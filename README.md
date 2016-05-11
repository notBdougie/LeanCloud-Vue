LeanCloud Vue Boilerplate
===
This boilerplate contains some awesome new front-end technologies, like hot reloading and ES6.

This project is designed to be opinionated but robust enough to set up a website with common features like client-side rendering/routing, RESTful API, authentication, as well as data storage by using [LeanCloud] backend service.

For more, check out the full feature list below:

## Features

**Server:**

1. [Node 6.x][node-green] and Express 4.x
1. [Webpack] (with hot reloading)
1. [LeanCloud] integration
1. [Babel] (transform ES6 for browser)
1. [Ava] (asynchronous test runner)
1. [Bunyan] for logging (`logger` set as a global variable)
1. Database seeding example (see `scripts/seed` folder)

**Client:**

1. [Vue.js] 1.x (with plugins [vue-resource] and [vue-router])
1. [Semantic UI][semantic-ui] (for user interface)
1. [SASS] support (with autoprefixer)

**Editor:**

1. [Visual Studio Code] configurations
1. [Typings] definitions for intellisense
1. [ESLint]

## Application Structure
```
.
├── builder           # Build/Start scripts
├── client            # Application source code
│   ├── assets        # Static assets
│   ├── components    # Vue.js components
│   ├── extensions    # Vue.js directives or service providers
│   ├── semantic      # Semantic-UI related code
│   └── main.js       # Application bootstrap
├── config            # Project configuration settings
├── scripts           # Common scripts
│   └── seed          # Seeding scripts
├── server            # Server source code
│   ├── api           # Server API
│   ├── auth          # Authentication middleware
│   ├── common        # LeanEngine cloud functions
│   ├── lib           # Server configuration
│   ├── models        # Data models
│   ├── views         # Server rendered views
│   └── index.js      # Server application entry point
├── test              # Unit tests
└── typings           # Typings definitions
```


## Installation

Make sure Node.js 6.x is installed and enabled in current shell. 

```bash
git clone https://github.com/chuyik/LeanCloud-Vue-Boilerplate.git
cd LeanCloud-Vue-Boilerplate
npm install
```

## Using Vue DevTools

Install [Vue DevTools chrome extension][devtools] and it just works.


## Running Dev Server

```bash
npm run dev
```

## Pre-production Testing

```bash
npm run stage
```

## Deployment

```bash
# Do not run this unless you know what `deploy.sh` does.
# Details are being revealed soon.
# Source: https://github.com/X1011/git-directory-deploy
npm run deploy
```

## Run Seeding Scripts

```bash
npm run seed
```

[LeanCloud]: https://leancloud.cn/
[devtools]: https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd
[ava]: https://github.com/sindresorhus/ava
[vue-resource]: https://github.com/vuejs/vue-resource
[vue-router]: https://github.com/vuejs/vue-router/
[node-green]: http://node.green/
[webpack]: https://webpack.github.io/
[babel]: https://babeljs.io/
[vue.js]: https://vuejs.org/
[semantic-ui]: http://semantic-ui.com/
[sass]: http://sass-lang.com/
[visual studio code]: https://code.visualstudio.com/
[typings]: https://github.com/typings/typings
[eslint]: http://eslint.org/
[bunyan]: https://github.com/trentm/node-bunyan

## License
[BSD license](http://opensource.org/licenses/bsd-license.php)
