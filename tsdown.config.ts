const { defineConfig } = require('tsdown');

module.exports = defineConfig({
	// 外部依赖, 防止被 tsdown 打包
	external: ['electron'],

	entry: {
		main: 'src/main/index.ts',
		preload: 'src/preload/index.ts',
		renderer: 'src/renderer/index.ts'
	},
	format: {
		cjs: {
			entry: {
				main: 'src/main/index.ts',
				preload: 'src/preload/index.ts'
			},
			platform: 'node',
			target: ['node22']
		},
		esm: {
			entry: {
				renderer: 'src/renderer/index.ts'
			},
			platform: 'browser',
			target: ['es2022']
		}
	},

	// 插件一般用不到 dts 文件
	dts: false,

	// 压缩输出文件
	minify: true
});
