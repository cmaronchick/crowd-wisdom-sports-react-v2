import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {fetchUserWagers} from '../../redux/actions/predictionsActions'
import dayjs from 'dayjs';
import { spreadPredictionWager, totalPredictionWager } from '../../functions/utils';
import SummaryCard from './WagerSlipSummaryCard';
import './WagerSlip.less';

const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  return `${amount < 0 ? '-' : ''}$${Math.abs(amount).toFixed(2)}`;
};

const formatPercent = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

const wagerBet = (wagerObj, game) => {
  if (!wagerObj || !game) return null;
  const { wager, prediction } = wagerObj;
  const { wagerType, spreadTotal, odds } = wager || {};
  if (wagerType === 'spread') {
    return spreadPredictionWager(game, prediction, wagerObj)
  }
  if (wagerType === 'total') {
    return totalPredictionWager(game, prediction, wagerObj)
  }
  if (wagerType === 'moneyline') {
    if (prediction.awayTeam.score > prediction.homeTeam.score) {
      return `${prediction.awayTeam.code} ML`;
    }
    if (prediction.homeTeam.score > prediction.awayTeam.score) {
      return `${prediction.homeTeam.code} ML`;
    }
    return 'TIE';
  }
  return null;
}

const StatPill = ({ value, muted }) => {
  return (
    <span
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '12px',
        color: muted ? '#8b95a8' : '#e2e8f0',
        letterSpacing: '0.02em',
      }}
    >
      {value}
    </span>
  )
}

const getWagerStatus = (wager) => {
  if (wager?.result === null || wager?.result === undefined || wager?.result === '') {
    return 'OPEN';
  }

  const result = Number(wager.result);

  if (result === 1) {
    return 'WIN';
  }
  if (result === -1) {
    return 'LOSS';
  }
  if (result === 0) {
    return 'PUSH';
  }

  return 'OPEN';
};

const getUniqueValues = (values) => {
  return Array.from(new Set(values.filter((value) => value !== undefined && value !== null && value !== '')));
};

const getFilterOptions = ({ wagers, sportName, historyYear, historySeason }) => {
  const sportWagers = wagers.filter((wager) => {
    if (sportName && wager.sport && wager.sport !== sportName) {
      return false;
    }

    return true;
  });

  const yearOptions = getUniqueValues(sportWagers.map((wager) => String(wager.year))).sort((a, b) => Number(b) - Number(a));
  const seasonSource = sportWagers.filter((wager) => historyYear === 'all' || String(wager.year) === String(historyYear));
  const seasonOptions = getUniqueValues(seasonSource.map((wager) => wager.season));
  const weekSource = seasonSource.filter((wager) => historySeason === 'all' || wager.season === historySeason);
  const weekOptions = getUniqueValues(weekSource.map((wager) => String(wager.gameWeek))).sort((a, b) => Number(a) - Number(b));

  return {
    yearOptions,
    seasonOptions,
    weekOptions,
  };
};

const filterWagers = ({ wagers, sportName, gameId, weekId, historyYear, historySeason, historyWeek, historyType, historyStatus, showFilters }) => {
  return wagers.filter((wager) => {
    if (sportName && wager.sport && wager.sport !== sportName) {
      return false;
    }

    if (gameId) {
      return wager.gameId === gameId;
    }

    if (weekId && `${wager.gameWeek}` !== `${weekId}`) {
      return false;
    }

    if (!showFilters) {
      return true;
    }

    if (historyYear && historyYear !== 'all' && `${wager.year}` !== `${historyYear}`) {
      return false;
    }

    if (historySeason && historySeason !== 'all' && wager.season !== historySeason) {
      return false;
    }

    if (historyType && historyType !== 'ALL' && wager.wager?.wagerType?.toUpperCase() !== historyType) {
      return false;
    }

    if (historyStatus && historyStatus !== 'ALL' && getWagerStatus(wager) !== historyStatus) {
      return false;
    }

    if (historyWeek && historyWeek !== 'all' && `${wager.gameWeek}` !== `${historyWeek.week}`) {
      return false;
    }

    return true;
  });
};

const formatSeasonLabel = (seasonValue) => {
  if (!seasonValue) {
    return '';
  }

  const seasonLabels = {
    pre: 'Pre',
    reg: 'Regular',
    post: 'Post',
  };

  return seasonLabels[seasonValue] || seasonValue.toUpperCase();
};

const buildWagerSummary = (wagers) => {
  const totalRisk = wagers.reduce((acc, wager) => acc + (Number(wager?.wager?.currency) || 0), 0);
  const gradedWagers = wagers.filter((wager) => {
    if (getWagerStatus(wager) === 'OPEN') {
      return false;
    }

    const result = Number(wager?.result);
    return result === 1 || result === -1 || result === 0;
  });

  const wagerSummary = gradedWagers.reduce((acc, wager) => {
    const result = Number(wager?.result);
    const risk = Number(wager?.wager?.currency) || 0;
    const net = Number(wager?.net);

    if (result === 1) {
      acc.wins += 1;
    } else if (result === -1) {
      acc.losses += 1;
    } else if (result === 0) {
      acc.pushes += 1;
    }

    if (Number.isFinite(net)) {
      acc.netProfit += (net - risk);
    } else if (result === -1) {
      acc.netProfit -= risk;
    }

    return acc;
  }, {
    wins: 0,
    losses: 0,
    pushes: 0,
    totalRisk,
    netProfit: 0,
  });

  const roi = wagerSummary.totalRisk > 0
    ? (wagerSummary.netProfit / wagerSummary.totalRisk) * 100
    : 0;

  return {
    gradedWagers,
    wagerSummary,
    roi,
  };
};

const WagerSlipSummary = ({ wagerSummary, gradedWagers, visibleWagers, roi }) => {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <SummaryCard
        label="Record"
        value={`${wagerSummary.wins}-${wagerSummary.losses}-${wagerSummary.pushes}`}
        sub={`${gradedWagers.length} graded wagers`}
      />
      <SummaryCard
        label="Net Profit"
        value={formatCurrency(wagerSummary.netProfit)}
        sub={`Risk ${formatCurrency(wagerSummary.totalRisk)}`}
        accent={wagerSummary.netProfit >= 0 ? '#16c784' : '#ea3943'}
      />
      <SummaryCard
        label="ROI"
        value={formatPercent(roi)}
        sub="net profit / total risk"
        accent={roi >= 0 ? '#16c784' : '#ea3943'}
      />
      <SummaryCard
        label="Visible Wagers"
        value={String(visibleWagers.length)}
        sub={`${visibleWagers.length - gradedWagers.length} open`}
      />
    </div>
  );
};

const WagerSlipFilters = ({ yearOptions, seasonOptions, weekOptions, historyYear, historySeason, historyWeek, historyType, historyStatus, setHistoryYear, setHistorySeason, setHistoryWeek, setHistoryType, setHistoryStatus }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#6b7a94',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
          Year
        </span>
        {['all', ...yearOptions].map((yearValue) => (
          <button
            key={`year-${yearValue}`}
            onClick={() => setHistoryYear(yearValue)}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border:
                historyYear === yearValue ? '1px solid #16c784' : '1px solid #1e2330',
              background:
                historyYear === yearValue ? 'rgba(22,199,132,0.12)' : 'transparent',
              color: historyYear === yearValue ? '#16c784' : '#8b95a8',
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {yearValue === 'all' ? 'All' : yearValue}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#6b7a94',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
          Season
        </span>
        {['all', ...seasonOptions].map((seasonValue) => (
          <button
            key={`season-${seasonValue}`}
            onClick={() => setHistorySeason(seasonValue)}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border:
                historySeason === seasonValue ? '1px solid #16c784' : '1px solid #1e2330',
              background:
                historySeason === seasonValue ? 'rgba(22,199,132,0.12)' : 'transparent',
              color: historySeason === seasonValue ? '#16c784' : '#8b95a8',
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {seasonValue === 'all' ? 'All' : formatSeasonLabel(seasonValue)}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#6b7a94',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
          Week
        </span>
        {['all', ...weekOptions].map((weekValue) => (
          <button
            key={`week-${weekValue}`}
            onClick={() => setHistoryWeek(weekValue)}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border:
                historyWeek === weekValue ? '1px solid #16c784' : '1px solid #1e2330',
              background:
                historyWeek === weekValue ? 'rgba(22,199,132,0.12)' : 'transparent',
              color: historyWeek === weekValue ? '#16c784' : '#8b95a8',
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {weekValue === 'all' ? 'All' : `WK ${weekValue}`}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#6b7a94',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
          Type
        </span>
        {['ALL', 'MONEYLINE', 'SPREAD', 'TOTAL'].map((filterValue) => (
          <button
            key={filterValue}
            onClick={() => setHistoryType(filterValue)}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border:
                historyType === filterValue ? '1px solid #16c784' : '1px solid #1e2330',
              background:
                historyType === filterValue ? 'rgba(22,199,132,0.12)' : 'transparent',
              color: historyType === filterValue ? '#16c784' : '#8b95a8',
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {filterValue === 'ALL' ? 'All' : filterValue}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#6b7a94',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
          Status
        </span>
        {['ALL', 'OPEN', 'WIN', 'LOSS', 'PUSH'].map((statusValue) => (
          <button
            key={statusValue}
            onClick={() => setHistoryStatus(statusValue)}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border:
                historyStatus === statusValue ? '1px solid #16c784' : '1px solid #1e2330',
              background:
                historyStatus === statusValue ? 'rgba(22,199,132,0.12)' : 'transparent',
              color: historyStatus === statusValue ? '#16c784' : '#8b95a8',
              fontFamily: "'DM Mono', monospace",
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {statusValue === 'ALL' ? 'All' : statusValue}
          </button>
        ))}
      </div>
    </>
  );
};

const WagerSlipList = ({ wagers, gamesData }) => {
  const [hovered, setHovered] = useState(null);

  if (wagers.length === 0) {
    return <p className="no-wagers" style={{ color: '#5a6478' }}>No wagers found</p>;
  }

  return (
    <div
      className="wager-list"
      style={{
        border: '1px solid #1a1e2a',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '64px minmax(100px,1fr) 80px 70px 60px 64px 72px',
          gap: '0 12px',
          padding: '10px 20px',
          borderBottom: '1px solid #1a1e2a',
          background: '#0a0c10',
        }}
      >
        {['DATE', 'GAME / BET', 'ODDS', 'RISK', 'RESULT', 'NET', ''].map((col, i) => (
          <div
            key={col + i}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '10px',
              color: '#5a6478',
              letterSpacing: '0.1em',
              textAlign: i > 1 ? 'right' : 'left',
              borderLeft: i === 0 ? '4px solid #1a1e2a' : 'none',
            }}
          >
            {col}
          </div>
        ))}
      </div>
      {wagers.map((wager, index) => {
        const rs = resultStyles[wager.result];
        const typeColor = betTypeStyles[wager.wager?.wagerType] || defaultBetTypeStyle;
        const netValue = Number(wager?.net);
        const riskValue = Number(wager?.wager?.currency) || 0;
        const profitValue = Number.isFinite(netValue)
          ? formatCurrency(netValue - riskValue)
          : '-';
        const wagerStatus = getWagerStatus(wager);

        return wager.wager ? (
          <div
            key={wager._id}
            className={`wager-item ${rs}`}
            style={{
              borderLeft: `4px solid ${typeColor.backgroundColor || '#000'}`,
              display: 'grid',
              gridTemplateColumns: '64px minmax(100px,1fr) 80px 70px 60px 64px 72px',
              alignItems: 'center',
              gap: '0 12px',
              padding: '13px 20px',
              backgroundColor: hovered === index ? 'rgba(255,255,255,0.025)' : 'transparent',
              borderBottom: '1px solid #111827',
              transition: 'background 0.12s',
            }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '11px',
                  color: '#8b95a8',
                }}
              >
                {dayjs(wager.submitted).format('MM/DD')}
              </div>

              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '11px',
                  color: '#5a6478',
                  marginTop: '1px',
                }}
              >
                Week {wager.gameWeek}
              </div>
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '15px',
                fontWeight: 700,
                color: '#c9d1e0',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'left',
                minWidth: 200,
              }}
            >
              {wager.awayTeam.code} at {wager.homeTeam.code}
              <p className="bet-type"><span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '10px',
                fontWeight: 500,
                color: typeColor.color,
                background: `${typeColor.backgroundColor}18`,
                padding: '1px 5px',
                borderRadius: '3px',
                letterSpacing: '0.06em',
              }}>{wager.wager.wagerType} </span>

                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '12px',
                    color: '#a8b3c4',
                  }}
                >
                  {wagerBet(wager, gamesData[wager.gameId])}
                </span></p>
            </div>

            <div className="wager-details">
              <StatPill value={wager.wager.odds} />
            </div>
            <div className="wager-details">
              <StatPill value={formatCurrency(wager.wager.currency)} />
            </div>
            <div className="wager-details">
              <StatPill value={wagerStatus} muted={false} />
            </div>
            <div className="wager-details">
              <StatPill value={profitValue} muted={false} />
            </div>
            <div></div>
          </div>
        ) : <div key={wager._id || index}></div>;
      })}
    </div>
  );
};

const WagerSlipContent = ({ sport, gamesData, wagers, gameId = null, weekId = null, showFilters = true, title }) => {
  const sportName = sport?.sport || null;
  const [historyYear, setHistoryYear] = useState('all');
  const [historySeason, setHistorySeason] = useState('all');
  const [historyWeek, setHistoryWeek] = useState(weekId ? String(weekId) : 'all');
  const [historyType, setHistoryType] = useState('ALL');
  const [historyStatus, setHistoryStatus] = useState('ALL');

  const { yearOptions, seasonOptions, weekOptions } = getFilterOptions({
    wagers,
    sportName,
    historyYear,
    historySeason,
  });

  useEffect(() => {
    if (!showFilters) {
      return;
    }

    if (weekId) {
      setHistoryWeek(String(weekId));
    }
  }, [showFilters, weekId]);

  useEffect(() => {
    if (historyYear !== 'all' && !yearOptions.includes(String(historyYear))) {
      setHistoryYear('all');
    }
  }, [historyYear, yearOptions]);

  useEffect(() => {
    if (historySeason !== 'all' && !seasonOptions.includes(historySeason)) {
      setHistorySeason('all');
    }
  }, [historySeason, seasonOptions]);

  useEffect(() => {
    if (historyWeek !== 'all' && !weekOptions.includes(String(historyWeek))) {
      setHistoryWeek('all');
    }
  }, [historyWeek, weekOptions]);

  const visibleWagers = filterWagers({
    wagers,
    sportName,
    gameId,
    weekId,
    historyYear,
    historySeason,
    historyWeek,
    historyType,
    historyStatus,
    showFilters,
  });
  const { gradedWagers, wagerSummary, roi } = buildWagerSummary(visibleWagers);

  return (
    <div className="wager-slip" style={{
      backgroundColor: '#0c0e14',
      overflowY: 'auto',
    }}>
      <WagerSlipSummary
        wagerSummary={wagerSummary}
        gradedWagers={gradedWagers}
        visibleWagers={visibleWagers}
        roi={roi}
      />
      <h2 style={{
        color: '#c9d1e0',
        backgroundColor: '#0c0e14',
      }}>{title || (gameId ? 'Game Wagers' : 'Week Wagers')}</h2>

      {showFilters && (
        <WagerSlipFilters
          yearOptions={yearOptions}
          seasonOptions={seasonOptions}
          weekOptions={weekOptions}
          historyYear={historyYear}
          historySeason={historySeason}
          historyWeek={historyWeek}
          historyType={historyType}
          historyStatus={historyStatus}
          setHistoryYear={setHistoryYear}
          setHistorySeason={setHistorySeason}
          setHistoryWeek={setHistoryWeek}
          setHistoryType={setHistoryType}
          setHistoryStatus={setHistoryStatus}
        />
      )}

      <WagerSlipList wagers={visibleWagers} gamesData={gamesData} />
    </div>
  );
};

const BaseWagerSlip = ({ sport, user, games, gameId = null, weekId = null, wagers: initialWagers, fetchUserWagers, showFilters = true, title = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const gamesData = games.games || {};
  const userId = user?.attributes?.preferred_username || user?.username;

  const wagersState = Array.isArray(initialWagers) ? initialWagers : [];
  const hasInitialWagers = wagersState.length > 0;



  useEffect(() => {
    if (hasInitialWagers || !userId) {
      return;
    }

    setLoading(true);
    const fetchData = async () => {
      try {
        await fetchUserWagers({ userId });
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchUserWagers, hasInitialWagers, userId]);
  


  if (loading) {
    return (
    <div className="wager-slip" style={{
            backgroundColor: '#0c0e14',
            color: '#fff',
            flex: 1,
          }}>
            <div className="wager-slip loading">Loading wagers...</div>
    </div>);
  }

  if (error) {
    return (
    <div className="wager-slip" style={{
            backgroundColor: '#0c0e14',
            color: '#f87171',
          }}>
            <div className="wager-slip error">Error: {error}</div>
    </div>);
  }

  return (
    <WagerSlipContent
      sport={sport}
      gamesData={gamesData}
      wagers={wagersState}
      gameId={gameId}
      weekId={weekId}
      showFilters={showFilters}
      title={title}
    />
  );
};

const WagerSlip = (props) => <BaseWagerSlip {...props} showFilters={true} />;

const GameWagerSlipBase = (props) => <BaseWagerSlip {...props} showFilters={false} title="Game Wagers" />;

const mapStateToProps = (state) => ({
  sport: state.sport,
  user: state.user,
  wagers: state.predictions.wagers,
  games: state.games
});

const mapActionToProps = {
  fetchUserWagers
};



const resultStyles = {
  "1": { label: 'WIN', backgroundColor: 'rgba(22,199,132,0.12)', color: '#16c784' },
  "-1": { label: 'LOSS', backgroundColor: 'rgba(234,57,67,0.12)', color: '#ea3943' },
  "0": { label: 'PUSH', backgroundColor: 'rgba(156,163,175,0.12)', color: '#a8b3c4' },
  "open": { label: 'LIVE', backgroundColor: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
}

const betTypeStyles = {
  spread: {
    backgroundColor: '#818cf8',
    color: '#818cf8',
  },
  total: {
    backgroundColor: '#38bdf8',
    color: '#38bdf8',
  },
  moneyline: {
    backgroundColor: '#fb923c',
    color: '#fb923c',
  },
}

const defaultBetTypeStyle = {
  backgroundColor: '#5a6478',
  color: '#a8b3c4',
}

export const GameWagerSlip = connect(mapStateToProps, mapActionToProps)(GameWagerSlipBase);

export { WagerSlipContent };

export default connect(mapStateToProps, mapActionToProps)(WagerSlip);
