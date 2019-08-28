type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
	timeout: number;
};
type RequestIdleCallbackDeadline = {
	readonly didTimeout: boolean;
	timeRemaining: () => number;
};

declare global {
	interface Window {
		Sentry: {
			captureException: (err: any) => string;
		};
		errorPool: Array<any>;
		isSentryLoaded: boolean;
		requestIdleCallback: (
			callback: (deadline: RequestIdleCallbackDeadline) => void,
			opts?: RequestIdleCallbackOptions
		) => RequestIdleCallbackHandle;
		cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
		mozRequestAnimationFrame: typeof requestAnimationFrame;
		msRequestAnimationFrame: typeof requestAnimationFrame;
		mozCancelAnimationFrame: typeof cancelAnimationFrame;
	}
}

export function report(error: Error): void {
	if (window.Sentry) {
		window.Sentry.captureException(error);
	} else {
		window.errorPool.push({
			error
		});
	}
}

export function decodeBase64(str: string): string {
	return decodeURIComponent(
		atob(str)
			.split('')
			.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
			.join('')
	);
}

interface JWT {
	header: string;
	payload: string;
	signature: string;
}

export function parseJWT(jwt: string): JWT {
	const parts = jwt.split('.');
	return {
		header: decodeBase64(parts[0]),
		payload: decodeBase64(parts[1]),
		signature: parts[2]
	};
}

export function once<T extends Function>(fn: T): T {
	let called = false;
	if (typeof fn !== 'function') {
		throw new TypeError('fn is not a function');
	}
	return (function(this: any, ...args: Array<any>) {
		if (called) return;
		called = true;
		return fn.apply(this, args);
	} as unknown) as T;
}

export function scrollY(val?: number): number | void {
	const doc = document;
	const root = doc.documentElement || doc.body.parentNode || doc.body;
	if (val !== undefined) {
		doc.body.scrollTop = val;
		doc.documentElement && (doc.documentElement.scrollTop = val);
		doc.body.parentNode && ((doc.body.parentNode as any).scrollTop = val);
	} else {
		return window.pageYOffset !== undefined ? window.pageYOffset : root.scrollTop;
	}
}

export function throttle<T = {}, F extends Function = Function>(
	fn: F,
	intv = 100,
	ctx: T,
	immediate = true
): F {
	// eslint-disable-next-line
	if (!isFn(fn)) {
		throw new TypeError('fn is not a function');
	}
	let handler: ReturnType<typeof setTimeout> | null = null;
	const f = fn.apply.bind(fn);

	/* eslint-disable */
	const newFn = immediate
		? function(this: T): void {
				if (!handler) {
					const args =
						arguments.length === 1
							? [arguments[0]]
							: Array.apply(null, (arguments as unknown) as any[]);
					setTimeout(f, 0, this, args);
					handler = setTimeout(() => (handler = null), intv);
				}
		  }
		: function(this: T): void {
				if (!handler) {
					const args =
						arguments.length === 1
							? [arguments[0]]
							: Array.apply(null, (arguments as unknown) as any[]);
					handler = setTimeout(() => f(this, args) || (handler = null), intv);
				}
		  };
	/* eslint-enable */
	return ctx ? ((newFn.bind(ctx) as unknown) as F) : ((newFn as unknown) as F);
}

const _tween = {
	linear(t: number, b: number, c: number, d: number): number {
		return (c * t) / d + b;
	},
	easeIn(t: number, b: number, c: number, d: number): number {
		return c * (t /= d) * t + b;
	},
	strongEaseIn(t: number, b: number, c: number, d: number): number {
		return c * (t /= d) * t * t * t * t + b;
	},
	strongEaseOut(t: number, b: number, c: number, d: number): number {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},
	sineaseIn(t: number, b: number, c: number, d: number): number {
		return c * (t /= d) * t * t + b;
	},
	sineaseOut(t: number, b: number, c: number, d: number): number {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	}
};

function _step(
	startPos: number,
	endPos: number,
	startTime: number,
	duration: number,
	easing: keyof typeof _tween,
	setValue: (val: number) => void
): boolean | void {
	const curTime = Date.now();
	if (curTime >= startTime + duration) {
		setValue(endPos);
		return false;
	}
	const pos = _tween[easing](curTime - startTime, startPos, endPos - startPos, duration);
	setValue(pos);
}

export function animate(
	{
		endPos,
		duration,
		setValue,
		// eslint-disable-next-line
		cb = function() {},
		startPos = 0,
		easing = 'easeIn'
	}: {
		endPos: number;
		duration: number;
		setValue: (val: number) => void;
		cb: () => void;
		startPos: number;
		easing: keyof typeof _tween;
	} = {} as any
): void {
	function run(): void {
		// eslint-disable-next-line
		if (_step(startPos, endPos, startTime, duration, easing, setValue) === false) {
			// eslint-disable-next-line
			clearRAF(id);
			cb();
		} else {
			// eslint-disable-next-line
			rAF(run);
		}
	}
	const startTime = Date.now();
	// eslint-disable-next-line
	const id = rAF(run);
}

export function p(obj: any, path: Array<string> = []): any {
	const value = (defaultValue: any): any => {
		let val = obj;
		while (val != null && path.length && (val = val[path.shift()!]));
		return val == null ? defaultValue : val;
	};
	return new Proxy(value, {
		get(target, key: string): any {
			path.push(key);
			return p(obj, path);
		}
	});
}

function isTwoCodePoint(char: string): boolean {
	try {
		encodeURIComponent(char);
		return false;
	} catch (e) {
		return true;
	}
}

const selfCloseTags = [
		'link',
		'meta',
		'hr',
		'br',
		'area',
		'img',
		'track',
		'source',
		'col',
		'input'
	],
	noRenderTags = ['script', 'video', 'audio'];

export function trimHtml(
	html: string,
	{ limit = 100, suffix = null } = {}
): { html: string; more: boolean } {
	const tagStack: Array<string> = [];
	let currentTag = '',
		more = false,
		count = 0;
	// eslint-disable-next-line
	for (var i = 0, len = html.length; i < len; ++i) {
		const tagName = [];
		if (count >= limit) {
			more = i + 1 < len;
			break;
		}
		if (html[i] === '<' && html[i + 1] !== '/') {
			++i;
			while (html[i] !== '>' && !html[i].match(/\s|\//)) {
				tagName.push(html[i++]);
			}
			while (html[i] !== '>') ++i;
			currentTag = tagName.join('');
			if (selfCloseTags.includes(currentTag)) {
				continue;
			}
			tagStack.push(currentTag);
		} else if (html[i] === '<' && html[i + 1] === '/') {
			i += 2;
			while (html[i] !== '>') ++i;
			tagStack.pop();
		} else if (noRenderTags.includes(currentTag)) {
			continue;
		} else {
			++count;
		}
	}
	if (isTwoCodePoint(html[i])) {
		++i;
	}
	let rst = html.slice(0, i);
	if (suffix && more) {
		rst += suffix;
	}
	while (tagStack.length) {
		rst += `</${tagStack.pop()}>`;
	}
	return {
		html: rst,
		more
	};
}

export function range(start: number, count: number): Array<number> {
	return Array.from({ length: count }, (v, k) => k + start);
}

export function getDate(timestamp: number): string {
	const date = new Date(timestamp),
		year = date.getFullYear(),
		month = date.getUTCMonth() + 1,
		day = date.getUTCDate();
	return `${year}/${month}/${day}`;
}

export function addTableWrapper(htmlStr: string, classStr: string): string {
	return htmlStr.replace(/<\/?table.*?>/g, m => {
		if (m === '</table>') {
			return '</table></div>';
		} else {
			return `<div class="${classStr}">${m}`;
		}
	});
}

const _reqMap = Symbol('reqMap');

export const RequestCache = {
	[_reqMap]: {} as Record<string, Promise<any>>,
	get(name: string): Promise<any> {
		return this[_reqMap][name];
	},
	set(name: string, req: Promise<any>): void {
		this[_reqMap][name] = req;
	}
};

export const isFn = (f: any): f is Function => typeof f === 'function';

// export const loadAllObj = ctx =>
// 	ctx.keys().reduce((rst, item) => Object.assign(rst, ctx(item).default), {});

// export const loadAllArr = ctx =>
// 	ctx.keys().reduce((rst, item) => rst.concat(ctx(item).default), []);

export const rAF =
	// eslint-disable-next-line
	window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	// eslint-disable-next-line
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame;

// eslint-disable-next-line
export const clearRAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
