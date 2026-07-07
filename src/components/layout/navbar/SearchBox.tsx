import { Search } from "lucide-react";
import styles from "./SearchBox.module.css";

export function SearchBox() {
  return (
    <button className={styles.search}>
      <Search size={17} />
      <span>Search</span>
      <kbd>Ctrl K</kbd>
    </button>
  );
}