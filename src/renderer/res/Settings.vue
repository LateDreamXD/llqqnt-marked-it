<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
const { packageJson, versions, options, defaultOptions } = defineProps<{
	versions: {
		plugin: string;
		marked: string;
		katex: string;
	};
	packageJson: typeof import('@package');
	options: typeof import('./default.json');
	defaultOptions: typeof import('./default.json');
}>();
const newVersion = ref<false | string>(false);

const versionsLabels: Record<string, string> = {
	plugin: '插件版本',
	marked: 'Marked 版本',
	katex: 'KaTeX 版本'
};

const openGithubRepo = (lastestRelease?: boolean) => {
	LiteLoader.api.openExternal(
		packageJson.repository.url.replace('.git', '') +
		(lastestRelease? '/release/latest': '')
	);
}

const saveOptions = () => {
	LiteLoader.api.config.set('marked-it', options);
}

const textareaChange = (e: Event, name: string) => {
	const target = e.target as HTMLTextAreaElement;
	(options as any)[name] = JSON.parse(target.value);
	saveOptions();
}

onBeforeMount(async() => {
	await fetch(`${packageJson.repository.url.replace('.git', '')}/release/latest`, {
		redirect: 'follow', mode: 'no-cors'
	}).then(res => {
		const latest = (res.url.split('/').pop()?.replace('v', '') || '0.0.0').split('.');
		const current = versions.plugin.split('.');
		for(let i in current) {
			if(parseInt(current[i]) < parseInt(latest[i])) {
				console.log('[marked-it] found new version:', latest.join('.'));
				newVersion.value = latest.join('.');
				break;
			}
		}
	});
});
</script>

<template>
	<setting-section data-title="版本">
		<setting-panel>
			<setting-list data-direction="row">
				<setting-item v-for="(ver, i) of versions" :key="i">
					<setting-text>{{ versionsLabels[i] }}</setting-text>
					<setting-text data-type="secondary" @click="newVersion && openGithubRepo(true)">v{{ ver }}{{ i === 'plugin' && newVersion? ` (新版本: ${newVersion})` : '' }}</setting-text>
				</setting-item>
			</setting-list>
		</setting-panel>
		<setting-panel>
			<setting-list data-direction="column">
				<setting-item>
					<setting-text>GitHub 仓库</setting-text>
					<setting-button @click="openGithubRepo">去看看</setting-button>
				</setting-item>
			</setting-list>
		</setting-panel>
	</setting-section>

	<setting-section data-title="插件配置">
		<setting-panel>
			<setting-list data-direction="column">
				<setting-item>
					<setting-text>切换原始文本按钮</setting-text>
					<setting-switch :is-active="options.plugin.toggleRawText"
						@click="(options.plugin.toggleRawText = !options.plugin.toggleRawText) && saveOptions" />
				</setting-item>
				<setting-item>
					<div>
						<setting-text>拦截链接点击事件</setting-text>
						<setting-text data-type="secondary">开启后，点击链接时会拦截事件并通过默认浏览器打开链接</setting-text>
					</div>
					<setting-switch :is-active="options.plugin.handleAnchorClick"
						@click="(options.plugin.handleAnchorClick = !options.plugin.handleAnchorClick) && saveOptions" />
				</setting-item>
				<setting-item>
					<setting-text>防抖延迟</setting-text>
					<input class="q-input__inner" v-model="options.plugin.debounceDelay" type="number"
						min="0" max="5000" step="10" @change="saveOptions" />
				</setting-item>
				<setting-item>
					<setting-text>渲染后添加的类名</setting-text>
					<input class="q-input" v-model="options.plugin.markedClass"
						@change="saveOptions" />
				</setting-item>
				<setting-item>
					<setting-text>忽略的类名</setting-text>
					<input class="q-input" v-model="options.plugin.ignoredClass"
						@change="saveOptions" />
				</setting-item>
			</setting-list>
		</setting-panel>
	</setting-section>

	<setting-section data-title="Marked 配置">
		<setting-link data-value="https://marked.js.org/using_advanced#options" />
		<textarea class="q-textarea" :value="JSON.stringify(options.marked, null, 2)"
			@change="textareaChange($event, 'marked')" />
	</setting-section>

	<setting-section data-title="KaTeX 配置">
		<setting-link data-value="https://katex.org/docs/options" />
		<textarea class="q-textarea" :value="JSON.stringify(options.katex, null, 2)"
			@change="textareaChange($event, 'katex')" />
	</setting-section>
</template>
