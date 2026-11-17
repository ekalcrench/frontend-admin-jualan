import GroupIcon from "@mui/icons-material/Group";
import PaidIcon from "@mui/icons-material/Paid";
import { paths } from "@/constants/path";
import { SidebarListItem } from "./SidebarContent.types";
import { userRole } from "@/constants/user";
import { organizationRole } from "@/constants/organization";
import StoreIcon from "@mui/icons-material/Store";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import HistoryIcon from "@mui/icons-material/History";
import { defaultParameterDate } from "@/constants/table";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PersonIcon from "@mui/icons-material/Person";

export const sidebarList: SidebarListItem[] = [
  {
    title: "Dashboard",
    url: paths.dashboard,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <DashboardIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
    organizationRoleAccess: [organizationRole.ADMIN, organizationRole.OWNER],
  },
  {
    groupName: "Transactions",
  },
  {
    title: "Penjualan",
    url: paths.sales,
    params: `page=1&size=20&sortBy=-createdAt&startDate=${defaultParameterDate}&endDate=${defaultParameterDate}`,
    icon: <ShoppingCartIcon />,
    organizationRoleAccess: [
      organizationRole.ADMIN,
      organizationRole.OWNER,
      organizationRole.MEMBER,
    ],
  },
  {
    title: "Belanja",
    url: paths.purchases,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <ShoppingBasketIcon />,
    organizationRoleAccess: [
      organizationRole.ADMIN,
      organizationRole.OWNER,
      organizationRole.MEMBER,
    ],
  },
  {
    title: "Arus Kas",
    url: paths.cashFlows,
    params: `page=1&size=20&sortBy=-transactionAt&startDate=${defaultParameterDate}&endDate=${defaultParameterDate}`,
    icon: <HistoryIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
    organizationRoleAccess: [organizationRole.OWNER],
  },
  {
    groupName: "Organizations",
  },
  {
    title: "Produk",
    url: paths.products,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <CategoryIcon />,
    organizationRoleAccess: [
      organizationRole.ADMIN,
      organizationRole.OWNER,
      organizationRole.MEMBER,
    ],
  },
  {
    title: "Inventaris",
    url: paths.base,
    icon: <InventoryOutlinedIcon />,
    child: [
      {
        title: "Barang",
        url: paths.inventoryItems,
        params: "page=1&size=20&sortBy=name",
        organizationRoleAccess: [
          organizationRole.ADMIN,
          organizationRole.OWNER,
          organizationRole.MEMBER,
        ],
      },
      {
        title: "Produksi",
        url: paths.inventoryProductions,
        params: "page=1&size=20&sortBy=-createdAt",
        organizationRoleAccess: [
          organizationRole.ADMIN,
          organizationRole.OWNER,
          organizationRole.MEMBER,
        ],
      },
      {
        title: "Riwayat",
        url: paths.inventoryTransactions,
        params: "page=1&size=20&sortBy=-createdAt",
        organizationRoleAccess: [
          organizationRole.ADMIN,
          organizationRole.OWNER,
          organizationRole.MEMBER,
        ],
      },
    ],
    organizationRoleAccess: [
      organizationRole.ADMIN,
      organizationRole.OWNER,
      organizationRole.MEMBER,
    ],
  },
  {
    title: "Pengguna",
    url: paths.users,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <PersonIcon />,
    organizationRoleAccess: [
      organizationRole.ADMIN,
      organizationRole.OWNER,
      organizationRole.MEMBER,
    ],
  },
  {
    groupName: "Systems",
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
  },
  {
    title: "Semua Pengguna",
    url: paths.allUsers,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <GroupIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
  },
  {
    title: "UMKM",
    url: paths.umkm,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <StoreIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
  },
];
