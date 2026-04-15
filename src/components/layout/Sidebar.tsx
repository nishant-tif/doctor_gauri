"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
} from "@mui/material";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";

import WidgetsIcon from "@mui/icons-material/Widgets";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

import { fetchCurrentUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store";

const Sidebar: React.FC<{
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}> = ({ mobileOpen, onMobileClose }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const [user, setUser] = useState<null | Record<string, unknown>>(null);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(fetchCurrentUser())
        .unwrap()
        .then((userData: unknown) => {
          setUser(userData as Record<string, unknown>);
        });
    };

    fetchUser();
  }, [dispatch]);

  /* ------------------ NORMAL MENU ------------------ */

  const menuItems = [
    {
      path: "/dashboard/widgets/podcast",
      label: "Dashboard",
      icon: "/assets/icons/Home.png",
    },
  ];

  /* ------------------ ARTICLES ------------------ */

  const [openArticles, setOpenArticles] = useState(
    pathname?.startsWith("/articles"),
  );

  const handleArticlesToggle = () => {
    setOpenArticles(!openArticles);
  };

  /* ------------------ WIDGETS ------------------ */

  const [openWidgets, setOpenWidgets] = useState(
    pathname?.startsWith("/dashboard/widgets"),
  );

  const handleWidgetsToggle = () => {
    setOpenWidgets(!openWidgets);
  };

  const isWidgetSubActive = (path: string) =>
    pathname === path || pathname?.startsWith(path);

  /* ------------------ SIDEBAR CONTENT ------------------ */

  const sidebarContent = (
    <>
      {/* Logo */}
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Link href="/dashboard/widgets/podcast">
          <Image
            src="/assets/gauri-logo.webp"
            alt="Gauri"
            width={150}
            height={150}
          />
        </Link>
      </Box>

      <List sx={{ flex: 1, px: 2 }}>
        {/* Normal Menu */}
        {menuItems.map((item) => {
          const isActive =
            pathname === item.path || pathname?.startsWith(item.path + "/");

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? "#000" : "transparent",
                  color: isActive ? "white" : "#333",
                  transform: isActive ? "scale(1.1)" : "scale(1)",

                  "&:hover": {
                    backgroundColor: isActive
                      ? "#000"
                      : "rgba(255,255,255,0.1)",
                    transform: "scale(1.1)",
                    transition: "transform 0.2s",
                  },

                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 30,
                    minHeight: 30,
                    color: isActive ? "white" : "#333",
                    bgcolor: "white",
                    borderRadius: "10px",
                    p: 0.5,
                    mr: 1,
                  }}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.8rem",
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {/* ================= WIDGETS ================= */}

        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton
            onClick={handleWidgetsToggle}
            sx={{
              borderRadius: 2,
              backgroundColor: pathname?.startsWith("/dashboard/widgets")
                ? "#000"
                : "transparent",
              color: pathname?.startsWith("/dashboard/widgets") ? "#fff" : "#333",
              transform: pathname?.startsWith("/dashboard/widgets")
                ? "scale(1.1)"
                : "scale(1)",
              "&:hover": {
                backgroundColor: pathname?.startsWith("/dashboard/widgets")
                  ? "#000"
                  : "rgba(255,255,255,0.1)",
                transform: "scale(1.1)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 30,
                bgcolor: pathname?.startsWith("/dashboard/widgets")
                  ? "#000"
                  : "white",
                borderRadius: "10px",
                p: 0.5,
                mr: 1,
              }}
            >
              <WidgetsIcon
                sx={{
                  color: pathname?.startsWith("/dashboard/widgets")
                    ? "#fff"
                    : "#333",
                }}
              />
            </ListItemIcon>

            <ListItemText primary="Widgets" />

            {openWidgets ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openWidgets} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {[
              // {
              //   label: "Numbers Widget",
              //   icon: <NumbersIcon />,
              //   path: "/dashboard/widgets/numberwidget",
              // },
              // {
              //   label: "About Widget",
              //   icon: <InfoIcon />,
              //   path: "/dashboard/widgets/about",
              // },
              // {
              //   label: "Programme Widget",
              //   icon: <ViewModuleIcon />,
              //   path: "/dashboard/widgets/programme",
              // },
              // {
              //   label: "Footer Widget",
              //   icon: <ViewModuleIcon />,
              //   path: "/dashboard/widgets/footer",
              // },
              // {
              //   label: "Toolkit Widget",
              //   icon: <BuildIcon />,
              //   path: "/dashboard/widgets/toolkit",
              // },
              // {
              //   label: "Regulation Widget",
              //   icon: <VideoLibraryIcon />,
              //   path: "/dashboard/widgets/regulation",
              // },
              {
                label: "Podcast Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/podcast",
              },
              {
                label: "Successful Cases Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/successful-cases",
              },
              {
                label: "Angel Slider Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/angel-slider",
              },
              {
                label: "News Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/news",
              },
              {
                label: "Blogs Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/blogs",
              },
              {
                label: "Footer Widget",
                icon: <ViewModuleIcon />,
                path: "/dashboard/widgets/footer",
              },
              // {
              //   label: "AI Toolset Widget",
              //   icon: <SmartToyIcon />,
              //   path: "/dashboard/widgets/ai-toolset",
              // },
              // {
              //   label: "Speaker Widget",
              //   icon: <RecordVoiceOverIcon />,
              //   path: "/dashboard/widgets/speakers",
              // },
            ].map((widget) => (
              <ListItem key={widget.path} disablePadding>
                <ListItemButton
                  component={Link}
                  href={widget.path}
                  sx={{
                    borderRadius: 2,
                    gap: 1,
                    backgroundColor: isWidgetSubActive(widget.path)
                      ? "rgba(0,0,0,0.1)"
                      : "transparent",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 18,
                      "& svg": {
                        fontSize: 20, // control icon size
                      },
                    }}
                  >
                    {widget.icon}
                  </ListItemIcon>

                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: 14, // control text size
                      fontWeight: 500,
                    }}
                    primary={widget.label}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton
            component={Link}
            href="/profile"
            sx={{
              borderRadius: 2,
              backgroundColor:
                pathname === "/profile" || pathname?.startsWith("/profile/")
                  ? "#000"
                  : "transparent",
              color:
                pathname === "/profile" || pathname?.startsWith("/profile/")
                  ? "white"
                  : "#333",
              transform:
                pathname === "/profile" || pathname?.startsWith("/profile/")
                  ? "scale(1.1)"
                  : "scale(1)",
              "&:hover": {
                backgroundColor:
                  pathname === "/profile" || pathname?.startsWith("/profile/")
                    ? "#000"
                    : "rgba(255,255,255,0.1)",
                transform: "scale(1.1)",
                transition: "transform 0.2s",
              },
              py: 1.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 30,
                minHeight: 30,
                color:
                  pathname === "/profile" || pathname?.startsWith("/profile/")
                    ? "white"
                    : "#333",
                bgcolor: "white",
                borderRadius: "10px",
                p: 0.5,
                mr: 1,
              }}
            >
              <Image
                src="/assets/icons/User-Accepted.png"
                alt="Profile"
                width={20}
                height={20}
              />
            </ListItemIcon>

            <ListItemText
              primary="Profile"
              primaryTypographyProps={{
                fontSize: "0.8rem",
                fontWeight:
                  pathname === "/profile" || pathname?.startsWith("/profile/")
                    ? 600
                    : 400,
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* ================= ARTICLES ================= */}

        {user?.user_role == "SUPERADMIN" && (
          <>
            <ListItem disablePadding sx={{ mt: 2 }}>
              <ListItemButton
                onClick={handleArticlesToggle}
                sx={{
                  borderRadius: 2,
                  backgroundColor: pathname?.startsWith("/articles")
                    ? "#000"
                    : "transparent",
                  color: pathname?.startsWith("/articles") ? "#fff" : "#333",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 30,
                    bgcolor: pathname?.startsWith("/articles")
                      ? "#000"
                      : "white",
                    borderRadius: "10px",
                    p: 0.5,
                    mr: 1,
                  }}
                >
                  <ArticleIcon
                    sx={{
                      color: pathname?.startsWith("/articles")
                        ? "#fff"
                        : "#333",
                    }}
                  />
                </ListItemIcon>

                <ListItemText primary="Articles" />

                {openArticles ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openArticles} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/articles/new">
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="New Article" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/articles">
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <ArticleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="All Articles" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/articles/authors">
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Article Author" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </>
        )}
      </List>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <Box
        sx={{
          width: 250,
          height: "100vh",
          backgroundColor: "#f5f5f5",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          position: "fixed",
        }}
      >
        {sidebarContent}
      </Box>

      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen || false}
        onClose={onMobileClose}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 280 },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
