import React from 'react';
import Header from './Header';
import GamePreview from './GamePreview';
import games from '../games-week3';

class App extends React.Component {
  state = {
    pageHeader: 'Naming Contests',
    games: []
  };
  componentDidMount() {
    // timers, listeners
    this.setState({
      games: games.games
    });
  }
  componentWillUnmount() {
    // clean timers, listeners
  }
  render() {
    return (
      <div className="App">
        <Header message={this.state.pageHeader} />
        <div>
          {this.state.games.map(game => 
          <GamePreview key={game.gameId} {...game} />
          )}
        </div>
      </div>
    );
  }
}

// App.propTypes = {
// };

export default App;
