import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'

import { Typography } from 'antd'


const { Title } = Typography

const HeaderTitle = ({game}) => {
  return (
    <span>
    {game.awayTeam.rank ? `#${game.awayTeam.rank} ` : ''}
    {window.innerWidth > 799 ? game.awayTeam.fullName : game.awayTeam.code} vs. {game.homeTeam.rank ? `#${game.homeTeam.rank} ` : ''}{window.innerWidth > 799 ? game.homeTeam.fullName : game.homeTeam.code}
    </span>
  )
}

const GamePreviewHeader = (props) => {
    const { game } = props
    const { sport, year, season, gameWeek } = game
    const handleGamesListClick = () => {
      props.onClick(sport, year, season, gameWeek)
    }

    return window.location.pathname.indexOf('/game/') === -1 ? (
      <div className="game-header-div">
        <Link to={`/${game.sport}/games/${game.year}/${game.season}/${game.gameWeek}/game/${game.gameId}`} onClick={() => props.onClick()}>
          <Title level={4} className="game-header">
          {game.bowlName && (
            <div className="bowlName">
            {game.bowlName}
            </div>
            )}
          
          <HeaderTitle game={game} />
          <ArrowRightOutlined />
          </Title>
        </Link>
        </div>
      ) : (
        <div className="game-header-div">
          <Link
              className="home-link link"
              onClick={handleGamesListClick}
              to={`/${sport}/games/${year}/${season}/${gameWeek}`}>
              {/* <i className="fas fa-arrow-left" style={{fontSize: '1.2em', fontWeight: 'bold' }}></i> */}
              <ArrowLeftOutlined className="left-arrow" title="Go Back" />
            </Link>
        <Title level={4} className="game-header">
        {game.bowlName && (
          <div className="bowlName">
          {game.bowlName}
          </div>
          )}

            
          <HeaderTitle game={game} />
        </Title>
        </div>
      )
}

GamePreviewHeader.propTypes = {
    game: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}

export default GamePreviewHeader