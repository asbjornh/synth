import React from "react";
import { PlusSquare } from "react-feather";
import { Filter as FilterType } from "../../../interface/state";
import { Button } from "../button/button";
import { defaultFilter, Filter } from "../filter/filter";
import { Panel } from "../panel/panel";
import "./filters";

export const Filters: React.FC<{
  filters: FilterType[];
  onChange: (filters: FilterType[]) => void;
}> = ({ filters, onChange }) => {
  const addFilter = () => onChange(filters.concat(defaultFilter));

  const setFilter = (index: number) => (filter: FilterType) =>
    onChange(filters.map((f, i) => (i === index ? filter : f)));

  return (
    <Panel
      title="Filter"
      actions={
        <Button onClick={addFilter} color="dark">
          <PlusSquare />
        </Button>
      }
    >
      {filters.map((filter, index) => (
        <div key={filter.shape + index}>
          <Filter filter={filter} onChange={setFilter(index)} />
        </div>
      ))}
    </Panel>
  );
};
