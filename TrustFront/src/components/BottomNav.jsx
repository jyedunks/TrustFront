// src/components/BottomNav.jsx
import { NavLink } from "react-router-dom";

const itemStyle = (active) => ({
  flex: 1,
  textAlign: "center",
  padding: "10px 0",
  fontSize: 14,
  fontWeight: active ? 700 : 500,
  color: active ? "#111" : "#777",
  textDecoration: "none",
});

export default function BottomNav() {
  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        borderTop: "1px solid #eee",
        background: "#fff",
        display: "flex",
        height: 56,
        zIndex: 10,
      }}
    >
      <NavLink to="/home" style={({ isActive }) => itemStyle(isActive)}>
        홈
      </NavLink>
      <NavLink to="/market/buy" style={({ isActive }) => itemStyle(isActive)}>
        일반물품
      </NavLink>
      <NavLink to="/market/auction" style={({ isActive }) => itemStyle(isActive)}>
        경매물품
      </NavLink>
      <NavLink to="/chat" style={({ isActive }) => itemStyle(isActive)}>
        채팅
      </NavLink>
      <NavLink to="/my" style={({ isActive }) => itemStyle(isActive)}>
        My
      </NavLink>
    </nav>
  );
}