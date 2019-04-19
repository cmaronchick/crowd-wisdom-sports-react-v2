import React from 'react';
import Auth from '@aws-amplify/auth';

import awsconfig from '../../awsexports'

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);

import Navigation from './Navigation'
import Header from './Header';
import GamesList from './GamesList';
import Game from './Game';
import Weeks from './Weeks';
import LoginModal from './LoginModal';
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
    this.state = {
      ...this.props.initialData,
      sport: 'nfl'
    }
    
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
    })
    .catch(userError => {
      this.setState({user: null, authState: 'signIn'})
    })

    
    this.getUserSession(userSession => {
      api.fetchGameWeek(userSession)
      .then(gameWeekDataResponse => {
        const { year, week } = gameWeekDataResponse.gameWeekData;
        api.fetchGameWeekGames(year, week, userSession)
        .then(games => {
          this.setState({
            year: year,
            gameWeek: week,
            currentGameId: null,
            data: games,
            games: games,
            fetchingGames: false
          });
        });
      })
      .catch(gameWeekDataError => console.log('gameWeekDataError: ', gameWeekDataError))
    })
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('prevState: ', prevState)
    console.log('this.state: ', this.state)

    if (prevState.user !== this.state.user) {
      console.log('app line 75')
      // if (this.state.year && this.state.gameWeek) {
      //   this.fetchGameWeekGames(this.state.year, this.state.gameWeek)
      // } else {
      //    this.fetchGameWeek()
      // }
    }
    if (prevState.games !== this.state.games) {

    }
    if (prevState.year !== this.state.year) {
      console.log('app line 79')
      //this.fetchGameWeekGames(this.state.year, this.state.gameWeek)
      
    }
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

  loginClick = () => {
    return <LoginModal signInClick={this.signIn} signUpClick={this.signUp} />
  }

  
  getUserSession = (callback) => {
    Auth.currentSession()
    .then(userSession => {
      return callback(userSession)
    })
    .catch(userSessionError => {
      return callback(false)
    })
  }

  onChangeText = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  onYearChange = (event) => {
    this.setState({ fetchingGames: true })
    this.fetchGameWeekGames(parseInt(event.target.value), 1)
  }

  fetchGameWeek = () => {
    this.getUserSession(userSession => {
      api.fetchGameWeek(userSession)
      .then(gameWeekData => {
        console.log('app 141 gameWeekData: ', gameWeekData)
        return api.fetchGameWeekGames(gameWeekData.year, gameWeekData.week, userSession).then(games => games);
      })
      .catch(gameWeekDataError => console.log('gameWeekDataError: ', gameWeekDataError))
    })
  }

  fetchGame = (gameId) => {
    pushState(
      { currentGameId: gameId },
      `/game/${gameId}`
    );
    this.getUserSession(userSession => {
      api.fetchGame(gameId, userSession)
      .then(game => {
        this.setState({
          pageHeader: gameId,
          currentGameId: gameId,
          data: {
            ...this.state.games,
            [game.gameId]: game
          }
        });
      })
      .catch(fetchGameError => console.log('App 115 fetchGameError: ', fetchGameError))
    });
  }

  fetchGamesList = () => {
    pushState(
      {currentGameId: null},
      '/'
    );

    this.getUserSession(userSession => {
      api.fetchGamesList(userSession)
      .then(games => {
        this.setState({
          currentGameId: null,
          data: {
            ...this.state.games,
            games
          }
        });
      })
    });
  }

  fetchGameWeekGames = (year, gameWeek) => {
    console.log('year: ', year)
    pushState(
      {
        currentGameId: null,
        gameWeek: gameWeek,
        year: year
      },
      `/games/${year}/${gameWeek}`
    );
    this.getUserSession(userSession => {
      api.fetchGameWeekGames(year, gameWeek, userSession).then((games) => {
        this.setState({
          year: year,
          gameWeek: gameWeek,
          currentGameId: null,
          data: games,
          games: games
        });
      });
    })
  }

  currentGame() {
    return this.state.games[this.state.currentGameId];
  }
  pageHeader() {
    //console.log('this.state: ', this.state);
    if (this.state.currentGameId) {
      return this.currentGame().awayTeam.shortName + ' vs. ' + this.currentGame().homeTeam.shortName;
    }
    return `Week ${this.state.gameWeek} Games`;
  }
  currentContent() {
    if (this.state.currentGameId) {
      return <Game 
      gamesListClick={this.fetchGamesList}
      {...this.currentGame()} />;
    }
    //console.log('this.state.games: ', this.state.games);
    return (
      <div>
        <select onChange={this.onYearChange} id="year" name="year">
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
        </select>
      <Weeks
      onGameWeekClick={this.fetchGameWeekGames}
      weeks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]} />
      <GamesList onGameClick={this.fetchGame}
      games={this.state.games} /></div>
    );
  }
  render() {
    console.log('252 rendering')
    return (
      <div className="App">
        <Navigation user={this.state.user} sport={this.state.sport} />
        <Header message={this.pageHeader()} />
        
        {(this.state.authState === 'signedIn') ? (
          <div>
            {this.state.user.attributes.preferred_username}
            <button onClick={this.signOut}>Logout</button>
          </div>
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
