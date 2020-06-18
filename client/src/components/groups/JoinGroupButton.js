import React from 'react';
import { Popconfirm, Button, Typography } from 'antd'
import LoginButton from '../profile/LoginButton';


const { Text } = Typography

const JoinGroupButton = ({authenticated, isOwner, memberOf, handleJoinGroupClick, handleLeaveGroupConfirm, joiningGroup, groupName, btnClassName}) => {
    return memberOf ? (

            <Popconfirm
            placement="topRight"
            title={`Are you sure you want to leave ${groupName}?`}
            onConfirm={handleLeaveGroupConfirm}
            okText="Confirm"
            okType="danger"
            cancelText="Cancel"
            >
                <Button type="primary">{window.innerWidth >= 960 ? `Leave Group` : `Leave`}</Button>
            </Popconfirm>
            // <Button type="primary" className={btnClassName} disabled={isOwner} onClick={leaveGroupClick}>Leave Group</Button>
        ) : authenticated ? (
            <Button loading={joiningGroup} type="primary" className={btnClassName} onClick={handleJoinGroupClick}>Join Group</Button>
        ) : (
            <LoginButton btnClassName={btnClassName} />
        )
}

export default JoinGroupButton