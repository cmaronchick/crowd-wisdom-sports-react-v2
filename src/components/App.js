import React from 'react';
import Header from './Header';
import GamesList from './GamesList';
import Game from './Game';
import Weeks from './Weeks';
import * as api from '../api';

const pushState = (obj, url) =>
  window.history.pushState(obj, '', url);

const onPopState = handler => {
  window.onpopstate = handler;
};

class App extends React.Component {
  static propTypes = {
    initialData: React.PropTypes.object.isRequired
  }
  state = this.props.initialData;
  componentDidMount() {
    // timers, listeners
    onPopState((event) => {
      this.setState({
        currentGameId: (event.state || {}).currentGameId
      });
    });
  }
  componentWillUnmount() {
    // clean timers, listeners
    onPopState(null);
  }
  fetchGame = (gameId) => {
    pushState(
      { currentGameId: gameId },
      `/games/${gameId}`
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

  fetchGameWeek = (gameWeek) => {
    pushState(
      {gameWeek: gameWeek}
    );
    api.fetchGameWeek().then((gameWeek, games) => {
      this.setState({
        gameWeek: gameWeek,
        currentGameId: null,
        data: {
          ...this.state.games,
          games
        }
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
    //console.log('this.state.games: ', this.state.games);
    return <div><Weeks
    onGameWeekClick={this.fetchGameWeek}
    weeks={[1,2,3]} /><GamesList onGameClick={this.fetchGame}
    games={this.state.games} /></div>;
  }
  render() {
    return (
      <div className="App">
        <Header message={this.pageHeader()} />
        {this.currentContent()}
      </div>
    );
  }
}

App.propTypes = {
  initialGames: React.PropTypes.object
};

export default App;
