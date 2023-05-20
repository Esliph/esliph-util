module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'
    ],
    plugins: [
        ['module-resolver', {
            alias: {
                '@lib': './src/lib',
                '@@types': './@types',
            }
        }]
    ],
    ignore: [
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.d.ts',
    ]
}