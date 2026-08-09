import React from 'react';
import { Modal } from 'antd';
import { GameWagerSlip } from './WagerSlip';

const WagerSlipModal = ({ wagers = [], gameId, isOpen, onClose }) => {
  return (
    <Modal open={isOpen} closable={true} onCancel={onClose} footer={null} width={600}>
      <GameWagerSlip gameId={gameId} wagers={wagers} />
    </Modal>
  );
}

export default WagerSlipModal;
