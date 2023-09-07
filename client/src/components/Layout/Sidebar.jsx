import React, { useState } from "react";
import { ReloadOutlined, ControlOutlined, RollbackOutlined, PlusOutlined } from '@ant-design/icons'


const Sidebar = () => {
  const [selectedItem, setSelectedItem] = useState("");

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="sidebar">
      <div className="sidebar__items">
        <div
          className="sidebar__item"
          onClick={() => handleItemClick("home")}
          onMouseEnter={() => setSelectedItem("Home")}
          onMouseLeave={() => setSelectedItem("")}
        >
          <ControlOutlined />
          <div className="sidebar__item-name">{selectedItem}</div>
        </div>
        <div
          className="sidebar__item"
          onClick={() => handleItemClick("profile")}
          onMouseEnter={() => setSelectedItem("Profile")}
          onMouseLeave={() => setSelectedItem("")}
        >
          <ReloadOutlined />
          <div className="sidebar__item-name">{selectedItem}</div>
        </div>
        <div
          className="sidebar__item"
          onClick={() => handleItemClick("settings")}
          onMouseEnter={() => setSelectedItem("Settings")}
          onMouseLeave={() => setSelectedItem("")}
        >
          <RollbackOutlined />
          <div className="sidebar__item-name">{selectedItem}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
