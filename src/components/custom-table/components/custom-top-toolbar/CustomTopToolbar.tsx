import { BoxFlex, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { Button } from "@mui/material";
import { CustomTopToolbarProps } from "./CustomTopToolbar.types";
import CustomSearchInput from "../custom-search-input";
import { emptyFunc } from "@/utils/generalUtils";
import ButtonColumns from "../button-columns";
import { MRT_RowData } from "material-react-table";

export default function CustomTopToolbar<TData extends MRT_RowData>({
  handleClickFilters,
  handleResetFilter,
  addButton,
  search,
  handleSearch = emptyFunc,
  columns,
  columnVisibility,
  setColumnVisibility,
  searchPlaceholder,
}: CustomTopToolbarProps<TData>) {
  return (
    <BoxFlexSpaceBetween>
      <BoxFlex sx={{ gap: "12px" }}>
        <CustomSearchInput
          value={search}
          onSearch={handleSearch}
          searchPlaceholder={searchPlaceholder}
        />
        {handleClickFilters && (
          <Button onClick={handleClickFilters}>Filters</Button>
        )}
        <ButtonColumns
          columns={columns}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
        <Button onClick={handleResetFilter}>Reset</Button>
      </BoxFlex>

      {addButton}
    </BoxFlexSpaceBetween>
  );
}
