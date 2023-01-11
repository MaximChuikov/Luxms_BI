// node.js server used to serve assets bundled by Webpack
// use `yarn start` command to launch the server.
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config');
const path = require('path');
const mime = require('mime-types');
const config = require('./lib/config');
const { filterSchemaNames } = require('./lib/utils');
const { loginWithSpinner }  = require('./lib/commands');
const authMiddleware = require('./apis/auth-middleware');
const RtMiddleware = require('./apis/rt-middleware');

// initialize server module
config.getSUPConfigAndLog();
const SERVER = config.getServer();
const PORT = config.getPort();


loginWithSpinner().then(() => {

  const options = {
    // publicPath: webpackConfig.output.publicPath,
    // contentBase: 'www',
    compress: false,
    host: '0.0.0.0',
    port: PORT,
    // hot: true,
    // inline: true,
    hot: true,
    inline: false,
    stats: {colors: true},
    // open: true,
    publicPath: '/',
    watchOptions: {ignored: /node_modules/, poll: true},

    sockPath: '/srv/rt',

    transportMode: {
      client: 'ws',
      server: require.resolve('./CustomServer'),
    },

    // onListening: function (server) {
    //   const port = server.listeningApp.address().port;
    //   console.log('Listening on port:', port);
    // },
    before(app, wds, compiler) {
      app.use(authMiddleware());
      app.use('/api/db/:schema_name.resources/', (req, res, next) => {
        const schema_name = req.params.schema_name;
        if (!filterSchemaNames([schema_name]).length) return next();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(Object.keys(ASSETS).filter(asset => asset.startsWith(schema_name + '/')).map(asset => ASSETS[asset])));
      });

      // поскольку есть copy plugin, теперь не нужно сервить статику специальным образом
      // app.use('/srv/resources/', express.static(path.resolve(__dirname, '..', 'src')));
    },
    // after: function (app, server, compiler) {
    // },
    proxy: {
      // '/api': { target: API, changeOrigin: true, secure: false },
      // '/srv': { target: API, changeOrigin: true, secure: false, onError(err) { console.log('/srv error:', err);  }, },
      // '/srv/rt': { target: API.replace(/^http/, 'ws'), changeOrigin: true, secure: false, ws: true, onError(err) { console.log('WS error:', err);  }, },
      // '/admin-server': { target: API, changeOrigin: true, secure: false },
      '/': {target: SERVER, changeOrigin: true, secure: false},
    },

  };

  const webpackDevServer = new WebpackDevServer(webpack(webpackConfig), options);

  webpackDevServer.listen(PORT, '0.0.0.0', function (err) {
    if (err) {
      console.log(err);
    }
    console.log('WebpackDevServer listening at localhost:', PORT);
  });


  let rtMiddleware = new RtMiddleware(webpackDevServer.listeningApp);                                 // rt must be initialized with httpServer object
  let ASSETS = {}, _id = 1;

  webpackDevServer.compiler.hooks.done.tap('webpack-dev-server', (stats) => {
    try {
      const now = new Date(stats.endTime).toJSON();

      const short = name => name.slice(14);                                                           // cut srv/resources from beginning of id
      const assets = {};
      Object.keys(stats.compilation.assets).forEach(id => assets[short(id)] = stats.compilation.assets[id]);
      const emittedAssetIds = Array.from(stats.compilation.emittedAssets).map(short);

      const deletedIds = Object.keys(ASSETS).filter(id => !assets[id]);
      const addedIds = Object.keys(assets).filter(id => !ASSETS[id]);
      const modifiedIds = emittedAssetIds.filter(id => ASSETS[id]);

      console.log('deleted', deletedIds);
      console.log('added', addedIds);
      console.log('modified', modifiedIds);

      // groupBySchemaNames(deletedIds).forEach(({schema_name, ids}) => rtMiddleware.deleteResources(schema_name, ids.map(id => ASSETS[id])));
      deletedIds.forEach(id => delete ASSETS[id]);

      addedIds.forEach(asset => ASSETS[asset] = {
        id: _id++,
        alt_id: asset.replace(/^\w+\//, ''),
        content_type: mime.lookup(asset),
        content_length: assets[asset]._size,
        config: {},
        updated: now,
        created: now
      });
      groupBySchemaNames(addedIds).forEach(({schema_name, ids}) => rtMiddleware.addResources(schema_name, ids.map(id => ASSETS[id])));

      modifiedIds.forEach(asset => ASSETS[asset].updated = now);
      groupBySchemaNames(modifiedIds).forEach(({schema_name, ids}) => rtMiddleware.modifyResources(schema_name, ids.map(id => ASSETS[id])));

    } catch (err) {
      console.error(err);
    }
  });


// ids is array of strings of form `schema_name/resource_id`
// return [ {schema_name, ids: [...]}, ... ]
  function groupBySchemaNames(ids) {
    let h = {};
    ids.forEach(id => {
      let schema_name = id.split('/')[0];
      (h[schema_name] || (h[schema_name] = {schema_name, ids: []})).ids.push(id);
    });
    return Object.values(h);
  }

});