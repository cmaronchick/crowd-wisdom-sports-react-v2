import config from './config';
import apiRouter from './api';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import serverRender from './serverRender';
import express from 'express';
import bodyParser from 'body-parser';
import Auth from '@aws-amplify/auth'
import { runInNewContext } from 'vm';

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
  
    const sport = req.params.sport ? req.params.sport : 'nfl'
    // console.log('server 25 sport: ', sport)
    serverRender(sport, parseInt(req.params.year), req.params.season, parseInt(req.params.gameWeek), parseInt(req.params.gameId), req.query, 'games')
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
// server.get(['/:sport/leaderboards', '/:sport/leaderboards/:year', '/:sport/leaderboards/:year/:season', '/:sport/leaderboards/:year/:season/:gameWeek', '/:sport/leaderboards/:year/:season/:gameWeek/'], (req, res) => {
//   //console.log('req.url: ', req.url)
//   const sport = req.params.sport ? req.params.sport : 'nfl'
//   //console.log('server 25 sport: ', sport)
//   serverRender(sport, parseInt(req.params.year), req.params.season, parseInt(req.params.gameWeek), parseInt(req.params.gameId), req.query, 'leaderboards')
//     .then(({ initialMarkup, initialData }) => {
//       res.render('index', {
//         initialMarkup,
//         initialData
//       });
//     })
//     .catch(error => {
//       console.error(error);
//       res.status(404).send('Bad Request');
//     });
// });

server.use('/api', apiRouter);

server.listen(config.port, config.host, () => {
  console.log('config: ', config)
  console.info('Express listening on port', config.port);
});