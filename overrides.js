'use strict';
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const PreloadFontPlugin = require('preload-font-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const { compressCSS, compressHTML, compressJS } = require('./compress');

const gitRevisionPlugin = new GitRevisionPlugin();

const customEnv = {
	RELEASE_VERSION: gitRevisionPlugin.commithash(),
	SENTRY_DSN: process.env.SENTRY_DSN,
	DEBUG: process.env.NODE_ENV !== 'production',
	TITLE: process.env.TITLE,
	DOMAIN: process.env.DOMAIN || '/',
	THEME_COLOR: process.env.THEME_COLOR,
	AUTHOR: process.env.AUTHOR,
	DESC: process.env.DESC,
	KEYWORDS: process.env.KEYWORDS,
	APP_NAME: process.env.APP_NAME,
	API_HOST: process.env.API_HOST,
	API_VERSION: process.env.API_VERSION,
	ALLOYLEVER_CDN: process.env.ALLOYLEVER_CDN
};

// TODO 到时候把babel配置暴露出来
module.exports = {
	mobile: true,
	enableBundleAnalyzer: process.env.CI !== 'true',
	crossorigin: 'anonymous',
	env: customEnv,
	htmlData: {
		...customEnv,
		PUBLIC_URL: process.env.PUBLIC_URL,
		css: compressCSS('./src/styles/reset.css') + compressCSS('./src/styles/loading.css'),
		html: compressHTML('./src/loading.tpl'),
		errorScript: compressJS('./src/lib/error-collect.js')
			.replace(/\w+\.RELEASE/, JSON.stringify(gitRevisionPlugin.commithash()))
			.replace(/\w+\.BACKUP_MONITORURL/, JSON.stringify(process.env.BACKUP_MONITORURL))
			.replace(/\w+\.CHANNEL/, JSON.stringify(process.env.CHANNEL)),
		loadingScript: compressJS('./src/lib/loading.js'),
		dprScript: compressJS('./src/lib/data-dpr.js'),
		alloylever: compressJS('./node_modules/alloylever/alloy-lever.js')
	},
	webpack(config) {
		config.plugins.push(gitRevisionPlugin);
		config.plugins.unshift(
			new PreloadFontPlugin({
				'./src/assets/fonts/CoveredByYourGrace.ttf': {
					rel: 'preload',
					as: 'font',
					type: 'font/ttf',
					crossorigin: 'anonymous'
				}
			})
		);
		if (process.env.SENTRY_AUTH_TOKEN) {
			config.plugins.push(
				new SentryCliPlugin({
					include: './build'
				})
			);
		}
		// if (process.env.NODE_ENV === 'production') {
		// }
		return config;
	},
	devServer(config) {
		// config.overlay = {
		//   warnings: true,
		// 	errors: true,
		// };
		config.headers = {
			'Access-Control-Allow-Origin': '*',
			Vary: 'Origin',
			'Cache-Control': 'max-age=3600'
		};
		return config;
	},
	postcss(plugins) {
		return plugins;
	}
};
