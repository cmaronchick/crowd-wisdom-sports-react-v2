import React from 'react'
import PropTypes from 'prop-types'

import { Popconfirm, Button, Typography } from 'antd'

const { Text } = Typography

const LeaveGroupModal = ({groupName, handleLeaveGroupConfirm}) => {
    return (
        <Popconfirm
          placement="topRight"
          title={`Leave ${groupName}`}
          onConfirm={handleLeaveGroupConfirm}
          okText="Confirm"
          okType="danger"
          cancelText="Cancel"
        >
          <Text type="warning">Are you sure you want to leave {groupName}?</Text>
        </Popconfirm>
    )
}

LeaveGroupModal.propTypes = {
    groupName: PropTypes.string.isRequired,
    leaveGroupModalState: PropTypes.bool.isRequired
}

export default LeaveGroupModal
