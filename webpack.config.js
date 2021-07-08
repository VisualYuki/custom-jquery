const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const lessPluginGlob = require("less-plugin-glob");

//const chokidar = require("chokidar");
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === "development";
//const isProd = !isDev;

//const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

module.exports = {
	devtool: isDev ? "eval-source-map" : false,
	context: path.resolve(__dirname, "src"),
	target: "web",
	entry: {
		index: "./js/index.ts",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "site-main.js",
	},
	devServer: {
		historyApiFallback: true,
		hot: true,
		static: true,
		watchFiles: path.resolve(__dirname, "dist"),
		//before: function(app, server) {
		//	chokidar.watch(["./src/pug/**/*.pug"]).on("all", function () {
		//		server.sockWrite(server.sockets, "content-changed");
		//	});
		//}
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		alias: {
			"@js": path.resolve(__dirname, "src/js/"),
			"@less": path.resolve(__dirname, "src/less/"),
			"@assets": path.resolve(__dirname, "src/assets/"),
			"@src": path.resolve(__dirname, "src"),
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./pages/index.pug",
			minify: false,
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: "site-main.css",
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: "./svg", to: path.resolve(__dirname, "dist/svg") },
				{ from: "./favicons", to: path.resolve(__dirname, "dist/favicons") },
			],
		}),
		//new HtmlWebpackPlugin({
		//	alwaysWriteToDisk: true
		//}),
		//new BundleAnalyzerPlugin(),
	],
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: "ts-loader" },
			//{
			//	//test: /\.js$/,
			//	test: /\.ts?$/,
			//	exclude: /node_modules/,
			//	//use: {
			//	//	loader: "babel-loader",
			//	//},
			//},
			//{
			//	test: /\.js$/,
			//	exclude: /node_modules/,
			//	//use: {
			//	//	loader: "babel-loader"
			//	//},
			//},
			{
				test: /\.less$/i,
				// exclude: /\.module\.(sa|sc|c)ss$/,
				use: [
					// Inject CSS into the DOM. === Creates `style` nodes from JS strings
					//"style-loader",
					MiniCssExtractPlugin.loader,
					// The css-loader interprets @import and url() like import/require() and will resolve them. === Translates CSS into CommonJS
					"css-loader",

					// Compiles Less to CSS
					{
						loader: "less-loader",
						options: {
							lessOptions: {
								plugins: [lessPluginGlob],
								paths: [path.resolve(__dirname, "src/less/site-main.less")], // This is the important part! }
							},
						},
					},
				],
			},
			{
				test: /\.pug$/,
				loader: "pug-loader",
				options: {
					pretty: true,
				},
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: ["file-loader"],
			},
			{
				test: /\.(ttf|woff|woff2|eot)$/,
				use: ["file-loader"],
			},
		],
	},
	optimization: {
		minimize: false,
		//  splitChunks: {
		//      chunks: "all"
		//  }
	},
};
