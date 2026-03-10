import { createApp, reactive } from 'vue';
import Settings from './res/Settings.vue';
import packageJson from '@package';
import { version as markedVersion } from 'marked/package.json';
import { version as katexVersion } from 'katex';
import { loadCSS } from './utils';
import defaultOptions from './res/default.json';

import { marked } from 'marked';
import katex from 'marked-katex-extension';

const options = reactive(defaultOptions);
LiteLoader.api.config.get('marked-it', defaultOptions).then(config => {
	Object.assign(options, config);
}).then(() => {
	marked.use(options.marked);
	marked.use(katex(options.katex));
});

export const onSettingWindowCreated = (view: HTMLDivElement) => {
	// 初始化 LiteLoader 设置页
	const app = createApp(Settings, { versions: {
		plugin: packageJson.version,
		marked: markedVersion,
		katex: katexVersion
	}, packageJson, options, defaultOptions });
	app.mount(view);
}

const debounce = (callback: (...args: any[]) => void, delay?: number) => {
	let timer: number | null = null;
	return (...args: any[]) => {
		if(timer)
			clearTimeout(timer);
		timer = setTimeout(() => {
			if(timer)
				clearTimeout(timer);
			timer = null;
			callback(...args);
		}, delay || options.plugin.debounceDelay) as unknown as number;
	}
}

const debounceRender = debounce(() => {
	const messages = document.querySelectorAll('.message-content');
	messages.forEach(el => {
		if(
			el.classList.contains(options.plugin.markedClass) ||
			el.classList.contains(options.plugin.ignoredClass)
		) return;
		try {
			el.setAttribute('data-raw', el.innerHTML);
			const parsed = marked.parse(el.innerHTML) as string;
			el.setAttribute('data-parsed', parsed);
			el.innerHTML = parsed;
			if(options.plugin.handleAnchorClick)
				el.querySelectorAll('a').forEach(a => {
					a.addEventListener('click', (e) => {
						e.preventDefault();
						a.href && LiteLoader.api.openExternal(a.href);
					});
				});
			if(options.plugin.toggleRawText) {
				const rawBtn = document.createElement('button');
				rawBtn.textContent = 'RawText';
				rawBtn.addEventListener('click', () => {
					rawBtn.textContent = rawBtn.hasAttribute('data-display-raw')? 'Markdown': 'RawText';
					el.innerHTML = (rawBtn.hasAttribute('data-display-raw')?
					el.getAttribute('data-parsed'):
					el.getAttribute('data-raw')) || 'LOST DATA!';
					rawBtn.toggleAttribute('data-display-raw');
				});
				rawBtn.style.cssText = 'position: absolute; left: 0; bottom: 0; z-index: 1000; display: none;';
				el.addEventListener('mouseenter', () => {
					rawBtn.style.display = 'block';
				});
				el.addEventListener('mouseleave', () => {
					rawBtn.style.display = 'none';
				});
				el.appendChild(rawBtn);
			}
			el.classList.add(options.plugin.markedClass);
		} catch(err) {
			console.error('[marked-it] error while parsing message content:', err);
		}
	});
});

const init = () => {
	const root = LiteLoader.plugins['marked-it'].path.plugin;
	loadCSS(`local:///${root}/node_modules/katex/dist/katex.min.css`);

	const observer = new MutationObserver((mutations) => {
		mutations.forEach(mutation => {
			if(mutation.type === 'childList') {
				debounceRender();
			}
		});
	});
	observer.observe(document.body, { childList: true, subtree: true });

	console.log('[marked-it] initialized');
}

const onHashChange = () => {
	switch(location.hash) {
		case '#/main/message':
		case '#/chat':
			init();
			break;
		case '#/blank':
		default:
			// navigation is available in chrome 102+
			// @ts-ignore
			navigation.addEventListener('navigatesuccess', onHashChange, { once: true });
			break;
	}
}

onHashChange();
