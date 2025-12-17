"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import NotificationsOverlay from "../components/Notifications/NotificationsOverlay";
import Sidebar from "../components/Sidebar/Sidebar";
import "../globals.css";

export default function WithSidebarLayout({ children }) {
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <div style={{ display: "flex" }}>
      <Sidebar onNotificationsClick={() => setShowNotifications(true)} />
      <main id="mainContent" style={{ marginLeft: "260px", width: "100%" }}>
        {children}
      </main>
      <NotificationsOverlay
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}
