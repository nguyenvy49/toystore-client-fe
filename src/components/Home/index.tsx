import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import BestSeller from "./BestSeller";

const Home = () => {
  return (
    <main>
      <Hero />
      <Categories />
      <NewArrival />
      <BestSeller />
    </main>
  );
};

export default Home;
