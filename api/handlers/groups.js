const ky = require('ky-universal');
const apiHost = ky.create({prefixUrl: `https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/`})
const { callOptions } = require('../utils')

const getGroups = (req, res) => {
    console.log('api index 129 req', {query: req.query})
    const { sport, year } = req.params; 
    const { season } = req.query
      const callOptionsObject = callOptions(req.headers.authorization);
      const anonString = callOptionsObject.anonString;
      const getOptions = callOptionsObject.callOptions;
        return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${year}${anonString}${season ? `?season=${season}` : ''}`, getOptions).json()
        .then((groupsResponse) => {
          console.log('groupsResponse', groupsResponse)
          groupsResponse = groupsResponse.sort((a,b) => a.results && b.results ? a.results[sport][year][season].predictionScore - b.results[sport][year][season].predictionScore : a.results && !b.results ? 1 : !a.results && b.results ? -1 : 0)
          const groupsResponseObjs = groupsResponse.reduce((obj, group) => {
            obj[group.groupId] = group;
            return obj;
          }, {});
          res.send({ groups: groupsResponse })
        })
        .catch(crowdsResponseError => console.log('api leaderboard index 139 leaderboardResponseError: ', crowdsResponseError))
}

const getGroup = (req, res) => {
    const { sport, year, groupId } = req.params;
    const { season } = req.query
      const callOptionsObject = callOptions(req.headers.authorization);
      console.log('callOptionsObject', callOptionsObject)
      const anonString = callOptionsObject.anonString;
      const getOptions = callOptionsObject.callOptions;
      console.log('getOptions', getOptions)
        return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${parseInt(year)}/${parseInt(groupId)}${anonString}${season ? `?season=${season}` : ''}`, getOptions)
        .then((groupResponse) => {
          console.log('groupResponse 225', groupResponse)
          return groupResponse.json()
        })
        .then(groupResponse => {
         console.log('api/index 119 gameWeekResponse', groupResponse)
          return res.status(200).json({ group: groupResponse })
        })
        .catch(groupResponseError => {
          console.log('api leaderboard index 153 crowdResponseError: ', groupResponseError)
          return res.status(500).json({ message: groupResponseError})
        })
}

const joinGroup = (req, res) => {
    console.log('api index 217 req', {params: req.params})
    const { sport, year, groupId } = req.params;
    const { season } = req.query
    if (!req.headers.authorization) {
      return res.status(403).json({ message: 'Please log in again.'})
    }
      const callOptionsObject = callOptions(req.headers.authorization);
        return ky.post(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${parseInt(year)}/${parseInt(groupId)}`, {
          headers: {
            Authorization: req.headers.authorization
          }
        })
        .then((groupResponse) => {
          console.log('groupResponse 225', groupResponse)
          return groupResponse.json()
        })
        .then(groupResponse => {
         console.log('api/index 119 gameWeekResponse', groupResponse)
          return res.status(200).json({ group: groupResponse })
        })
        .catch(groupResponseError => {
          console.log('api leaderboard index 153 crowdResponseError: ', groupResponseError)
          return res.status(500).json({ message: groupResponseError})
        })
  }

const leaveGroup = (req, res) => {
    console.log('api index 217 req', {params: req.params})
    const { sport, year, groupId } = req.params;
    const { season } = req.query
    const callOptionsObject = callOptions(req.headers.authorization);
    const getOptions = callOptionsObject.callOptions;
    
    return ky.post(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${parseInt(year)}/${parseInt(groupId)}/leavegroup`, getOptions)
    .then((groupResponse) => {
        console.log('leve groupResponse 225', groupResponse)
        return groupResponse.json()
    })
    .then(groupResponse => {
        console.log('api/index 119 gameWeekResponse', groupResponse)
        return res.status(200).json({ group: groupResponse })
    })
    .catch(groupResponseError => {
        console.log('api leaderboard index 153 crowdResponseError: ', groupResponseError)
        return res.status(500).json({ message: groupResponseError})
    })
}

module.exports = { getGroups, getGroup, joinGroup, leaveGroup}