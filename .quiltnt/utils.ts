// @ts-nocheck
import tsdown_config from '../tsdown.config';

declare type Person = {
	name: string,
	url?: string,
	email?: string,
}

function generateAuthors(packageJson: typeof import('../package.json')) {
	if(packageJson.quiltnt.manifest.authors && packageJson.quiltnt.manifest.authors.length > 0)
		return packageJson.quiltnt.manifest.authors;
	const authors: {name: string, link?: string}[] = [];
	const author = packageJson.author as string | Person | undefined;
	if(author) {
		authors.push(typeof author === 'string'? {
			name: author.split(' ')[0],
			link: author.split(' ').find(item => item.startsWith('(http'))?.replace(/\(|\)/g, '')
		}: {
			name: author.name,
			link: author.url || `mailto:${author.email}`,
		});
	}
	const contributors = packageJson.contributors as Person[] | undefined;
	if(contributors) {
		contributors.forEach(contributor => {
			authors.push(typeof contributor === 'string'? {
				name: contributor.split(' ')[0],
				link: contributor.split(' ').find(item => item.startsWith('(http'))?.replace(/\(|\)/g, '')
			}: {
				name: contributor.name,
				link: contributor.url || `mailto:${contributor.email}`,
			});
		});
	}
	return authors;
}

function generateInjects(packageJson: typeof import('../package.json')) {
	if(packageJson.quiltnt.manifest.injects !== 'tsdown')
		return packageJson.quiltnt.manifest.injects;
	return {
		main: Object.keys(tsdown_config.format?.cjs.entry || {}).find(key => key === 'main')?
			  './main.cjs': null,
		preload: Object.keys(tsdown_config.format?.cjs.entry || {}).find(key => key === 'preload')?
				 './preload.cjs': null,
		renderer: Object.keys(tsdown_config.format?.esm.entry || {}).find(key => key === 'renderer')?
				  './renderer.mjs': null,
	}
}

function generateRepository(packageJson: typeof import('../package.json')) {
	if(packageJson.quiltnt.manifest.repository) {
		const repo = Object.assign({}, packageJson.quiltnt.manifest.repository);
		delete repo.release['tag.v'];
		const addV = packageJson.quiltnt.manifest.repository.release['tag.v'] as boolean | null;
		repo.release = repo.release || {};
		if((!repo.release.tag || repo.release.tag === 'latest')) {
			repo.release.tag = repo.release.tag || packageJson.version;
			addV && (repo.release.tag = 'v' + repo.release.tag);
		}
		return repo;
	}
	if(packageJson.repository)
		return {
			branch: 'main',
			repo: packageJson.repository.url.split('github.com/')[1].replace('.git', ''),
			release: null
		}
	return null;
}

export {
	generateAuthors,
	generateInjects,
	generateRepository,
}
