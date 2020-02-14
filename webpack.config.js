const path = require('path');
const config = require('buildConfig');

const isProduction = process.env.NODE_ENV === 'prod';

module.exports = {
	mode: isProduction ? 'production' : 'development',
	resolve: {
		extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
		modules: [path.join(__dirname, './node_modules'), path.join(__dirname, './bower_components')],
	},
	entry: `${config.frontendSource}js`,
	output: {
		path: `${config.frontendDestination}js`,
		filename: 'bundle.js',
		publicPath: 'dist/js/',
	},
	module: {
		rules: [
			{
				test: /\.(t|j)s(x)?$/,
				exclude: /node_modules|bower_components/,
				use: 'babel-loader',
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	profile: true,
	watch: false,
	watchOptions: {
		ignored: /node_modules|bower_components/,
	},
	//devtool: process.env.NODE_ENV === 'prod' ? false : 'source-map',
	devtool: 'source-map',
};
