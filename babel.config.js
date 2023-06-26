module.exports = {
    presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
    plugins: [
        [
            'module-resolver',
            {
                alias: {
                    '@lib': './src/lib',
                    '@util': './src/util',
                },
            },
        ],
    ],
    ignore: ['**/*spec.ts', '**/*test.ts', '**/*.d.ts', './public', './src/@test'],
}
