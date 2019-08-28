/// <reference types="@lowb/react-scripts" />

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

export {};
