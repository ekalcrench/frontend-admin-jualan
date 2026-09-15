import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CustomPaginationProps } from "./CustomPagination.types";
import { BoxCenter } from "@/styled/CustomBox";
import { Pagination } from "@mui/material";

export default function CustomPagination({
  page,
  size,
  totalRows,
  totalDisplayedData,
  totalPages,
  handleChangePage,
  isLoading,
}: CustomPaginationProps) {
  const firstRowNumb = size * (page - 1) + 1;
  const lastRowNumb = firstRowNumb + totalDisplayedData - 1;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <BoxCenter>
        <Typography variant="body2" sx={{ marginLeft: "8px" }}>
          Showing{" "}
          <Typography
            component={"span"}
            variant="body2"
            sx={{ fontWeight: 700 }}
          >
            {firstRowNumb}-{lastRowNumb}
          </Typography>{" "}
          of{" "}
          <Typography
            component={"span"}
            variant="body2"
            sx={{ fontWeight: 700 }}
          >
            {totalRows}
          </Typography>{" "}
          entries
        </Typography>
      </BoxCenter>

      <BoxCenter>
        <Pagination
          count={totalPages}
          page={page}
          color="primary"
          onChange={(_e, page) => handleChangePage(page)}
          disabled={isLoading}
          shape="rounded"
          variant="outlined"
        />
      </BoxCenter>
    </Box>
  );
}
