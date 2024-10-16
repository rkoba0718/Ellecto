"use client";

import React from "react";
import SearchFormContainer from "./(components)/containers/SearchFormContainer";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-10">
      <SearchFormContainer />
    </div>
  )
};

export default Home;