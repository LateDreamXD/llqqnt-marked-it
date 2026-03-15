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

export const onSettingWindowCreated = (view: HTMLDivElement) => {
	// 初始化 LiteLoader 设置页
	const root = LiteLoader.plugins['marked-it'].path.plugin.replace(/\\/g, '/');
	loadCSS(`local:///${root}/style.css`);
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
			// @ts-ignore
			el.style.backgroundColor = 'transparent';
			el.classList.add(options.plugin.markedClass);
			const replyTextEls = el.querySelectorAll('.reply-content .text');
			const textEls = el.querySelectorAll('.text-normal');

			// parse reply text
			if(replyTextEls.length > 0)
				replyTextEls.forEach(replyTextEl => {
					const rawText = replyTextEl.textContent;
					replyTextEl.setAttribute('data-marked-rawtext', rawText);
					const parsed = marked.parse(rawText) as string;
					replyTextEl.setAttribute('data-marked-parsed', parsed);
					replyTextEl.innerHTML = parsed;
				});

			// parse msg text
			if(textEls.length > 0)
				textEls.forEach(textEl => {
					const rawText = textEl.textContent;
					textEl.setAttribute('data-marked-rawtext', rawText);
					const parsed = marked.parse(rawText) as string;
					textEl.setAttribute('data-marked-parsed', parsed);
					textEl.innerHTML = parsed;
				});

			// handle anchor click
			if(options.plugin.handleAnchorClick)
				el.querySelectorAll('a').forEach(a => {
					a.style.color = '#00bbff';
					a.addEventListener('click', (e) => {
						e.preventDefault();
						a.href && LiteLoader.api.openExternal(a.href);
					});
				});

			// toggle raw text
			if(options.plugin.toggleRawText) {
				const rawBtn = document.createElement('button');
				rawBtn.textContent = 'RawText';
				rawBtn.addEventListener('click', () => {
					rawBtn.textContent = rawBtn.hasAttribute('data-display-raw')? 'Markdown': 'RawText';

					// toggle reply text
					if(replyTextEls.length > 0)
						replyTextEls.forEach(replyTextEl => {
							replyTextEl.innerHTML = (rawBtn.hasAttribute('data-display-raw')?
							replyTextEl.getAttribute('data-marked-rawtext'):
							replyTextEl.getAttribute('data-marked-parsed')) || 'LOST DATA!';
						});

					// toggle msg text
					if(textEls.length > 0)
						textEls.forEach(textEl => {
							textEl.innerHTML = (rawBtn.hasAttribute('data-display-raw')?
							textEl.getAttribute('data-marked-rawtext'):
							textEl.getAttribute('data-marked-parsed')) || 'LOST DATA!';
						});
				});
				rawBtn.style.cssText = 'position: absolute; left: 0; bottom: 0; z-index: 1000; display: none;';

				el.parentElement!.addEventListener('mouseenter', () => {
					rawBtn.style.display = 'block';
				});
				el.parentElement!.addEventListener('mouseleave', () => {
					rawBtn.style.display = 'none';
				});

				el.parentElement!.appendChild(rawBtn);
			}
		} catch(err) {
			console.error('[marked-it] error while parsing message content:', err);
		}
	});
});

const init = () => {
	const root = LiteLoader.plugins['marked-it'].path.plugin.replace(/\\/g, '/');
	loadCSS(`local:///${root}/node_modules/github-markdown-css/github-markdown.css`);
	loadCSS(`local:///${root}/node_modules/katex/dist/katex.min.css`);

	const observer = new MutationObserver((mutations) => {
		mutations.forEach(mutation => {
			if(mutation.type === 'childList') {
				debounceRender();
			}
		});
	});
	observer.observe(document.body, { childList: true, subtree: true });

	console.log('[marked-it] initialized, config:', options);
}

const onHashChange = () => {
	if(location.hash.startsWith('#/forward')) {
		init();
		return;
	}
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

LiteLoader.api.config.get('marked-it', defaultOptions).then(config => {
	if(config)
		Object.assign(options, config);
}).then(() => {
	marked.use(options.marked);
	marked.use(katex(options.katex));
	onHashChange();
});
