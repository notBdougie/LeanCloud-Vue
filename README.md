LeanCloud Vue Boilerplate
===
This boilerplate contains some awesome new front-end technologies, like hot reloading and ES6.

This project is designed to be opinionated but robust enough to set up a website with common features like client-side rendering/routing, RESTful API, authentication, as well as data storage by using [LeanCloud] backend service.

For more, check out the full feature list below:

## Features

**Server:**

1. [Node][node-green] 6.x | [Express] 4.x
1. [LeanCloud] integration (compatible with LeanEngine 1.x)
1. [Webpack] \(with hot reloading)
1. [express-validation] | [Joi] \(powerful request validation)
1. [Ava] \(asynchronous test runner)
1. [Bunyan] for logging (with global variable `Logger`)
1. Database seeding example (see folder `scripts/seed`)

**Client:**

1. [Vue.js] 1.x (with plugins [vue-resource] and [vue-router])
1. [Semantic UI][semantic-ui] (for user interface)
1. [Babel] \(transform ES6 for browsers)
1. [SASS] support (with autoprefixer)

**Editor:**

1. [Visual Studio Code] configurations
1. [Typings] definitions for intellisense
1. [ESLint]

## Application Structure
```
.
├── builder           # Build/Start scripts
|
├── client            # Application source code
│   ├── assets        # Static assets
│   ├── components    # Vue.js components
│   ├── extensions    # Vue.js directives or service providers
│   ├── semantic      # Semantic-UI related code
│   ├── UI            # UI components
│   └── main.js       # Application bootstrap
|
├── config            # Project configuration settings
|
├── scripts           # Common scripts
│   └── seed          # Seeding scripts
|
├── server            # Server source code
│   ├── api           # Server API
│   ├── auth          # Authentication middleware
│   ├── common        # LeanEngine cloud functions
│   ├── lib           # Server configuration
│   ├── models        # Data models
│   ├── views         # Server rendered views
│   └── index.js      # Server application entry point
|
├── test              # Unit tests
|
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


## Commands

```bash
# Run Dev (Autoreload)
npm run dev

# Stage Mode (Pre-production Testing)
npm run stage

# Start a Production Server
npm start

# Build Client Code with Webpack
npm run build

# Run Seeding Scripts
npm run seed

# Run Test
npm test
```

## Changelog
See [CHANGELOG.md](CHANGELOG.md)

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
[express-validation]: https://github.com/AndrewKeig/express-validation
[Joi]: https://github.com/hapijs/joi
[Express]: http://expressjs.com/

## License
[BSD license](http://opensource.org/licenses/bsd-license.php)
