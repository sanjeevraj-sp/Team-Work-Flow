import { useState } from "react";

import Input from "./ui/input";
import Select from "./ui/select";
import MultiSelectTabs from "./ui/multiSelectTabs";
import MultiSelectDropdown from "./ui/multiSelectDropDown";

const PRIORITIES = ["Low", "Medium", "High"];

const ASSIGNEES = [
  "John Doe",
  "Peter Parker",
  "Bruce Wayne",
  "Donald Trump",
];

const BADGES = [
  "Frontend",
  "Backend",
  "React",
  "Authentication",
  "UI/UX",
  "Design",
  "Tasks",
];

const SORT_OPTIONS = [
  "Updated date",
  "Created date",
  "Priority",
];

const SORT_DIRECTIONS = [
  "Newest first",
  "Oldest first",
];

const Actions = () => {
  const [search, setSearch] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState("Updated date");
  const [sortDirection, setSortDirection] = useState("Newest first");

  const clearFilters = () => {
    setSearch("");
    setPriorities([]);
    setAssignees([]);
    setBadges([]);
    setSortBy("Updated date");
    setSortDirection("Newest first");
  };

  return (
    <div className="mx-auto max-w-7xl py-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4">

        <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-12">

          {/* Search */}
          <div className="lg:col-span-3">
            <Input
              label="Search"
              placeholder="Search title or description..."
              value={search}
              onChange={setSearch}
            />
          </div>

          {/* Priority */}
          <div className="lg:col-span-2">
            <MultiSelectTabs
              label="Priority"
              options={PRIORITIES}
              value={priorities}
              onChange={setPriorities}
            />
          </div>

          {/* Assignee */}
          <div className="lg:col-span-2">
            <MultiSelectDropdown
              label="Assignee"
              placeholder="All assignees"
              options={ASSIGNEES}
              value={assignees}
              onChange={setAssignees}
            />
          </div>

          {/* Badge */}
          <div className="lg:col-span-2">
            <MultiSelectDropdown
              label="Badge"
              placeholder="All badges"
              options={BADGES}
              value={badges}
              onChange={setBadges}
            />
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <Select
              label="Sort by"
              value={sortBy}
              options={SORT_OPTIONS}
              onChange={setSortBy}
            />

            <Select
              value={sortDirection}
              options={SORT_DIRECTIONS}
              onChange={setSortDirection}
            />
          </div>

          {/* Clear */}
          <div className="lg:col-span-1">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full whitespace-nowrap rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Actions;