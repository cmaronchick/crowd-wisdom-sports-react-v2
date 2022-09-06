const ky = require('ky-universal');
const apiHost = ky.create({prefixUrl: `https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/`})
const { callOptions } = require('../utils')

const getGroups = (req, res) => {
    console.log('api index 129 req', {query: req.query})
    console.log(`req.params`, req.params)
    const { sport, year } = req.params; 
    const { season } = req.query
      const callOptionsObject = callOptions(req.headers.authorization);
      const anonString = callOptionsObject.anonString;
      const getOptions = callOptionsObject.callOptions;

      
      return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${year}${anonString}${season ? `?season=${season}` : ''}`, getOptions)
        .then((groupsResponse) => {
          // console.log(`groupsResponse`, groupsResponse)
          return  groupsResponse.json()
        })
        .then(groupsResponseJSON => {
          // console.log(`groupsResponseJSON`, groupsResponseJSON)
          let noResultsGroups = groupsResponseJSON.filter(group => !(group.results && group.results[sport] && group.results[sport][year] && group.results[sport][year][season] && group.results[sport][year][season].predictionScore))
          let resultsGroups = groupsResponseJSON.filter(group => (group.results && group.results[sport] && group.results[sport][year] && group.results[sport][year][season] && group.results[sport][year][season].predictionScore))
          groupsResponseJSON = resultsGroups.sort((a,b) => {
            a.results[sport][year][season].predictionScore - b.results[sport][year][season].predictionScore
          })
          groupsResponseJSON.push(...noResultsGroups)
          const groupsResponseObjs = groupsResponseJSON.reduce((obj, group) => {
            obj[group.groupId] = group;
            return obj;
          }, {});
          res.send({ groups: groupsResponseJSON })
        })
        .catch(crowdsResponseError => console.log('api leaderboard index 139 leaderboardResponseError: ', crowdsResponseError))
}

const getGroup = (req, res) => {
    const { sport, year, groupId } = req.params;
    const { season, week } = req.query
      const callOptionsObject = callOptions(req.headers.authorization);
      // console.log('callOptionsObject', callOptionsObject)
      const anonString = callOptionsObject.anonString;
      const getOptions = callOptionsObject.callOptions;
      console.log('groupId', groupId, season, week)
      console.log(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${parseInt(year)}/${parseInt(groupId)}${anonString}${season ? `?season=${season}` : ''}${week ? `&week=${week}` : ''}`)
        return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${parseInt(year)}/${parseInt(groupId)}${anonString}${season ? `?season=${season}` : ''}${week ? `&week=${week}` : ''}`, getOptions)
        .then((groupResponse) => {
          console.log('groupResponse 37', groupResponse)
          return groupResponse.json()
        })
        .then(groupResponse => {
         console.log('api/index 41 joinGroupResponse', groupResponse)
          return res.status(200).json({ group: groupResponse })
        })
        .catch(groupResponseError => {
          console.log('api leaderboard index 55 crowdResponseError: ', groupResponseError)
          return res.status(500).json({ message: groupResponseError})
        })
}

const joinGroup = (req, res) => {
    // console.log('api index 51 req', {params: req})
    const { sport, year, groupId } = req.params;
    const { season } = req.query
    console.log('req.body', req.body)
    if (!req.headers.authorization) {
      return res.status(403).json({ message: 'Please log in again.'})
    }
      const callOptionsObject = callOptions(req.headers.authorization);
        return ky.post(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${parseInt(year)}/${parseInt(groupId)}`, {
          headers: {
            Authorization: req.headers.authorization,
            'Content-type': 'application/json'
          },
          body: JSON.stringify(req.body)
        })
        .then((groupResponse) => {
          console.log('groupResponse 64', groupResponse)
          return groupResponse.json()
        })
        .then(groupResponse => {
         console.log('api/index 119 gameWeekResponse', groupResponse)
          return res.status(200).json({ succeeded: groupResponse.succeeded, message: groupResponse.message, group: groupResponse })
        })
        .catch(groupResponseError => {
          console.log('api leaderboard index 85 crowdResponseError: ', groupResponseError)
          return res.status(500).json({ message: groupResponseError})
        })
  }

const leaveGroup = (req, res) => {
    console.log('api index 78 req', {params: req.params})
    const { sport, year, groupId } = req.params;
    const { season } = req.query
    const callOptionsObject = callOptions(req.headers.authorization);
    const getOptions = callOptionsObject.callOptions;
    
    return ky.post(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${parseInt(year)}/${parseInt(groupId)}/leavegroup`, getOptions)
    .then((groupResponse) => {
        console.log('leve groupResponse 86', groupResponse)
        return groupResponse.json()
    })
    .then(groupResponse => {
        console.log('api/index 119 gameWeekResponse', groupResponse)
        return res.status(200).json({ group: groupResponse })
    })
    .catch(groupResponseError => {
        console.log('api leaderboard index 107 crowdResponseError: ', groupResponseError)
        return res.status(500).json({ message: groupResponseError})
    })
}

const createGroup = (req, res) => {
  console.log('api index 100 req', {req})
  const { sport, year, groupId } = req.params;
  console.log('105 req.body', req.body)
  const { groupName, password } = req.body
  const owner = JSON.parse(req.body.owner)
  const groupPublic = req.body.public
  const searchParams = new URLSearchParams()
  searchParams.set('owner', owner)
  searchParams.set('groupName', groupName)
  searchParams.set('public', groupPublic)
  searchParams.set('password', password)
  const callOptionsObject = callOptions(req.headers.authorization);
  let getOptions = callOptionsObject.callOptions;
  getOptions.headers = {
    Authorization: req.headers.authorization,
    'Content-type': 'application/json'
  }
  getOptions.body = JSON.stringify(req.body)
  console.log('109 getOptions', getOptions)
  
  return ky.post(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/create`, getOptions)
  .then((groupResponse) => {
      console.log('create groupResponse 110', groupResponse)
      return groupResponse.json()
  })
  .then(groupResponse => {
      console.log('api/index 119 gameWeekResponse', groupResponse)
      return res.status(200).json({ group: groupResponse })
  })
  .catch(groupResponseError => {
      console.log('api leaderboard index 143 crowdResponseError: ', groupResponseError)
      return res.status(500).json({ message: groupResponseError})
  })
}

const updateGroup = (req, res) => {
  console.log('req.body', req.body)
  const { groupId, groupName, password, picture } = req.body
  const owner = req.body.owner
  const groupPublic = req.body.public
  const searchParams = new URLSearchParams()
  searchParams.set('groupId', groupId)
  searchParams.set('owner', owner)
  searchParams.set('groupName', groupName)
  searchParams.set('public', groupPublic)
  searchParams.set('password', password)
  searchParams.set('picture', picture)
  const callOptionsObject = callOptions(req.headers.authorization);
  let getOptions = callOptionsObject.callOptions;
  getOptions.headers = {
    Authorization: req.headers.authorization,
    'Content-type': 'application/json'
  }
  getOptions.body = JSON.stringify(req.body)
  console.log('157 getOptions', getOptions)
  
  return ky.post(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group`, getOptions)
  .then((groupResponse) => {
      console.log('create groupResponse 162', groupResponse)
      return groupResponse.json()
  })
  .then(groupResponse => {
      console.log('api/index 119 gameWeekResponse', groupResponse)
      return res.status(200).json({ group: groupResponse })
  })
  .catch(groupResponseError => {
      console.log('api leaderboard index 179 crowdResponseError: ', groupResponseError)
      return res.status(500).json({ message: groupResponseError})
  })

}

module.exports = { getGroups, getGroup, joinGroup, leaveGroup, createGroup, updateGroup}