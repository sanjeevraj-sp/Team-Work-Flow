import { useEffect, useMemo, useState } from "react";

import type { Priority } from "../Constants/types";
import { PRIORITIES } from "../Constants/types";
import { useTaskContext } from "../Context/Task";

type SortBy = "Updated date" | "Created date" | "Priority";
type SortDirection = "Newest first" | "Oldest first";

interface TaskActionState {
  search: string;
  priorities: string[];
  assignees: string[];
  badges: string[];
  sortBy: SortBy;
  sortDirection: SortDirection;
}

const DEFAULT_SORT_BY: SortBy = "Updated date";
const DEFAULT_SORT_DIRECTION: SortDirection = "Newest first";

const SORT_TO_PARAM: Record<SortBy, string> = {
  "Updated date": "updated",
  "Created date": "created",
  Priority: "priority",
};

const PARAM_TO_SORT: Record<string, SortBy> = {
  updated: "Updated date",
  created: "Created date",
  priority: "Priority",
};

const PRIORITY_ORDER: Record<Priority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

// Read the initial filter state from the URL.
const readFiltersFromUrl = (): TaskActionState => {
  const params = new URLSearchParams(window.location.search);

  const sortParam = params.get("sort");
  const directionParam = params.get("dir");

  return {
    search: params.get("q") ?? "",

    priorities: params
      .getAll("priority")
      .filter((value): value is Priority =>
        PRIORITIES.includes(value as Priority),
      ),

    assignees: params.getAll("assignee"),
    badges: params.getAll("tag"),

    sortBy: sortParam
      ? (PARAM_TO_SORT[sortParam] ?? DEFAULT_SORT_BY)
      : DEFAULT_SORT_BY,

    sortDirection:
      directionParam === "asc" ? "Oldest first" : DEFAULT_SORT_DIRECTION,
  };
};

export const useTaskActions = () => {
  const { allTasks } = useTaskContext();

  const [filters, setFilters] = useState<TaskActionState>(readFiltersFromUrl);

  const { search, priorities, assignees, badges, sortBy, sortDirection } =
    filters;

  // Update individual filter values.
  const setSearch = (value: string) => {
    setFilters((previous) => ({
      ...previous,
      search: value,
    }));
  };

  const setPriorities = (value: string[]) => {
    setFilters((previous) => ({
      ...previous,
      priorities: value,
    }));
  };

  const setAssignees = (value: string[]) => {
    setFilters((previous) => ({
      ...previous,
      assignees: value,
    }));
  };

  const setBadges = (value: string[]) => {
    setFilters((previous) => ({
      ...previous,
      badges: value,
    }));
  };

  const setSortBy = (value: string) => {
    if (!Object.keys(SORT_TO_PARAM).includes(value)) return;

    setFilters((previous) => ({
      ...previous,
      sortBy: value as SortBy,
    }));
  };

  const setSortDirection = (value: string) => {
    if (value !== "Newest first" && value !== "Oldest first") {
      return;
    }

    setFilters((previous) => ({
      ...previous,
      sortDirection: value,
    }));
  };

  // Determine whether filters or non-default sorting are active.
  const hasActiveActions =
    search.trim() !== "" ||
    priorities.length > 0 ||
    assignees.length > 0 ||
    badges.length > 0 ||
    sortBy !== DEFAULT_SORT_BY ||
    sortDirection !== DEFAULT_SORT_DIRECTION;

  // Build the shareable query string.
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("q", search.trim());
    }

    priorities.forEach((priority) => {
      params.append("priority", priority);
    });

    assignees.forEach((assignee) => {
      params.append("assignee", assignee);
    });

    badges.forEach((badge) => {
      params.append("tag", badge);
    });

    // Include sort and direction whenever an action is active.
    if (hasActiveActions) {
      params.set("sort", SORT_TO_PARAM[sortBy]);
      params.set("dir", sortDirection === "Newest first" ? "desc" : "asc");
    }

    const query = params.toString();

    return query ? `?${query}` : "";
  }, [
    search,
    priorities,
    assignees,
    badges,
    sortBy,
    sortDirection,
    hasActiveActions,
  ]);

  // Synchronize filter state with the browser URL.
  useEffect(() => {
    const nextUrl =
      window.location.pathname + queryString + window.location.hash;

    const currentUrl =
      window.location.pathname + window.location.search + window.location.hash;

    if (nextUrl !== currentUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [queryString]);

  // Restore filters when navigating backward/forward.
  useEffect(() => {
    const handlePopState = () => {
      setFilters(readFiltersFromUrl());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Filter and sort tasks.
  const filteredTasks = useMemo(() => {
    if (!hasActiveActions) return [];

    let result = allTasks.filter((task) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        !searchTerm ||
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.assignee.toLowerCase().includes(searchTerm);

      const matchesPriority =
        priorities.length === 0 || priorities.includes(task.priority);

      const matchesAssignee =
        assignees.length === 0 || assignees.includes(task.assignee);

      const matchesBadge =
        badges.length === 0 ||
        badges.some((badge) => task.tags.includes(badge));

      return (
        matchesSearch && matchesPriority && matchesAssignee && matchesBadge
      );
    });

    result = [...result].sort((a, b) => {
      let comparison = 0;

      if (sortBy === "Updated date") {
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortBy === "Created date") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        comparison = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      }

      return sortDirection === "Newest first" ? -comparison : comparison;
    });

    return result;
  }, [
    allTasks,
    search,
    priorities,
    assignees,
    badges,
    sortBy,
    sortDirection,
    hasActiveActions,
  ]);

  // Clear filters and restore defaults.
  const clearFilters = () => {
    setFilters({
      search: "",
      priorities: [],
      assignees: [],
      badges: [],
      sortBy: DEFAULT_SORT_BY,
      sortDirection: DEFAULT_SORT_DIRECTION,
    });
  };

  // Full URL for sharing.
  const shareableUrl =
    window.location.origin +
    window.location.pathname +
    queryString +
    window.location.hash;

  const displayedTasks = hasActiveActions ? filteredTasks : allTasks;

  return {
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
    filteredTasks,
    displayedTasks,
    hasActiveActions,
    queryString,
    shareableUrl,
    clearFilters,
  };
};
