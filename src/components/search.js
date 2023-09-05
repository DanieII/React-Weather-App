import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const LOCAL_STORAGE_KEY = "lastCity";

const Search = ({ onSearch }) => {
  const [search, ChangeSearch] = useState();
  const searchRef = useRef();

  useEffect(() => {
    searchRef.current.value = localStorage.getItem(LOCAL_STORAGE_KEY);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, searchRef.current.value);
  }, [search]);

  const handleChange = () => {
    ChangeSearch(searchRef.current.value);
  };

  const startSearch = () => {
    onSearch(searchRef.current.value);
  };

  return (
    <>
      <div>
        <input
          type="text"
          ref={searchRef}
          placeholder="Search..."
          onChange={handleChange}
          className="p-1 dark:bg-neutral-500 rounded"
        ></input>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          id="search-icon"
          onClick={startSearch}
          className="ml-5 cursor-pointer text-neutral-500 hover:text-gray-700"
        />
      </div>
    </>
  );
};

export default Search;
