const ky = require('ky-universal');
const apiHost = ky.create({prefixUrl: `https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/`})
const { callOptions } = require('../utils')

const getLeaderboards = (req, res) => {
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
    const { sport, year, season, week } = req.params
    return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/${sport}/${year}/${season}/${week}/leaderboards`, getOptions)
    .then((leaderboardResponse) => {
      //console.log('overallLeaderboardResponse: ', overallLeaderboardResponse.data)
      return leaderboardResponse.json()
    })
    .then(leaderboardResponse => {
      console.log('leaderboardResponse', leaderboardResponse)
      return res.status(200).json({ leaderboards: leaderboardResponse
      })
    })
    .catch(overallLeaderboardReject => {
      console.log('overallLeaderboardReject: ', overallLeaderboardReject);
      return res.status(500).json({ message: 'Something went wrong'});
    })
}

const getCrowdLeaderboards = (req, res) => {
    const { sport, year, season, week } = req.params;
    console.log({ sport, year, season, week });
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
    return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/${sport}/${year}/${season}/${week}/leaderboards/crowdoverall`, getOptions)
    .then((crowdOverallResponse) => {
      // console.log('api/index 134 crowdOverallResponse', crowdOverallResponse)
       res.send({ crowd: crowdOverallResponse.data })
     })
     .catch(crowdOverallResponseError => console.log('api leaderboard index 137 crowdOverallResponse: ', crowdOverallResponseError))
}

module.exports = { getLeaderboards, getCrowdLeaderboards }