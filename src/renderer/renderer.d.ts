/// <reference types="@llqqntuno/liteloader-types/preload" />

import { api } from '../preload';

declare global {
	interface Window {
		readonly quilt: typeof api;
	}
	const quilt: typeof api;
}
