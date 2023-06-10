import { useState, useRef, useEffect } from "react";

const LOCAL_STORAGE_KEY = 'lastCity';

const Seatch = ({ getInformation }) => {
    const [search, ChangeSearch] = useState();
    const searchRef = useRef();

    useEffect(() => {
        searchRef.current.value = localStorage.getItem(LOCAL_STORAGE_KEY);
    }, [])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, searchRef.current.value);
    }, [search])

    const handleChange = () => {
        ChangeSearch(searchRef.current.value);
    }

    return (
        <>
            <input type="text" ref={searchRef} placeholder="City" onChange={handleChange}></input>;
        </>
    );
};

export default Seatch;
