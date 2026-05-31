/* Precompile the in-browser JSX to plain JS so the deployed site loads no Babel.
   Each .jsx is transpiled (not bundled) to its .js sibling; React stays a global
   provided by the self-hosted UMD builds in /vendor. Run with: npm run compile */
import { build } from 'esbuild';

const entryPoints = ['app.jsx', 'cv.jsx', 'admin.jsx'];

await build({
  entryPoints,
  outdir: '.',
  bundle: false,
  loader: { '.jsx': 'jsx' },
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  minify: true,
  target: ['es2019'],
  logLevel: 'info',
});

console.log(`Compiled ${entryPoints.join(', ')} -> .js`);
