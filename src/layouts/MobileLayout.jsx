// layouts/MobileLayout.jsx

import React from "react";
import "../styles/global.scss"; // 전체 스타일 불러오기

const MobileLayout = ({ children }) => {
  return (
    <div className="app-container">
      <main className="main-wrapper">
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;
