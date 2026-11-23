import { BoxFlex, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import { Button } from "@mui/material";
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
  search,
  handleSearch = emptyFunc,
  columns,
  columnVisibility,
  setColumnVisibility,
  searchPlaceholder,
  isMobile = false,
}: CustomTopToolbarProps<TData>) {
  return (
    <BoxFlexSpaceBetween sx={{ width: "100%", gap: "8px" }}>
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
        {handleClickFilters && (
          <Button
            onClick={handleClickFilters}
            sx={{ flexShrink: 0 }}
            variant="outlined"
            startIcon={<FilterAltRoundedIcon />}
          >
            Filter
          </Button>
        )}
      </BoxFlex>

      <Button
        onClick={handleResetFilter}
        sx={{ flexShrink: 0 }}
        variant="text"
        startIcon={<RestartAltRoundedIcon />}
      >
        Reset
      </Button>
    </BoxFlexSpaceBetween>
  );
}
