import { Collapse } from "antd";
import MyItemsAvatar from "./Nfts/MyItemsAvatar";
import MyItemsMini from "./Nfts/MyItemsMini";

const { Panel } = Collapse;
const AccountDrawerIndex = () => (
  <Collapse accordion style={{ width: "390px" }}>
    <Panel header="Purchased" key="1" style={{ marginLeft: "-10px" }}>
      <MyItemsMini />
    </Panel>
    <Panel header="Sold" key="2" style={{ marginLeft: "-10px" }}></Panel>
    <Panel header="Selling" key="3" style={{ marginLeft: "-10px" }}></Panel>
  </Collapse>
);
export default AccountDrawerIndex;
