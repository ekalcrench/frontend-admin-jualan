import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";
import { SelectOrganizationsPageContainer } from "./SelectOrganizationsPage.styles";
import { TypographyCenter } from "@/styled/CustomTypography";
import useSelectOrganizationsPage from "./SelectOrganizationsPage.hooks";
import CustomAutocomplete from "@/components/custom-autocomplete";
import { BoxFlex } from "@/styled/CustomBox";
import { storageBaseUrl } from "@/constants/api";

export default function SelectOrganizationsPage() {
  const {
    control,
    errors,
    organizations,
    isLoading,
    isSubmitting,
    handleSubmit,
    onSubmit,
  } = useSelectOrganizationsPage();

  return (
    <SelectOrganizationsPageContainer>
      <Card elevation={2} sx={{ width: "440px", maxWidth: "90vw" }}>
        <CardContent>
          <TypographyCenter variant="h4">Pilih UMKM</TypographyCenter>
          <TypographyCenter sx={{ marginBottom: "32px", marginTop: "12px" }}>
            Pilih UMKM yang ingin Anda kelola
          </TypographyCenter>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomAutocomplete
              name="organization"
              control={control}
              errors={errors}
              placeholder="Pilih UMKM Anda"
              renderErrorMessage
              disabled={isLoading}
              autocompleteProps={{
                options: organizations ?? [],
                getOptionLabel: (option) =>
                  typeof option === "string" ? option : option.name,
                isOptionEqualToValue: (option, value) =>
                  typeof option !== "string" &&
                  typeof value !== "string" &&
                  option.id === value.id,
                renderOption: (props, option) => {
                  if (typeof option === "string") {
                    return <li {...props}>{option}</li>;
                  }

                  return (
                    <li {...props}>
                      <BoxFlex sx={{ gap: "12px" }}>
                        <Avatar
                          src={`${storageBaseUrl}${option.logoUrl}`}
                          alt={option.name}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography>{option.name}</Typography>
                      </BoxFlex>
                    </li>
                  );
                },
              }}
            />

            <Button fullWidth type="submit" loading={isSubmitting}>
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </SelectOrganizationsPageContainer>
  );
}
