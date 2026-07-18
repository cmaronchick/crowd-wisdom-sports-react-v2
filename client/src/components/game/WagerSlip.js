import React, { useState, useEffect } from 'react';

const WagerSlip = ({ gameId = null, weekId = null }) => {
  const [wagers, setWagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWagers = async () => {
      try {
        setLoading(true);
        let url = '/api/wagers';
        
        if (gameId) {
          url += `?gameId=${gameId}`;
        } else if (weekId) {
          url += `?weekId=${weekId}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch wagers');
        }
        
        const data = await response.json();
        setWagers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setWagers([]);
      } finally {
        setLoading(false);
      }
    };

    if (gameId || weekId) {
      fetchWagers();
    }
  }, [gameId, weekId]);

  if (loading) {
    return <div className="wager-slip loading">Loading wagers...</div>;
  }

  if (error) {
    return <div className="wager-slip error">Error: {error}</div>;
  }

  return (
    <div className="wager-slip">
      <h2>{gameId ? 'Game Wagers' : 'Week Wagers'}</h2>
      {wagers.length === 0 ? (
        <p className="no-wagers">No wagers found</p>
      ) : (
        <div className="wagers-list">
          {wagers.map((wager) => (
            <div key={wager.id} className="wager-item">
              <div className="wager-header">
                <span className="game-info">{wager.gameInfo}</span>
                <span className="wager-amount">${wager.amount}</span>
              </div>
              <div className="wager-details">
                <p><strong>Pick:</strong> {wager.pick}</p>
                <p><strong>Line:</strong> {wager.line}</p>
                <p><strong>Status:</strong> <span className={`status ${wager.status}`}>{wager.status}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WagerSlip;
