import React from "react";

const Footer = ({
  title = "버전 0.1 - 실습용으로 간단히 구현된 예제입니다.",
}: {
  title?: string;
}) => {
  return (
    <footer style={{ marginTop: "20px", fontSize: "12px", color: "#555" }}>
      <small>{title}</small>
    </footer>
  );
};

export default Footer;
