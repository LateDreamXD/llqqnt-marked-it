import { defineConfig } from 'tsdown';
import vue from 'unplugin-vue/rolldown';
import vueConfig from '@llqqntuno/liteloader-web-components-types/vue-conf';

export default defineConfig({
	deps: {
		neverBundle: ['electron'],
		alwaysBundle: ['vue', /marked/, /katex/],
	},

	entry: {
		renderer: 'src/renderer/index.ts'
	},
	format: {
		esm: {
			entry: {
				renderer: 'src/renderer/index.ts'
			},
			plugins: [vue({
				template: {
					compilerOptions: {
						...vueConfig,
					}
				}
			})],
			platform: 'browser',
			target: ['es2022']
		}
	},

	// 插件一般用不到 dts 文件
	dts: false,

	// 压缩输出文件
	minify: true
});
