import React from 'react';
import Auth from '@aws-amplify/auth';

import awsconfig from '../../awsexports'

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);

import Header from './Header';
import GamesList from './GamesList';
import Game from './Game';
import Weeks from './Weeks';
import * as api from '../api';
import { APIClass } from 'aws-amplify';

const pushState = (obj, url) =>
  window.history.pushState(obj, '', url);

const onPopState = handler => {
  window.onpopstate = handler;
};

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.props.initialData;
  }
  
  
  componentDidMount() {
    console.log('this.state: ', this.state)
    // timers, listeners
    onPopState((event) => {
      this.setState({
        currentGameId: (event.state || {}).currentGameId
      });
    });
  
    let user = Auth.currentAuthenticatedUser()
    .then(user => {
      this.setState({user, authState: 'signedIn'});
      return user;
    })
    .catch(userError => {
      this.setState({user: null, authState: 'signIn'})
    })

    // api.getGameWeek()
    // .then(gameWeekData => this.setState({year: gameWeekData.year, week: gameWeekData.week}))
    // .catch(gameWeekDataError => console.log('gameWeekDataError2: ', gameWeekDataError))
  }
  componentWillUnmount() {
    // clean timers, listeners
    onPopState(null);
  }

   signIn = (e) => {
     e.preventDefault()
    const { username, password } = this.state;
    let user = Auth.signIn(username, password)
    .then(user => {
      console.log('user: ', user)
      this.setState({user, authState: 'signedIn'})
      return user;
    })
    .catch(signInError => {
      console.log('signInError: ', signInError)
    })
  }
  signOut = (e) => {
    e.preventDefault()
    console.log('signOut clicked')
    Auth.signOut()
    .then(() => {
      this.setState({user: null, authState: 'signIn'})
    })
    .catch(signOutError => console.log('signOutError: ', signOutError))
  }

  onChangeText = (event) => {

    this.setState({[event.target.name]: event.target.value})
  }

  fetchGame = (gameId) => {
    pushState(
      { currentGameId: gameId },
      `/game/${gameId}`
    );
    api.fetchGame(gameId).then(game => {
      this.setState({
        pageHeader: gameId,
        currentGameId: gameId,
        data: {
          ...this.state.games,
          [game.gameId]: game
        }
      });
    });
  }

  fetchGamesList = () => {
    pushState(
      {currentGameId: null},
      '/'
    );
    api.fetchGamesList().then(games => {
      this.setState({
        currentGameId: null,
        data: {
          ...this.state.games,
          games
        }
      });
    });
  }

  fetchGameWeek = (year, gameWeek) => {
    pushState(
      {
        currentGameId: null,
        gameWeek: gameWeek,
        year: year
      },
      `/games/${year}/${gameWeek}`
    );
    api.fetchGameWeek(year, gameWeek).then((games) => {
      this.setState({
        year: year,
        gameWeek: gameWeek,
        currentGameId: null,
        data: games,
        games: games
      });
    });
  }

  currentGame() {
    return this.state.games[this.state.currentGameId];
  }
  pageHeader() {
    //console.log('this.state: ', this.state);
    if (this.state.currentGameId) {
      return this.currentGame().awayTeam.shortName + ' vs. ' + this.currentGame().homeTeam.shortName;
    }
    return 'All Games';
  }
  currentContent() {
    if (this.state.currentGameId) {
      return <Game 
      gamesListClick={this.fetchGamesList}
      {...this.currentGame()} />;
    }
    if (this.state.signIn) {

    }
    //console.log('this.state.games: ', this.state.games);
    return <div><Weeks
    onGameWeekClick={this.fetchGameWeek}
    weeks={[{ year: 2018, week: 1}, { year: 2018, week: 2}, {year: 2018, week: 3}]} />
    <GamesList onGameClick={this.fetchGame}
    games={this.state.games} /></div>;
  }
  render() {
    return (
      <div className="App">
        <Header message={this.pageHeader()} />
        
        {(this.state.authState === 'signedIn') ? (
          <button onClick={this.signOut}>Logout</button>
        ) : (
          <div className="loginFields">
            <form>
              <label htmlFor='username'>
                User Name:
              </label>
                <input type="text" name="username" key="username" onChange={this.onChangeText} />
              <label htmlFor='password'>
                Password:
              </label>
              <input type="password" name="password" key="password" onChange={this.onChangeText} />
              
              <button onClick={this.signIn}>Login</button>
            </form>
          </div>
        )}
        {this.currentContent()}
      </div>
    );
  }
}

// App.propTypes = {
//   initialGames: React.PropTypes.object
// };

export default App;
