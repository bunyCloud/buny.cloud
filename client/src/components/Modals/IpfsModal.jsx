import { Button, Modal } from "antd";
import IpfsUploadTabs from "components/Ipfs/IpfsUploadTabs";
import React, { useState } from "react";
const IpfsModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="text" onClick={showModal}>
        IPFS
      </Button>
      <Modal
        title="IPFS"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <IpfsUploadTabs />
      </Modal>
    </>
  );
};
export default IpfsModal;
