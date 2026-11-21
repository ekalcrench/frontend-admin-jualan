import useAuthStore from "@/store/auth-store";
import { canManageProductModifiers } from "@/utils/productModifier";

export default function useProductModifierAccess() {
  const organizationRole = useAuthStore((state) => state.organization?.role);

  return {
    canManage: canManageProductModifiers(organizationRole),
  };
}
