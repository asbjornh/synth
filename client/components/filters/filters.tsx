import React from "react";
import { Filter as FilterType } from "../../../interface/state";
import { defaultFilter, Filter } from "../filter/filter";
import "./filters";

export const Filters: React.FC<{
  filters: FilterType[];
  onChange: (filters: FilterType[]) => void;
}> = ({ filters, onChange }) => {
  const addFilter = () => onChange(filters.concat(defaultFilter));

  const setFilter = (index: number) => (filter: FilterType) =>
    onChange(filters.map((f, i) => (i === index ? filter : f)));

  return (
    <div>
      <h2>Filters</h2>
      {filters.map((filter, index) => (
        <div key={filter.shape + index}>
          <Filter filter={filter} onChange={setFilter(index)} />
        </div>
      ))}
      <button onClick={addFilter}>Add filter</button>
    </div>
  );
};
