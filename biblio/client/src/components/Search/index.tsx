import { TextField } from "@consta/uikit/TextField";
import { FC, useEffect, useState } from "react";
import "./Search.css";

interface Props {
  setValue: (value: string) => void;
}

const Search: FC<Props> = ({ setValue }) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(searchValue);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchValue]);
  return (
    <div className="searchContainer">
      <TextField
        value={searchValue}
        onChange={(value) => setSearchValue(value || "")}
        placeholder="Поиск"
      />
    </div>
  );
};

export default Search;
