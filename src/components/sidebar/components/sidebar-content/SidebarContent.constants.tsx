import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CampaignIcon from "@mui/icons-material/Campaign";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CastConnectedIcon from "@mui/icons-material/CastConnected";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FolderIcon from "@mui/icons-material/Folder";
import ListIcon from "@mui/icons-material/List";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import GroupIcon from "@mui/icons-material/Group";
import PaymentsIcon from "@mui/icons-material/Payments";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { paths } from "@/constants/path";
import { SidebarListItem } from "./SidebarContent.types";
import { userRole } from "@/constants/user";
import { organizationRole } from "@/constants/organization";
import StoreIcon from "@mui/icons-material/Store";

export const sidebarList: SidebarListItem[] = [
  // {
  //   title: "Analytics",
  //   url: paths.analytics,
  //   icon: <AnalyticsIcon />,
  // },
  // {
  //   title: "Stream Monitoring",
  //   url: paths.streamMonitoring,
  //   params: "page=1&size=10&sortBy=-createdDate",
  //   icon: <CastConnectedIcon />,
  // },
  // {
  //   title: "Gift",
  //   url: paths.base,
  //   icon: <CardGiftcardIcon />,
  //   child: [
  //     {
  //       title: "Config & List",
  //       url: paths.gift,
  //       params: "page=1&size=10&sortBy=-lastModifiedDate",
  //       icon: <ListIcon />,
  //     },
  //     {
  //       title: "Overlay Template",
  //       url: paths.overlayTemplate,
  //       params: "page=1&size=10&sortBy=-lastModifiedDate",
  //       icon: <ListIcon />,
  //     },
  //   ],
  // },
  // {
  //   title: "Q&Me",
  //   url: paths.qme,
  //   params: "page=1&size=10&sortBy=-createdDate",
  //   icon: <QuestionAnswerIcon />,
  // },
  // {
  //   title: "Chitchat",
  //   url: paths.chitchat,
  //   params: "page=1&size=10&sortBy=-createdDate",
  //   icon: <CardGiftcardIcon />,
  // },
  // {
  //   title: "Balance",
  //   url: paths.base,
  //   icon: <AccountBalanceWallet />,
  //   child: [
  //     {
  //       title: "Current Balance",
  //       url: paths.balance,
  //       params: "page=1&size=10&sortBy=-lastModifiedDate",
  //       icon: <ListIcon />,
  //     },
  //     {
  //       title: "Pending Balance",
  //       url: paths.pendingBalance,
  //       params: "page=1&size=10&sortBy=-lastModifiedDate",
  //       icon: <ListIcon />,
  //     },
  //   ],
  // },
  // {
  //   title: "Payment",
  //   url: paths.payment,
  //   params: "page=1&size=10&sortBy=-lastModifiedDate",
  //   icon: <PaymentsIcon />,
  // },
  // {
  //   title: "Withdraw",
  //   url: paths.base,
  //   icon: <LocalAtmIcon />,
  //   child: [
  //     {
  //       title: "Config & List",
  //       url: paths.withdraw,
  //       params: "page=1&size=10&sortBy=-lastModifiedDate",
  //       icon: <ListIcon />,
  //     },
  //     {
  //       title: "Bank Master",
  //       url: paths.bankMaster,
  //       params: "page=1&size=10",
  //       icon: <ListIcon />,
  //     },
  //   ],
  // },
  // {
  //   title: "Auto Settlement",
  //   url: paths.autoSettlement,
  //   icon: <FlashOnIcon />,
  // },
  // {
  //   title: "Admin",
  //   url: paths.admin,
  //   params: "page=1&size=10&sortBy=-lastModifiedDate",
  //   icon: <AdminPanelSettingsIcon />,
  // },
  // {
  //   title: "Media Library",
  //   url: paths.mediaLibrary,
  //   params: "page=1&size=10&sortBy=-lastModifiedDate",
  //   icon: <FolderIcon />,
  // },
  // {
  //   title: "Announcement",
  //   url: paths.announcement,
  //   params: "page=1&size=10&sortBy=-createdDate",
  //   icon: <CampaignIcon />,
  // },
  {
    title: "User",
    url: paths.users,
    icon: <GroupIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
    organizationRoleAccess: [organizationRole.ADMIN, organizationRole.OWNER],
    // child: [
    //   {
    //     title: "User",
    //     url: paths.users,
    //     params: "page=1&size=10&sortBy=-lastModifiedDate",
    //     icon: <ListIcon />,
    //   },
    //   {
    //     title: "User Register",
    //     url: paths.userRegister,
    //     params: "page=1&size=10&sortBy=-createdDate",
    //     icon: <ListIcon />,
    //   },
    // ],
  },
  {
    title: "UMKM",
    url: paths.umkm,
    icon: <StoreIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
    organizationRoleAccess: [organizationRole.ADMIN, organizationRole.OWNER],
  },
];
