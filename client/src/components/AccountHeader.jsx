import { getEllipsisTxt } from "../helpers/formatters";
import Blockie from "./Blockie";
import { Button, Card, Modal } from "antd";
import { useState } from "react";
import Address from "./Address/Address";
import { SelectOutlined } from "@ant-design/icons";
import { getExplorer } from "../helpers/networks";
import { Center } from "@chakra-ui/react";
const styles = {
  account: {
    height: "20px",
    padding: "0 3px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2px",
    width: "fit-content",
    borderRadius: "2px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
  },
  text: {
    color: "#21BF96",
  },
};

function AccountHeader(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!isLoggedIn === true) {
    return (
      <Button
        onClick={() =>
          authenticate({ signingMessage: "The BUNY Project | Avalanche" })
        }
        style={{
          backgroundColor: "black",
          padding: "1px",
          width: "150px",
        }}
        className="searchButton"
      >
        {" "}
        Connect MetaMask
      </Button>
    );
  }

  return (
    <>
      <div style={styles.account} onClick={() => setIsModalVisible(true)}>
        <p style={{ marginRight: "5px", ...styles.text }}>
          {getEllipsisTxt(account, 6)}
        </p>
        <Blockie currentWallet scale={3} />
      </div>
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        bodyStyle={{
          padding: "10px",
          fontSize: "15px",
          fontWeight: "500",
        }}
        style={{ fontSize: "14px", fontWeight: "500" }}
        width="400px"
      >
        <Card
          style={{
            marginTop: "4px",
            borderRadius: "1rem",
          }}
          bodyStyle={{ padding: "15px" }}
        >
          <Center>
            <Address
              avatar="left"
              size={12}
              copyable
              style={{ fontSize: "12px" }}
            />
          </Center>
          <div style={{ marginTop: "5px", padding: "0 5px" }}>
            <a
              href={`${getExplorer(chainId)}/address/${account}`}
              target="_blank"
              rel="noreferrer"
            >
              <SelectOutlined style={{ marginRight: "5px" }} />
              View on Explorer
            </a>
          </div>
        </Card>

        <Button
          size="large"
          type="primary"
          style={{
            width: "100%",
            marginTop: "10px",
            backgroundColor: "#ffc72c",
            border: "0px solid white",
            color: "black",
            borderRadius: "0.5rem",
            fontSize: "16px",
            fontWeight: "500",
          }}
          onClick={() => {
            logout();
            setIsModalVisible(false);
          }}
        >
          Disconnect Wallet
        </Button>
      </Modal>
    </>
  );
}

export default AccountHeader;
