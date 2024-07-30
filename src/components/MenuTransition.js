import * as React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { MenuButton as BaseMenuButton } from "@mui/base/MenuButton";
import { MenuItem as BaseMenuItem, menuItemClasses } from "@mui/base/MenuItem";
import { styled } from "@mui/system";
import { CssTransition } from "@mui/base/Transitions";
import { PopupContext } from "@mui/base/Unstable_Popup";
import { useNavigate } from "react-router-dom";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Avatar from "@mui/material/Avatar";
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

export default function MenuTransitions({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user_logged");
    localStorage.removeItem("user_data_logged");
    setUser("");
    navigate("/", { replace: false });
  };

  const createHandleMenuClick = (menuItem) => {
    return () => {
      if (menuItem === "Log out") {
        logout();
      }
      if (menuItem === "Profile") {
        navigate("/profile");
      }
      if (menuItem === "UpdateProfile") {
        navigate("/update-profile");
      }
      if (menuItem === "Home") {
        navigate("/dashboard");
      }
      if (menuItem === "Users") {
        navigate("/Users2");
      }
      if (menuItem === "MyFlats") {
        navigate("/my-flats");
      }
      if (menuItem === "Favorites") {
        navigate("/favorite-flats");
      }
      if (menuItem === "AddANewFlat") {
        navigate("/add-new-flat");
      }
      if (menuItem === "Log out") {
        localStorage.removeItem("user_logged");
        localStorage.removeItem("user_data_logged");
        setUser(null);
        navigate("/", { replace: true });
      }
    };
  };

  const avatarUrl = user?.avatar ? `http://localhost:3001${user.avatar.replace(/\\/g, '/')}` : "/broken-image.jpg";

  return (  
    <Dropdown >
      <MenuButton className="backdrop-blur-sm bg-white/25">
        <div
          id="dropdownAvatarNameButton"
          data-dropdown-toggle="dropdownAvatarName"
          className="flex items-center text-sm font-medium rounded-full md:me-0 text-gray-900 "
        >
          <Avatar src={avatarUrl} className="m-2" />
          {user && (
            <span className="text-gray-900">
              {user.firstName} {user.lastName} <br />
              {user.email}
            </span>
          )}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </div>
      </MenuButton>
      <Menu slots={{ listbox: AnimatedListbox }} style={{ zIndex: 1301 }} >
        <MenuItem onClick={createHandleMenuClick("Home")}>
          <HomeIcon className="mr-2" /> Home
        </MenuItem>
        <MenuItem onClick={createHandleMenuClick("Profile")}>
          <ManageAccountsIcon className="mr-2" /> My Profile
        </MenuItem>
        <MenuItem onClick={createHandleMenuClick("UpdateProfile")}>
          <SettingsIcon className="mr-2" /> Update Profile
        </MenuItem>
        {user && user.role === "admin" && (
          <MenuItem onClick={createHandleMenuClick("Users")}>
            <PeopleAltIcon className="mr-2" /> Users
          </MenuItem>
        )}
        <MenuItem onClick={createHandleMenuClick("Favorites")}>
          <FavoriteIcon className="mr-2" /> Favorites
        </MenuItem>
        {user && user.role !== "renter" && (
          <MenuItem onClick={createHandleMenuClick("MyFlats")}>
            <CorporateFareIcon className="mr-2" /> My Flats
          </MenuItem>
        )}
        {user && user.role !== "renter" && (
          <MenuItem onClick={createHandleMenuClick("AddANewFlat")}>
            <CorporateFareIcon className="mr-2" /> Add a new Flat
          </MenuItem>
        )}
        <MenuItem onClick={createHandleMenuClick("Log out")}>
          <ExitToAppIcon className="mr-2" /> Log out
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

const purple = {
  50: "#F3E5F5",
  100: "#E1BEE7",
  200: "#CE93D8",
  300: "#BA68C8",
  400: "#AB47BC",
  500: "#9C27B0",
  600: "#8E24AA",
  700: "#7B1FA2",
  800: "#6A1B9A",
  900: "#4A148C",
};

const blue = {
  50: "#E3F2FD",
  100: "#BBDEFB",
  200: "#90CAF9",
  300: "#64B5F6",
  400: "#42A5F5",
  500: "#2196F3",
  600: "#1E88E5",
  700: "#1976D2",
  800: "#1565C0",
  900: "#0D47A1",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Listbox = styled("ul")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  box-shadow: 0px 4px 30px ${
    theme.palette.mode === "dark" ? grey[900] : grey[200]
  };
  z-index: 1301;

  .closed & {
    opacity: 0;
    transform: scale(0.95, 0.8);
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
  
  .open & {
    opacity: 1;
    transform: scale(1, 1);
    transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
  }

  .placement-top & {
    transform-origin: bottom;
  }

  .placement-bottom & {
    transform-origin: top.
  }
  `
);

const AnimatedListbox = React.forwardRef(function AnimatedListbox(props, ref) {
  const { ownerState, ...other } = props;
  const popupContext = React.useContext(PopupContext);

  if (popupContext == null) {
    throw new Error(
      "The `AnimatedListbox` component cannot be rendered outside a `Popup` component"
    );
  }

  const verticalPlacement = popupContext.placement.split("-")[0];

  return (
    <CssTransition
      className={`placement-${verticalPlacement}`}
      enterClassName="open"
      exitClassName="closed"
    >
      <Listbox {...other} ref={ref} />
    </CssTransition>
  );
});

AnimatedListbox.propTypes = {
  ownerState: PropTypes.object.isRequired,
};

const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;

  &:last-of-type {
    border-bottom: none;
  }

  &.${menuItemClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[200]};
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }

  &.${menuItemClasses.disabled} {
    color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }

  &:hover:not(.${menuItemClasses.disabled}) {
    background-color: ${theme.palette.mode === "dark" ? purple[600] : purple[50]};
    color: ${theme.palette.mode === "dark" ? purple[100] : purple[900]};
  }
  `
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 8px 16px;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
  transition: all 150ms ease;
  cursor: pointer;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover {
    background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
  }

  &:active {
    background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${
      theme.palette.mode === "dark" ? blue[300] : blue[200]
    };
    outline: none;
  }
  `
);
