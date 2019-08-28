* `.gitignore` ✔
* babel ✔
  * `array-includes` ✔
  * loose ✔
  * `modules: false` for tree shaking ✔
* postcss ✔
  * precss 必须 3.1.2 版本 ✔
  * postcss-automath ✔
  * postcss-hexrgba ✔
  * postcss-sprites ✔
  * postcss-functions ✔
  * postcss-convertpx 移动端 ✔
* `.npmrc` ✔
* `.pockrc.yml` ✔
* prettier ✔
  * `.prettierrc.js` ✔
  * eslint 集成 ✔
  * 确认 typescript 支持 ✔
* eslint
  * typescript 支持 ✔
  * rules 过一遍
  * prettier 集成 ✔
  * eslint-plugin-react 配置有待调整, build 的时候有个 warning, https://github.com/yannickcr/eslint-plugin-react#configuration ✔
* `browserslistrc` ✔
* tree shaking ✔
  * babel 配置 preset-env `modules: false` ✔
  * webpack 配置 `resolve.mainFileds: ['module', 'browser', 'main']` ✔
* 跨域日志收集
  * 异步 chunk CORS, webpack 配置 `output.crossOriginLoading: 'anonymous'` ✔
  * webpack 配置 `target: 'web'`, 前者依赖此配置 ✔
  * 同步 chunk CORS, 自己写的 html-tag-attributes-plugin ✔
  * 字体 CORS, 自己写的 preload-font-plugin ✔
  * preload CORS ✔
  * devServer 提供 CORS 头部支持 ✔
* preload/prefetch
  * 字体 preload, 自己写的 preload-font-plugin ✔
  * js, css preload ✔
* 异步 chunk 分包策略 ✔
* bundle size 分析插件 ✔
* 开发时候的 sourcemap 选择, `devtool: 'eval-source-map'` ✔
* webpack-deep-scope-plugin ✔
* sentry
  * git-revision-webpack-plugin ✔
  * @sentry/webpack-plugin ✔
* `publicPath` ✔
* css sourcemap
* url-loader 对一般图片 ✔
* svg-url-loader 对 svg ✔
* url-loader 对音频 ✔
* url-loader 对字体 ✔
* thread-loader
* 注入 loading html, js, css ✔
* 注入 css reset ✔
* 注入移动端适配代码 ✔
* 注入异常收集代码 ✔
* devServer 提供特定头部以及跨域支持, devServer 提供报错信息页面显示 `overlay` ✔
* 环境变量 ✔
* index.html ✔
* 确定第三方库 bundle 缓存 hash 不会因为业务代码变化而变化 ✔
* 优化 loader 查找范围 ✔
* Scope Hoisting(optimization.providedExports, optimization.concatenateModules, optimization.usedExports) ✔
* 抽离 runtime ✔
* 内联 runtime 到 html(意味着 preload 要去掉 runtime) ✔
* package.json ✔
* travis ci  ✔
* 区分一下 ci build 不要生成分析 ✔
* 所有template确认下lint-stage有没有git add
* npm ci ✔
* blog增加oas, 增加upload的script和ci