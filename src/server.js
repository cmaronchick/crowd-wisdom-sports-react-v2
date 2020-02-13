import config from './config';
import apiRouter from './api';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import serverRender from './serverRender';
import express from 'express';
import bodyParser from 'body-parser';

const server = express();
server.use(bodyParser.json());

server.use(sassMiddleware({
  src: path.join(__dirname, '../sass'),
  dest: path.join(__dirname, 'public')
}));
server.use(express.static('public'));
server.use(express.static('dist'));

server.set('view engine', 'ejs');


server.get('/profile', (req, res) => {
  console.log('req', req.path)
  res.render('index', {
    initialMarkup: `<div>User Profile</div>`,
    initialData: {
      user: null,
      page: 'profile'
    },
    environment: process.env.NODE_ENV === "production" ? "production" : "dev"
  })
})

server.get(['/', '/:sport', '/:sport/games', '/:sport/games/:year', '/:sport/games/:year/:season', '/:sport/games/:year/:season/:gameWeek', '/:sport/games/:year/:season/:gameWeek/:gameId'], (req, res) => {
    const user = req.query ? req.query.compareUsername : null
    const sportsArray = ['nfl', 'ncaaf', 'ncaam']
    const sport = (req.params.sport && sportsArray.indexOf(req.params.sport) > -1) ? req.params.sport : 'nfl'
    // console.log('server 25 sport: ', sport)
    serverRender(req, sport, parseInt(req.params.year), req.params.season, parseInt(req.params.gameWeek), req.query, 'games', `${req.hostname}${req.port ? `:${req.port}` : ''}`, parseInt(req.params.gameId))
      .then(({ initialMarkup, initialData }) => {
        res.render('index', {
          initialMarkup,
          initialData,
          environment: process.env.NODE_ENV === "production" ? "production" : "dev"
        });
      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      });
});

server.get(['/:sport/leaderboards', '/:sport/leaderboards/:year', '/:sport/leaderboards/:year/:season', '/:sport/leaderboards/:year/:season/:gameWeek', '/:sport/leaderboards/:year/:season/:gameWeek/'], (req, res) => {
  console.log('req.url: ', req.path)
  const sport = req.params.sport ? req.params.sport : 'nfl'
  //console.log('server 25 sport: ', sport)
  serverRender(req, sport, parseInt(req.params.year), req.params.season, parseInt(req.params.gameWeek), req.query, 'leaderboards', `${req.hostname}${req.port ? `:${req.port}` : ''}`, null, null)
    .then(({ initialMarkup, initialData }) => {
      res.render('index', {
        initialMarkup,
        initialData,
        environment: process.env.NODE_ENV === "production" ? "production" : "dev"
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
    serverRender(req, sport, parseInt(req.params.year), req.params.season, parseInt(req.params.gameWeek), req.query, 'crowds', `${req.hostname}${req.port ? `:${req.port}` : ''}`, parseInt(req.params.crowdId))
      .then(({ initialMarkup, initialData }) => {
        res.render('index', {
          initialMarkup,
          initialData,
          environment: process.env.NODE_ENV === "production" ? "production" : "dev"
        });
      })
      .catch(error => {
        console.error(error);
        res.status(404).send('Bad Request');
      });
});

server.use('/api', apiRouter);

// serve static assets if in production

// if (process.env.NODE_ENV === "production") {
//   server.use(express.static('client/build'));

//   server.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
//   })
// }

server.listen(config.port, config.host, () => {
  console.log('config: ', config)
  console.info('Express listening on port', config.port);
});