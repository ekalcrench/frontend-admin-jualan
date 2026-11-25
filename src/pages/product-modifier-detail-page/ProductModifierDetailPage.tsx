import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Box, Button, Chip, Skeleton, Stack, Typography } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AssignProductsDialog from "@/components/product-modifier/assign-products-dialog";
import ModifierEmptyState from "@/components/product-modifier/modifier-empty-state";
import ModifierGroupForm from "@/components/product-modifier/modifier-group-form";
import ModifierOptionForm from "@/components/product-modifier/modifier-option-form";
import { paths } from "@/constants/path";
import useProductModifierAccess from "@/hooks/useProductModifierAccess";
import { BoxFlex, BoxFlexSpaceBetween } from "@/styled/CustomBox";
import {
  formatSelectionMode,
  formatSelectionRule,
} from "@/utils/productModifier";
import AssignedProductsSection from "./components/assigned-products-section";
import ModifierOptionsSection from "./components/modifier-options-section";
import useProductModifierDetailPage from "./ProductModifierDetailPage.hooks";
import PageTitle from "@/components/page-title";

function DetailSkeleton() {
  return (
    <Stack spacing={4}>
      <Box>
        <Skeleton variant="text" width={110} height={32} />
        <Skeleton variant="text" width={280} height={44} />
        <Skeleton variant="text" width={420} height={24} />
        <Stack direction="row" spacing={1} sx={{ marginTop: "12px" }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={90} height={24} />
        </Stack>
      </Box>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "border.main",
          borderRadius: "16px",
          padding: { xs: "16px", sm: "24px" },
        }}
      >
        <Skeleton variant="text" width={180} height={32} />
        <Skeleton
          variant="rounded"
          width="100%"
          height={160}
          sx={{ marginTop: "16px" }}
        />
      </Box>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "border.main",
          borderRadius: "16px",
          padding: { xs: "16px", sm: "24px" },
        }}
      >
        <Skeleton variant="text" width={280} height={32} />
        <Skeleton
          variant="rounded"
          width="100%"
          height={120}
          sx={{ marginTop: "16px" }}
        />
      </Box>
    </Stack>
  );
}

export default function ProductModifierDetailPage() {
  const { modifierGroupId } = useParams<{ modifierGroupId: string }>();

  if (!modifierGroupId) {
    return <Navigate to={paths.productModifiers} replace />;
  }

  return <ModifierGroupDetail modifierGroupId={modifierGroupId} />;
}

function ModifierGroupDetail({ modifierGroupId }: { modifierGroupId: string }) {
  const {
    groupQuery,
    group,
    options,
    nextSortOrder,
    isGroupFormOpen,
    isOptionFormOpen,
    editingOption,
    isAssignDialogOpen,
    deleteOption,
    reorderOptions,
    setOptionActive,
    removeAssignment,
    handleClickAddOption,
    handleClickDeleteOption,
    handleClickEditOption,
    handleClickToggleOptionActive,
    handleClickRemoveProduct,
    handleMoveOption,
    setIsGroupFormOpen,
    setIsOptionFormOpen,
    setIsAssignDialogOpen,
  } = useProductModifierDetailPage(modifierGroupId);

  const { canManage } = useProductModifierAccess();
  const navigate = useNavigate();

  if (groupQuery.isLoading && !group) {
    return <DetailSkeleton />;
  }

  if (!group) {
    return (
      <Stack spacing={4}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(paths.productModifiers)}
          sx={{ alignSelf: "flex-start" }}
        >
          Kembali ke Variasi & Add-on
        </Button>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "border.main",
            borderRadius: "16px",
            backgroundColor: "background.paper",
          }}
        >
          <ModifierEmptyState
            icon={<ErrorOutlineRoundedIcon />}
            title="Grup variasi tidak dapat dimuat"
            description="Data grup variasi tidak ditemukan atau terjadi kesalahan saat memuatnya."
            action={
              <Button variant="outlined" onClick={() => groupQuery.refetch()}>
                Coba Lagi
              </Button>
            }
          />
        </Box>
      </Stack>
    );
  }

  const statusPendingId = setOptionActive.isPending
    ? setOptionActive.variables?.id
    : undefined;
  const deletePendingId = deleteOption.isPending
    ? deleteOption.variables
    : undefined;
  const removingProductId = removeAssignment.isPending
    ? removeAssignment.variables?.productId
    : undefined;

  return (
    <Box>
      <ModifierGroupForm
        open={isGroupFormOpen}
        onClose={() => setIsGroupFormOpen(false)}
        onOpen={() => setIsGroupFormOpen(true)}
        setIsFormOpen={setIsGroupFormOpen}
        group={group}
      />

      <ModifierOptionForm
        open={isOptionFormOpen}
        onClose={() => setIsOptionFormOpen(false)}
        onOpen={() => setIsOptionFormOpen(true)}
        setIsFormOpen={setIsOptionFormOpen}
        modifierGroupId={group.id}
        nextSortOrder={nextSortOrder}
        option={editingOption}
      />

      <AssignProductsDialog
        open={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        modifierGroupId={group.id}
        groupName={group.name}
        assignedProducts={group.products}
      />

      <Stack spacing={4}>
        <Stack spacing={1}>
          <PageTitle
            title={
              <BoxFlex
                sx={{ gap: "10px", flexWrap: "wrap", alignItems: "center" }}
              >
                <Typography variant="h5">{group.name}</Typography>
                <Chip
                  label={group.isActive ? "Aktif" : "Nonaktif"}
                  size="small"
                  color={group.isActive ? "success" : "default"}
                  variant={group.isActive ? "filled" : "outlined"}
                />
              </BoxFlex>
            }
            subTitle={group.description || "Belum ada deskripsi"}
            enableBackButton
            addButton={
              canManage && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsGroupFormOpen(true)}
                  sx={{ width: { xs: "100%", sm: "auto" }, flexShrink: 0 }}
                >
                  Edit Grup
                </Button>
              )
            }
          />

          <BoxFlex sx={{ flexWrap: "wrap", gap: "4px" }}>
            <Chip
              label={`${options.length} opsi`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${group.products.length} produk`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={formatSelectionMode(group.isRequired)}
              size="small"
              variant="outlined"
              color={group.isRequired ? "primary" : "default"}
            />
            <Chip
              label={formatSelectionRule(group)}
              size="small"
              variant="outlined"
            />
          </BoxFlex>
        </Stack>

        <ModifierOptionsSection
          options={options}
          canManage={canManage}
          isReorderPending={reorderOptions.isPending}
          statusPendingId={statusPendingId}
          deletePendingId={deletePendingId}
          onAdd={handleClickAddOption}
          onEdit={handleClickEditOption}
          onToggleActive={handleClickToggleOptionActive}
          onDelete={handleClickDeleteOption}
          onMove={handleMoveOption}
        />

        <AssignedProductsSection
          products={group.products}
          canManage={canManage}
          removingProductId={removingProductId}
          onOpenAssign={() => setIsAssignDialogOpen(true)}
          onRemove={handleClickRemoveProduct}
        />
      </Stack>
    </Box>
  );
}
