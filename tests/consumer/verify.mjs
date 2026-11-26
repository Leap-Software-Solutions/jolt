import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const appSource = path.join(root, 'tests/consumer/app');
const temp = mkdtempSync(path.join(tmpdir(), 'jolt-consumer-'));
const app = path.join(temp, 'app');

function run(command, args, cwd) {
	execFileSync(command, args, {
		cwd,
		stdio: 'inherit',
	});
}

try {
	run('pnpm', ['build'], root);
	run('pnpm', ['pack', '--pack-destination', temp], root);

	const tarball = readdirSync(temp).find((file) => file.endsWith('.tgz'));

	if (!tarball) {
		throw new Error('pnpm pack did not produce a tarball');
	}

	cpSync(appSource, app, { recursive: true });

	const rootPackage = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
	const versions = rootPackage.devDependencies;
	const fixturePackage = {
		name: 'jolt-consumer-fixture',
		private: true,
		type: 'module',
		scripts: {
			build: 'vite build',
		},
		dependencies: {
			[rootPackage.name]: `file:../${tarball}`,
			'bits-ui': versions['bits-ui'],
		},
		devDependencies: {
			'@sveltejs/vite-plugin-svelte': versions['@sveltejs/vite-plugin-svelte'],
			'@tailwindcss/vite': versions['@tailwindcss/vite'],
			svelte: versions.svelte,
			tailwindcss: versions.tailwindcss,
			vite: versions.vite,
		},
	};

	writeFileSync(path.join(app, 'package.json'), `${JSON.stringify(fixturePackage, null, 2)}\n`);
	writeFileSync(
		path.join(app, 'pnpm-workspace.yaml'),
		'minimumReleaseAge: 0\nallowBuilds:\n  esbuild: true\n',
	);

	run('pnpm', ['install'], app);
	run('pnpm', ['build'], app);

	const assetDirectory = path.join(app, 'dist/assets');
	const css = readdirSync(assetDirectory)
		.filter((file) => file.endsWith('.css'))
		.map((file) => readFileSync(path.join(assetDirectory, file), 'utf8'))
		.join('\n');

	for (const expected of [
		'bg-primary',
		'bg-brand',
		'bg-popover',
		'bg-card',
		'bg-muted',
		'bg-success',
		'text-info',
		'text-warning',
		'rounded-md',
	]) {
		if (!css.includes(`.${expected}`)) {
			throw new Error(`Expected .${expected} in the consumer CSS output`);
		}
	}

	console.log('Consumer fixture passed: package JS, styles, and Tailwind sources resolve.');
} finally {
	if (!process.argv.includes('--keep')) {
		rmSync(temp, { recursive: true, force: true });
	}
}
