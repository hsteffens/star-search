import Results from "./components/results/Results";
import Search from "./components/search/Search";
import { SearchProvider } from "./contexts/SearchContext";
import styles from "./page.module.css";

export default function Home() {
  return (
    <SearchProvider>
      <div className={styles.container}>
        <div className={styles.search}>
          <Search />
        </div>
        <div className={styles.results}>
          <Results />
        </div>
      </div>
    </SearchProvider>

  );
}