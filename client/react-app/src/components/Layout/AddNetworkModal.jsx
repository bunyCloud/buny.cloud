import { IconButton, Center } from "@chakra-ui/react";
import { Modal } from "antd";
import React, { useRef, useState } from "react";
import AddNetwork from "components/Metamask/AddNetwork";
import { SetOutline } from "antd-mobile-icons";

const AddNetworkModal = () => {
  const [open, setOpen] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = (e) => {
    console.log(e);
    setOpen(false);
  };

  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
  };

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();

    if (!targetRect) {
      return;
    }

    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <>
      <IconButton
        style={{ border: "0px solid white" }}
        aria-label="Network Settings"
        onClick={showModal}
        icon={<SetOutline />}
      />
      <Modal
        footer={null}
        headerStyle={{ backgroundColor: "white", color: "black" }}
        bodyStyle={{ padding: "5px", backgroundColor: "black", color: "black" }}
        style={{
          padding: "5px",
          backgroundColor: "white",
          color: "black",
          border: "4px solid #bbdccb",
          borderRadius: "10px",
          width: "100%",
        }}
        /*     title={
          <div
            style={{
              width: "100%",
              maxWidth:'390px',
              backgroundColor:'black',
              color:'white'
            }}
          >
            Metamask: Avalanche network configuration
          </div>
        }
      */
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <AddNetwork />
      </Modal>
    </>
  );
};

export default AddNetworkModal;
