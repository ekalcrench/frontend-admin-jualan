import { BoxFlex, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { Button, IconButton } from "@mui/material";
import { CustomTopToolbarProps } from "./CustomTopToolbar.types";
import CustomSearchInput from "../custom-search-input";
import { emptyFunc } from "@/utils/generalUtils";
import ButtonColumns from "../button-columns";
import { MRT_RowData } from "material-react-table";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";

export default function CustomTopToolbar<TData extends MRT_RowData>({
  handleClickFilters,
  handleResetFilter,
  showResetFilter = false,
  search,
  handleSearch = emptyFunc,
  columns,
  columnVisibility,
  setColumnVisibility,
  searchPlaceholder,
  isMobile = false,
}: CustomTopToolbarProps<TData>) {
  return (
    <BoxFlexSpaceBetween sx={{ width: "100%", gap: { xs: "0px", md: "12px" } }}>
      <BoxFlex sx={{ gap: "8px", flex: 1 }}>
        <CustomSearchInput
          value={search}
          onSearch={handleSearch}
          searchPlaceholder={searchPlaceholder}
          isMobile={isMobile}
        />
        {!isMobile && (
          <ButtonColumns
            columns={columns}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        )}
        {isMobile && handleClickFilters && (
          <IconButton color="primary">
            <FilterAltRoundedIcon />
          </IconButton>
        )}
        {!isMobile && handleClickFilters && (
          <Button
            onClick={handleClickFilters}
            aria-label="Filter"
            sx={{ flexShrink: 0 }}
            variant="outlined"
            startIcon={<FilterAltRoundedIcon />}
          >
            Filter
          </Button>
        )}
      </BoxFlex>

      {isMobile && showResetFilter && (
        <IconButton color="primary" edge="end">
          <RestartAltRoundedIcon />
        </IconButton>
      )}
      {!isMobile && showResetFilter && (
        <Button
          onClick={handleResetFilter}
          aria-label="Reset"
          sx={{ flexShrink: 0, marginRight: "-10px" }}
          variant="text"
          startIcon={<RestartAltRoundedIcon />}
        >
          Reset
        </Button>
      )}
    </BoxFlexSpaceBetween>
  );
}
