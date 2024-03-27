require('esbuild').build({
  entryPoints: ["lambdas/index.ts"],
  minify: true,
  platform: 'node',
  bundle: true,
  sourcemap: true,
  target: 'es2020',
  outfile: "dist/index.mjs",
  external: [
    "@aws-sdk/client-sqs",
    "@aws-sdk/client-sns"
  ]
})
    // "prebuild": "rm -rf dist",
    // "build": "tsc --noEmit && node esbuild.config.js",
    // "postbuild": "cd dist && zip -r index.zip * ../node_modules"