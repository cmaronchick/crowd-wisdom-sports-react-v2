import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './MatchupTicker.less';

const MatchupTicker = ({ games, activeGameId, onMatchupClick }) => {
    const tickerRef = useRef(null);
    const itemRefs = useRef({});

    // Sort games by date/status logic similar to GamesList to match order
    // Assuming games prop is already an array of game objects or we sort here.
    // Ideally, receive sorted array. Let's assume we pass the sorted list.

    useEffect(() => {
        // Scroll the active item into view within the ticker
        if (activeGameId && itemRefs.current[activeGameId] && tickerRef.current) {
            const item = itemRefs.current[activeGameId];
            const container = tickerRef.current;

            const itemLeft = item.offsetLeft;
            const itemWidth = item.offsetWidth;
            const containerWidth = container.offsetWidth;

            // Center the active item
            const scrollPos = itemLeft - (containerWidth / 2) + (itemWidth / 2);

            container.scrollTo({
                left: scrollPos,
                behavior: 'smooth'
            });
        }
    }, [activeGameId]);

    return (
        <div className="matchup-ticker-container">
            <div className="matchup-ticker" ref={tickerRef}>
                {games.map(game => (
                    <div
                        key={game.gameId}
                        ref={el => itemRefs.current[game.gameId] = el}
                        className={`ticker-item ${String(activeGameId) === String(game.gameId) ? 'active' : ''}`}

                        onClick={() => onMatchupClick(game.gameId)}
                    >
                        <span className="ticker-team">{game.awayTeam.code}</span>
                        <span className="ticker-cnct">@</span>
                        <span className="ticker-team">{game.homeTeam.code}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

MatchupTicker.propTypes = {
    games: PropTypes.array.isRequired,
    activeGameId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onMatchupClick: PropTypes.func.isRequired
};

export default MatchupTicker;
