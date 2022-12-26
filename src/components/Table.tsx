import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";

import GlobalFilter from "./GlobalFilter";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 100 },
  {
    field: "description",
    headerName: "Description",
    sortable: false,
    flex: 100,
  },
  {
    field: "dateLastEdited",
    headerName: "Last edited",
    type: "date",
    flex: 100,
    valueFormatter: (v) => {
      const date = new Date(v.value);
      const dateTimeFormat = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return dateTimeFormat.format(date);
    },
  },
];

export default function DataTable() {
  const [state, setState] = React.useState({
    records: [],
    total: 0,
    page: 0,
    sortField: "",
    sortOrder: "",
    loading: true,
    search: "",
  });

  const { page, sortField, sortOrder, search } = state;

  const handlePageChange = (page: number) => {
    setState((st) => ({ ...st, page, loading: true }));
  };

  const handleSortChange = (
    arr: { field: string; sort: string | undefined | null }[]
  ) => {
    const { field, sort } = arr[0] || { field: "", sort: "" };

    setState((st) => ({
      ...st,
      sortField: field || "",
      sortOrder: sort || "",
      loading: true,
    }));
  };

  const handleSearch = (s: string) => {
    setState((st) => {
      if (st.search === s) {
        return st;
      }

      return {
        ...st,
        search: s,
      };
    });
  };

  const fetchData = React.useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/roles?page=${page}&sortField=${sortField}&sortOrder=${sortOrder}&pageSize=10&q=${search}`
      );

      setState((st) => ({
        ...st,
        records: data.results,
        total: data.total,
        loading: false,
      }));
    } catch (err) {
      console.log(err);
    }
  }, [page, sortField, sortOrder, search]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ maxWidth: "80%", margin: "2rem auto" }}>
      <GlobalFilter search={state.search} handleSearch={handleSearch} />
      <div style={{ width: "100%" }}>
        <DataGrid
          autoHeight
          disableColumnMenu={true}
          rows={[...state.records]}
          columns={columns}
          page={state.page}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onPageChange={handlePageChange}
          sortingMode="server"
          paginationMode="server"
          onSortModelChange={handleSortChange}
          rowCount={state.total}
          loading={state.loading}
        />
      </div>
    </div>
  );
}
