import React, { useContext, createContext, useState } from "react";
import { sortByAge, constructArr } from "../services/services";
import { getRandomNumber } from "../utils/utils";
import { INITIAL_MIN_INPUT, INITIAL_MAX_INPUT } from "./constants";

const AppContext = createContext();

const url = "https://randomuser.me/api/";

const AppProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [min, setMin] = useState(INITIAL_MIN_INPUT);
  const [max, setMax] = useState(INITIAL_MAX_INPUT);
  const [minInput, setMinInput] = useState(INITIAL_MIN_INPUT);
  const [maxInput, setMaxInput] = useState(INITIAL_MAX_INPUT);
  const [error, setError] = useState(false);

  const fetchNewData = async () => {
    // API Request
    const resp = await fetch(`${url}?results=${getRandomNumber()}`);
    const data = await resp.json();
    setPeople(data);

    // Sorting and constructing new arr
    const constructedArr = constructArr(data.results);
    const sortedData = sortByAge(constructedArr);
    setChartData(sortedData);
    setFilteredData(sortedData);

    const minVal = sortedData.reduce((curr, final) => {
      return curr.age < final.age ? curr : final;
    });
    setMin(minVal.age);
    setMinInput(minVal.age);

    const maxVal = sortedData.reduce((curr, final) => {
      return curr.age > final.age ? curr : final;
    });
    setMax(maxVal.age);
    setMaxInput(maxVal.age);
  };

  return (
    <AppContext.Provider
      value={{
        people,
        setPeople,
        chartData,
        setChartData,
        filteredData,
        setFilteredData,
        min,
        setMin,
        max,
        setMax,
        minInput,
        setMinInput,
        maxInput,
        setMaxInput,
        fetchNewData,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// A simple Hook to use the context easily anywhere
const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext };
