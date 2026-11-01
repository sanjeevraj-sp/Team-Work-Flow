import { useState } from "react";

import Input from "./ui/input";
import Select from "./ui/select";
import { Button } from "./ui/button";
import MultiSelectTabs from "./ui/multiSelectTabs";
import MultiSelectDropdown from "./ui/multiSelectDropDown";

import type { useTaskActions } from "../Hooks/useTaskActions";

import { Copy, Check } from "lucide-react";

const PRIORITIES = ["Low", "Medium", "High"];

const ASSIGNEES = ["John Doe", "Peter Parker", "Bruce Wayne", "Donald Trump"];

const BADGES = [
  "Frontend",
  "Backend",
  "React",
  "Authentication",
  "UI/UX",
  "Design",
  "Tasks",
];

const SORT_OPTIONS = ["Updated date", "Created date", "Priority"];

const SORT_DIRECTIONS = ["Newest first", "Oldest first"];

interface ActionsProps {
  actions: ReturnType<typeof useTaskActions>;
}

const Actions = ({ actions }: ActionsProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const {
    search,
    setSearch,
    priorities,
    setPriorities,
    assignees,
    setAssignees,
    badges,
    setBadges,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    clearFilters,
    shareableUrl,
  } = actions;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setIsCopied(true);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl py-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Input
              label="Search"
              placeholder="Search title or description..."
              value={search}
              onChange={setSearch}
            />
          </div>

          <div className="lg:col-span-2">
            <MultiSelectTabs
              label="Priority"
              options={PRIORITIES}
              value={priorities}
              onChange={setPriorities}
            />
          </div>

          <div className="lg:col-span-2">
            <MultiSelectDropdown
              label="Assignee"
              placeholder="All assignees"
              options={ASSIGNEES}
              value={assignees}
              onChange={setAssignees}
            />
          </div>

          <div className="lg:col-span-2">
            <MultiSelectDropdown
              label="Badge"
              placeholder="All badges"
              options={BADGES}
              value={badges}
              onChange={setBadges}
            />
          </div>

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

          <div className="lg:col-span-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              className="w-full whitespace-nowrap"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Shareable URL Footer */}
        <div className="mt-4 border-t border-slate-200 pt-3">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <span className="shrink-0 text-xs font-medium text-slate-500">
              Shareable view URL
            </span>

            <div
              className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md bg-slate-50 px-2.5 py-2"
              title={shareableUrl}
            >
              <code className="min-w-0 flex-1 truncate whitespace-nowrap text-xs text-slate-600 text-left">
                {shareableUrl}
              </code>

              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                aria-label={isCopied ? "URL copied" : "Copy URL"}
                title={isCopied ? "Copied!" : "Copy URL"}
              >
                {isCopied ? (
                  <Check size={15} strokeWidth={2} className="text-blue-600" />
                ) : (
                  <Copy size={15} strokeWidth={1.7} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actions;
