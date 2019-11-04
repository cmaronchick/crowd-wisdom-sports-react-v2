import config from './config';
import apiRouter from './apis';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import serverRender from './serverRender';
import express from 'express';
import bodyParser from 'body-parser';

const server = express();
server.use(bodyParser.json());

server.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public')
}));
server.use(express.static('public'));

server.set('view engine', 'ejs');

server.get(['/', '/:sport', '/:sport/games', '/:sport/games/:year', '/:sport/games/:year/:season', '/:sport/games/:year/:season/:gameWeek', '/:sport/games/:year/:season/:gameWeek/:gameId'], (req, res) => {
  //console.log('req.query: ', req.query)
    const sportsArray = ['nfl', 'ncaaf', 'ncaam']
    const sport = (req.params.sport && sportsArray.indexOf(req.params.sport) > -1) ? req.params.sport : 'nfl'
    // console.log('server 25 sport: ', sport)
    serverRender(req, sport, parseInt(req.params.year), req.params.season, parseInt(req.params.gameWeek), req.query, 'games', parseInt(req.params.gameId))
      .then(({ initialMarkup, initialData }) => {
        res.render('index', {
          initialMarkup,
          initialData
        });
      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      });
});

server.get(['/:sport/leaderboards', '/:sport/leaderboards/:year', '/:sport/leaderboards/:year/:season', '/:sport/leaderboards/:year/:season/:gameWeek', '/:sport/leaderboards/:year/:season/:gameWeek/'], (req, res) => {
  //console.log('req.url: ', req.url)
  const sport = req.params.sport ? req.params.sport : 'nfl'
  //console.log('server 25 sport: ', sport)
  serverRender(req, sport, parseInt(req.params.year), req.params.season, parseInt(req.params.gameWeek), req.query, 'leaderboards', null, null)
    .then(({ initialMarkup, initialData }) => {
      res.render('index', {
        initialMarkup,
        initialData
      });
    })
    .catch(error => {
      console.error(error);
      res.status(404).send('Bad Request');
    });
});
server.get(['/:sport/crowds', '/:sport/crowds/:year', '/:sport/crowds/:year/:season', '/:sport/crowds/:year/:season/:crowdId'], (req, res) => {
  //console.log('req.query: ', req.query)
  
    const sport = req.params.sport ? req.params.sport : 'nfl'
    // console.log('server 25 sport: ', sport)
    serverRender(req, sport, parseInt(req.params.year), req.params.season, parseInt(req.params.gameWeek), req.query, 'crowds', parseInt(req.params.crowdId))
      .then(({ initialMarkup, initialData }) => {
        res.render('index', {
          initialMarkup,
          initialData
        });
      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      });
});

server.use('/api', apiRouter);

// serve static assets if in production

if (process.env.NODE_ENV === "production") {
  server.use(express.static('client/build'));

  server.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

server.listen(config.port, config.host, () => {
  console.log('config: ', config)
  console.info('Express listening on port', config.port);
});