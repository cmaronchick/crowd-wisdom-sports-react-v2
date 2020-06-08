import React from 'react';
import { Button } from 'antd'
import LoginButton from '../profile/LoginButton';

const JoinGroupButton = ({authenticated, isOwner, memberOf, joinGroupClick, leaveGroupClick, btnClassName}) => {
    return memberOf ? (
            <Button type="primary" className={btnClassName} disabled={isOwner} onClick={leaveGroupClick}>Leave Group</Button>
        ) : authenticated ? (
            <Button type="primary" className={btnClassName} onClick={joinGroupClick}>Join Group</Button>
        ) : (
            <LoginButton btnClassName={btnClassName} />
        )
}

export default JoinGroupButton