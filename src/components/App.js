import React from 'react';
import Header from './Header';
import GamesList from './GamesList';
import Game from './Game';

const pushState = (obj, url) =>
  window.history.pushState(obj, '', url);

class App extends React.Component {
  state = {
    pageHeader: 'Naming Contests',
    games: this.props.initialGames
  };
  componentDidMount() {
    // timers, listeners
  }
  componentWillUnmount() {
    // clean timers, listeners
  }
  fetchGame = (gameId) => {
    pushState(
      {},
      `/game/${gameId}`
    );
    this.setState({
      pageHeader: this.state.games[gameId].awayTeam.code + ' vs. ' + this.state.games[gameId].homeTeam.code,
      currentGameId: gameId
    });
  }
  currentContent() {
    if (this.state.currentGameId) {
      return <Game {...this.state.games[this.state.currentGameId]} />;
    }

    return <GamesList onGameClick={this.fetchGame}
    games={this.state.games} />;
  }
  render() {
    return (
      <div className="App">
        <Header message={this.state.pageHeader} />
        {this.currentContent()}
      </div>
    );
  }
}

App.propTypes = {
  initialGames: React.PropTypes.object
};

export default App;
