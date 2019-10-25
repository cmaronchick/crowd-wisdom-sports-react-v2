import React from 'react';
import { Link } from 'react-router-dom'
import JoinCrowdButton from './Crowd.JoinCrowdButton'
import * as api from '../api'

const Crowd = ({crowd}) => {
    const { groupId, sport, year } = crowd

    return (
        <div>
            <h1>{crowd.groupName}</h1>
            <JoinCrowdButton />
        </div>
    );
};

Crowd.propTypes = {

};

export default Crowd;
