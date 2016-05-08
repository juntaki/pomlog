module.exports = {
    entry: {
        main: './src/main.jsx',
        counter: './src/counter.jsx',
    },
    output: {
        filename: 'public/[name]_bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                }
            }
        ]
    }
};
