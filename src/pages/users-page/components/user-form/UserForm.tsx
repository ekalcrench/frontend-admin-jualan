import { Button } from "@mui/material";
import useUserForm from "./UserForm.hooks";
import FormDrawer from "@/components/form-drawer";
import { UserFormProps } from "./UserForm.types";
import CustomAutocomplete from "@/components/custom-autocomplete";
import { userOrganizationRoleOptions } from "@/constants/user";

export default function UserForm(props: UserFormProps) {
  const {
    control,
    errors,
    isLoading,
    isLoadingGetOptions,
    userOptions,
    handleSubmit,
    onSubmit,
    setPrefix,
  } = useUserForm(props);

  return (
    <FormDrawer
      open={props.open}
      onClose={props.onClose}
      onOpen={props.onOpen}
      title="Tambah User Baru"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomAutocomplete
          name="userId"
          control={control}
          errors={errors}
          label="User"
          placeholder="Pilih user yang sudah terdaftar"
          renderErrorMessage
          disabled={isLoading}
          autocompleteProps={{
            options: (userOptions ?? []).map((user) => ({
              label: `${user.name} (${user.email})`,
              value: user.id,
            })),
            onInputChange: (_, value, reason) => {
              if (reason === "input") setPrefix(value);
            },
            loading: isLoadingGetOptions,
          }}
        />

        <CustomAutocomplete
          name="role"
          control={control}
          errors={errors}
          label="Role"
          placeholder="Pilih role user"
          renderErrorMessage
          disabled={isLoading}
          autocompleteProps={{
            options: userOrganizationRoleOptions,
          }}
        />

        <Button
          sx={{ marginTop: "20px" }}
          type="submit"
          variant="contained"
          fullWidth
          loading={isLoading}
        >
          Simpan
        </Button>
      </form>
    </FormDrawer>
  );
}
