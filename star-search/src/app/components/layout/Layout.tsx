import React from "react";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {/* Banner/Header */}
      <header className={styles.header}>
        <span className={`${styles.banner} Text-Style-2`}>
          SWStarter
        </span>
      </header>

      {/* Main Content */}
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;