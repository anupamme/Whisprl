import { Box, ButtonBase, IconButton, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ArrowLeft, ChartLineUp, ClockCounterClockwise, Crown, ShieldStar, Users } from "phosphor-react";
import { useSelector } from "react-redux";
import { Link, Outlet, matchPath, useLocation } from "react-router-dom";

import WhisprlMark from "@/assets/icons/logo/WhisprlMark.webp";
import Wordmark from "@/components/Wordmark";
import { ON_RAIL } from "@/layouts/dashboard/NavRail";
import { PATH_ADMIN, PATH_DASHBOARD } from "@/routes/paths";
import getAvatar from "@/utils/avatars";

const SIDEBAR_WIDTH = 248;
const DESTINATIONS = [
  { path: PATH_ADMIN.overview, label: "Overview", Icon: ChartLineUp },
  { path: PATH_ADMIN.people, label: "People", Icon: Users },
  { path: PATH_ADMIN.audit, label: "Audit log", Icon: ClockCounterClockwise },
];
const ROLE_BADGES = { owner: { label: "Owner", Icon: Crown }, admin: { label: "Admin", Icon: ShieldStar } };

const RoleBadge = ({ role }) => {
  const { label, Icon } = ROLE_BADGES[role];
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{ px: 1, py: 0.375, borderRadius: 99, color: "primary.glow", bgcolor: (theme) => alpha(theme.palette.primary.glow, 0.14) }}
    >
      <Icon size={13} weight="fill" aria-hidden />
      <Typography component="span" sx={{ fontSize: 12, fontWeight: 800 }}>
        {label}
      </Typography>
    </Stack>
  );
};

const SidebarLink = ({ path, label, Icon, isActive }) => (
  <ButtonBase
    component={Link}
    to={path}
    aria-current={isActive ? "page" : undefined}
    sx={{
      position: "relative",
      width: "100%",
      justifyContent: "flex-start",
      gap: 1.5,
      px: 1.5,
      py: 1.25,
      borderRadius: 2.5,
      color: isActive ? "common.white" : ON_RAIL,
      bgcolor: isActive ? (theme) => alpha(theme.palette.primary.glow, 0.14) : "transparent",
      "&:hover": { color: "common.white", bgcolor: (theme) => alpha(theme.palette.primary.glow, isActive ? 0.18 : 0.06) },
      "&.Mui-focusVisible": { outline: 2, outlineColor: "primary.glow", outlineOffset: 2 },
    }}
  >
    {isActive && <Box sx={{ position: "absolute", left: -16, top: 10, bottom: 10, width: 4, borderRadius: 4, bgcolor: "primary.glow" }} />}
    <Icon size={20} weight={isActive ? "fill" : "regular"} />
    <Typography component="span" sx={{ fontSize: 14.5, fontWeight: isActive ? 800 : 600 }}>
      {label}
    </Typography>
  </ButtonBase>
);

const Sidebar = () => {
  const { pathname } = useLocation();
  const { firstName, lastName, avatar, role } = useSelector((state) => state.user.user);

  return (
    <Stack
      component="nav"
      aria-label="Admin"
      sx={{ position: "sticky", top: 0, width: SIDEBAR_WIDTH, height: "100dvh", flexShrink: 0, px: 2, py: 2.5, bgcolor: "chat.rail", color: ON_RAIL }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 1, color: "common.white" }}>
        <Box component="img" src={WhisprlMark} alt="" sx={{ width: 34, height: "auto" }} />
        <Typography component="p" sx={{ m: 0 }}>
          <Wordmark name="Admin" fontSize={28} />
        </Typography>
      </Stack>

      <Stack component="ul" spacing={0.5} sx={{ m: 0, mt: 5, p: 0, listStyle: "none" }}>
        {DESTINATIONS.map((destination) => (
          <li key={destination.path}>
            <SidebarLink {...destination} isActive={Boolean(matchPath(destination.path, pathname))} />
          </li>
        ))}
      </Stack>

      <Stack spacing={1.5} sx={{ mt: "auto", pt: 2, borderTop: 1, borderColor: alpha(ON_RAIL, 0.15) }}>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 1 }}>
          {getAvatar(avatar, `${firstName} ${lastName}`, 36)}
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: 14, fontWeight: 700, color: "common.white" }}>{`${firstName} ${lastName}`}</Typography>
            <Box sx={{ display: "flex", mt: 0.5 }}>
              <RoleBadge role={role} />
            </Box>
          </Box>
        </Stack>
        <ButtonBase
          component={Link}
          to={PATH_DASHBOARD.general.chat}
          sx={{ justifyContent: "flex-start", gap: 1, px: 1, py: 1, borderRadius: 2, color: ON_RAIL, "&:hover": { color: "common.white" } }}
        >
          <ArrowLeft size={18} weight="bold" />
          <Typography component="span" sx={{ fontSize: 13.5, fontWeight: 700 }}>
            Back to Whisprl
          </Typography>
        </ButtonBase>
      </Stack>
    </Stack>
  );
};

const PhoneNav = () => {
  const { pathname } = useLocation();
  return (
    <Stack component="nav" aria-label="Admin" direction="row" spacing={0.5} sx={{ px: 1.5, pb: 1.25 }}>
      {DESTINATIONS.map(({ path, label, Icon }) => {
        const isActive = Boolean(matchPath(path, pathname));
        return (
          <ButtonBase
            key={path}
            component={Link}
            to={path}
            aria-current={isActive ? "page" : undefined}
            sx={{
              gap: 0.75,
              px: 1.5,
              py: 0.75,
              borderRadius: 99,
              color: isActive ? "common.white" : ON_RAIL,
              bgcolor: isActive ? (theme) => alpha(theme.palette.primary.glow, 0.16) : "transparent",
              "&.Mui-focusVisible": { outline: 2, outlineColor: "primary.glow" },
            }}
          >
            <Icon size={16} weight={isActive ? "fill" : "regular"} />
            <Typography component="span" sx={{ fontSize: 13.5, fontWeight: isActive ? 800 : 600 }}>
              {label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Stack>
  );
};

const TopBar = () => {
  const role = useSelector((state) => state.user.user.role);
  return (
    <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 2, pt: "env(safe-area-inset-top)", bgcolor: "chat.rail", color: "common.white" }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ minHeight: 60, px: 1 }}>
        <Tooltip title="Back to Whisprl">
          <IconButton component={Link} to={PATH_DASHBOARD.general.chat} aria-label="Back to Whisprl" sx={{ color: ON_RAIL, width: 44, height: 44 }}>
            <ArrowLeft size={22} weight="bold" />
          </IconButton>
        </Tooltip>
        <Typography component="p" sx={{ m: 0, flex: 1 }}>
          <Wordmark name="Admin" fontSize={24} />
        </Typography>
        <Box sx={{ pr: 1 }}>
          <RoleBadge role={role} />
        </Box>
      </Stack>
      <PhoneNav />
    </Box>
  );
};

const AdminLayout = () => {
  const isPhone = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <Stack direction={{ xs: "column", md: "row" }} sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      {isPhone ? <TopBar /> : <Sidebar />}
      <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </Box>
    </Stack>
  );
};

export default AdminLayout;
