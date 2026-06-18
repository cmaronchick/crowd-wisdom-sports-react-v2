const ky = require('ky-universal');
const { callOptions } = require('../utils');

const getCurrentLines = (req, res) => {
    const { sport, year, season, gameWeek, gameId } = req.params;
    const { awayTeamId, homeTeamId } = req.query;
    const callOptionsObject = callOptions(req.headers.authorization);
    const getOptions = callOptionsObject.callOptions;
    
    const url = `https://3tsywitgn8.execute-api.us-west-2.amazonaws.com/dev/${sport}/${year}/${season}/${gameWeek}/games/${gameId}/currentlines?awayTeamId=${awayTeamId || ''}&homeTeamId=${homeTeamId || ''}`;
    
    return ky.get(url, getOptions)
    .then((response) => response.json())
    .then(data => res.status(200).json(data))
    .catch(err => {
        console.error('getCurrentLinesError:', err);
        return res.status(500).json({ message: err.message || err });
    });
}

const submitWager = (req, res) => {
    return ky.post(`https://3tsywitgn8.execute-api.us-west-2.amazonaws.com/dev/predictions/wager`, {
        headers: {
            Authorization: req.headers.authorization,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(req.body)
    })
    .then(response => response.json())
    .then(data => res.status(200).json(data))
    .catch(err => {
        console.error('submitWagerError:', err);
        return res.status(500).json({ message: err.message || err });
    });
}

const getWagers = (req, res) => {
    const callOptionsObject = callOptions(req.headers.authorization);
    const getOptions = callOptionsObject.callOptions;
    const queryStr = new URLSearchParams(req.query).toString();
    
    return ky.get(`https://3tsywitgn8.execute-api.us-west-2.amazonaws.com/dev/predictions/wager?${queryStr}`, getOptions)
    .then(response => response.json())
    .then(data => res.status(200).json(data))
    .catch(err => {
        console.error('getWagersError:', err);
        return res.status(500).json({ message: err.message || err });
    });
}

module.exports = { getCurrentLines, submitWager, getWagers };
