"use client";

import React from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import styles from "../../../search.module.css";
import { LuSearch } from "react-icons/lu";

const Search = ({ placeholder }: any) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((e) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (e.target.value) {
      e.target.value.length > 1 && params.set("q", e.target.value);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params}`);
  }, 300);
  return (
    <div className={styles.container}>
      <LuSearch />
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search;
