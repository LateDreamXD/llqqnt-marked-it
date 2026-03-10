// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { generateAuthors, generateInjects, generateRepository } from './utils';
import packageJson from '../package.json';

const cwd = process.cwd();
const distDir = path.join(cwd, 'dist');
const publicDir = path.join(cwd, 'public');

if(fs.existsSync(distDir)) {
	console.log('ℹ️  检测到 dist 目录, 开始生成插件清单');
	const timer = Date.now();

	const manifest = {
		manifest_version: packageJson.quiltnt.manifest.manifest_version,
		type: packageJson.quiltnt.manifest.type,
		name: packageJson.quiltnt.manifest.name || packageJson.name,
		slug: packageJson.quiltnt.manifest.slug || packageJson.name,
		version: packageJson.quiltnt.manifest.version || packageJson.version,
		description: packageJson.quiltnt.manifest.description || packageJson.description,
		icon: packageJson.quiltnt.manifest.icon,
		thumb: packageJson.quiltnt.manifest.thumb,
		authors: generateAuthors(packageJson),
		dependencies: packageJson.quiltnt.manifest?.dependencies || [],
		platform: packageJson.quiltnt.manifest.platform,
		injects: generateInjects(packageJson),
		repository: packageJson.quiltnt.manifest.repository || generateRepository(packageJson),
	}

	try {
		fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2),
		{encoding: 'utf-8'});
		console.log(`✅  插件清单生成成功, 耗时 ${Date.now() - timer}ms`);
	} catch (error) {
		console.error('❌  插件清单生成失败', error);
	}

	try {
		const timer = Date.now();
		if(process.argv.includes('--no-public')) process.exit(0);
		console.log(`ℹ️  接下来将会复制 public 目录下的静态资源到 dist 目录,
    如果你不需要或是使用了包含此功能的框架(如 "Vite"),
    请在 postbuild 命令末尾添加 --no-public 参数\n`);
		if(fs.existsSync(publicDir)) {
			fs.cpSync(publicDir, distDir, {recursive: true});
			console.log(`✅  插件静态资源复制成功, 耗时 ${Date.now() - timer}ms`);
		} else console.warn('⚠️  未检测到 public 目录, 跳过复制插件静态资源');
	} catch (error) {
		console.error('❌  插件静态资源复制失败', error);
	}
} else console.warn('⚠️  未检测到 dist 目录, 跳过生成插件清单');

try {
	const res = [
		'node_modules/katex/dist/fonts',
		'node_modules/katex/dist/katex.min.css'
	];
	res.forEach(r => fs.cpSync(
		path.join(cwd, r),
		path.join(distDir, r),
		{recursive: true}
	));
} catch {
}
