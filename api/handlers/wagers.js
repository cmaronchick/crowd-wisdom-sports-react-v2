const ky = require('ky-universal');
const { callOptions } = require('../utils');

const getCurrentLines = (req, res) => {
    const { sport, year, season, gameWeek, gameId } = req.params;
    console.log('getCurrentLines', sport, year, season, gameWeek, gameId)
    const { awayTeamId, homeTeamId } = req.query;
    const callOptionsObject = callOptions(req.headers.authorization);
    const getOptions = callOptionsObject.callOptions;
    
    const url = `https://3tsywitgn8.execute-api.us-west-2.amazonaws.com/dev/${sport}/${year}/${season}/${gameWeek}/games/${gameId}/currentlines?awayTeamId=${awayTeamId || ''}&homeTeamId=${homeTeamId || ''}`;
    
    return ky.get(url, getOptions)
    .then((response) => {
        console.log('getCurrentLines response status:', response);
        return response.json();
    })
    .then(data => res.status(200).json(data))
    .catch(err => {
        console.error('getCurrentLinesError:', err);
        const status = err.response?.status || 500;
        if (err.response) {
            return err.response.text()
                .then((body) => {
                    try {
                        return res.status(status).json(JSON.parse(body));
                    } catch (parseError) {
                        return res.status(status).json({ message: body || err.message || err });
                    }
                })
                .catch(() => res.status(status).json({ message: err.message || err }));
        }
        return res.status(status).json({ message: err.message || err });
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
        const status = err.response?.status || 500;
        if (err.response) {
            return err.response.text()
                .then((body) => {
                    try {
                        return res.status(status).json(JSON.parse(body));
                    } catch (parseError) {
                        return res.status(status).json({ message: body || err.message || err });
                    }
                })
                .catch(() => res.status(status).json({ message: err.message || err }));
        }
        return res.status(status).json({ message: err.message || err });
    });
}

const getWagers = (req, res) => {
    const callOptionsObject = callOptions(req.headers.authorization);
    const getOptions = callOptionsObject.callOptions;
    const queryStr = new URLSearchParams(req.query).toString();
    console.log('queryStr: ', queryStr);
    // console.log(`https://3tsywitgn8.execute-api.us-west-2.amazonaws.com/dev/predictions/wager${queryStr && queryStr !== '' ? `?${queryStr}` : ''}`);
    //             https://3tsywitgn8.execute-api.us-west-2.amazonaws.com/dev/predictions/wager
    return ky.get(`https://3tsywitgn8.execute-api.us-west-2.amazonaws.com/dev/predictions/wager${queryStr && queryStr !== '' ? `?${queryStr}` : ''}`, getOptions)
    .then(response => response.json())
    .then(data => res.status(200).json(data))
    .catch(err => {
        console.error('getWagersError:', err);
        const status = err.response?.status || 500;
        if (err.response) {
            return err.response.text()
                .then((body) => {
                    try {
                        return res.status(status).json(JSON.parse(body));
                    } catch (parseError) {
                        return res.status(status).json({ message: body || err.message || err });
                    }
                })
                .catch(() => res.status(status).json({ message: err.message || err }));
        }
        return res.status(status).json({ message: err.message || err });
    });
}

const getSportsbooks = (req, res) => {
    const callOptionsObject = callOptions(req.headers.authorization);
    const getOptions = callOptionsObject.callOptions;
    
    return ky.get(`https://3tsywitgn8.execute-api.us-west-2.amazonaws.com/dev/predictions/wager/sportsbooks`, getOptions)
    .then(response => {
        console.log('getSportsbooks response status:', response);
        return response.json();
    })
    .then(data => res.status(200).json(data))
    .catch(err => {
        console.error('getSportsbooksError:', err);
        const status = err.response?.status || 500;
        if (err.response) {
            return err.response.text()
                .then((body) => {
                    try {
                        return res.status(status).json(JSON.parse(body));
                    } catch (parseError) {
                        return res.status(status).json({ message: body || err.message || err });
                    }
                })
                .catch(() => res.status(status).json({ message: err.message || err }));
        }
        return res.status(status).json({ message: err.message || err });
    });
}

module.exports = { getCurrentLines, submitWager, getWagers, getSportsbooks };
