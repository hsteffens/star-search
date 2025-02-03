"use client";

import { withWebvitals } from "utils/withWebvitals";
import Results from "./components/results/Results";
import Search from "./components/search/Search";
import { SearchProvider } from "./contexts/SearchContext";
import styles from "./page.module.css";

export default function Home() {
  const WrappedChildren = withWebvitals(() => <SearchProvider>
    <div className={styles.container}>
      <div className={styles.search}>
        <Search />
      </div>
      <div className={styles.results}>
        <Results />
      </div>
    </div>
  </SearchProvider>, 'Home');
  return (<WrappedChildren />);
}