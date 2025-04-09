"use client";

import React from "react";

import { FaSearch } from "react-icons/fa";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <>
      <input
        type="text"
        placeholder="Buscar por título..."
        className="mb-4 search-bar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <FaSearch className="search-icon"/>
    </>
  );
};

export default SearchInput;
