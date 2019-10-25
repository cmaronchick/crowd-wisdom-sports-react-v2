import React from 'react';
import { Link } from 'react-router-dom'
import JoinCrowdButton from './Crowd.JoinCrowdButton'

const Crowds = ({crowds, onCrowdClick}) => {

    return (
        crowds && Object.keys(crowds).length > 1 ? (
            <div>
                <h1>Stakehouse Sports Crowds</h1>
                <ul>
                {Object.keys(crowds).map(crowdKey => {
                    const { sport, year, groupId, groupName } = crowds[crowdKey]
                    return (
                        <li key={groupId.toString()}>
                            <Link onClick={onCrowdClick} to={`/${sport}/crowds/${year}/${groupId}`}>
                                {groupName}
                            </Link>
                        </li>
                    )
                })}
                </ul>
                <JoinCrowdButton />
            </div>
        ) : (
            <div>
                <h1>No Crowds Available</h1>
            </div>
        )
    );
};

Crowds.propTypes = {

};

export default Crowds;
