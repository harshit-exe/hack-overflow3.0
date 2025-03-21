"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronLeft, ChevronDown, Search } from "lucide-react";
// import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

// Updated navigation items with links for parent items
const navigationItems = [
  {
    name: "Course Path",
    icon: "mdi:book-open-variant",
    color: "#60a5fa",
    link: "/dashboard/path", // Added link for parent item
    children: [
      {
        name: "Virtual Mentor",
        icon: "mdi:account-school",
        link: "/dashboard/mentor",
      },
      {
        name: "AI Generated Roadmap",
        icon: "mdi:map-outline",
        link: "/dashboard/path/roadmap",
      },
      {
        name: "AI Powered Course Recommender",
        icon: "mdi:robot-outline",
        link: "/dashboard/path/course-recommender",
      },
    ],
  },
  {
    name: "Skill Prepare",
    icon: "mdi:briefcase-outline",
    color: "#4ade80",
    link: "/dashboard/skill", // Added link for parent item
    children: [
      {
        name: "Resume",
        icon: "mdi:file-document-edit-outline",
        link: "/dashboard/skill/resume", // Added link for parent item
        children: [
          {
            name: "Builder",
            icon: "mdi:file-document-plus",
            link: "/dashboard/skill/resume/resume-builder",
          },
          {
            name: "Cover Letter",
            icon: "mdi:file-document-edit",
            link: "/dashboard/skill/resume/cover-letter",
          },
          {
            name: "Blockchain",
            icon: "mdi:cube-outline",
            link: "/dashboard/skill/resume/blockchain",
          },
          {
            name: "Project Recommender",
            icon: "mdi:lightbulb-outline",
            link: "/dashboard/skill/resume/project-recommender",
          },
        ],
      },
      {
        name: "Preparation",
        icon: "mdi:notebook-outline",
        link: "/dashboard/skill/preparation", // Added link for parent item
        children: [
          {
            name: "Mock Interview",
            icon: "mdi:account-voice",
            link: "/dashboard/skill/preparation/interview",
          },
          {
            name: "Mock Test",
            icon: "mdi:clipboard-text-outline",
            link: "/dashboard/skill/preparation/mocktest",
          },
        ],
      },
      {
        name: "Job Simulation",
        icon: "mdi:virtual-reality",
        link: "/dashboard/skill/jobsimulation", // Added link for parent item
        
      },
    ],
  },
  {
    name: "Job",
    icon: "mdi:briefcase-search",
    color: "#facc15",
    link: "/dashboard/job", // Added link for parent item
    children: [
      {
        name: "Trend and Salary",
        icon: "mdi:trending-up",
        link: "/dashboard/trends",
      },
      {
        name: "Job Opening",
        icon: "mdi:door-open",
        link: "/dashboard/job-openings",
      },
      {
        name: "Events and Updates",
        icon: "mdi:calendar-clock",
        link: "/dashboard/events",
      },
    ],
  },
  {
    name: "Settings",
    icon: "mdi:cog-outline",
    color: "#c084fc",
    link: "/dashboard/settings",
  },
];

export function EnhancedSidebar({ user, onExpandChange, setToggleFunction }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  // Function to check if a path is active
  const isPathActive = (path) => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Initialize active items based on current path
  useEffect(() => {
    if (!pathname) return;

    // Find which navigation item matches the current path
    for (const item of navigationItems) {
      if (item.link && isPathActive(item.link)) {
        setActiveItem(item.name);

        if (item.children) {
          for (const child of item.children) {
            if (child.link && isPathActive(child.link)) {
              setActiveSubItem(child.name);
              return;
            }

            if (child.children) {
              for (const subChild of child.children) {
                if (subChild.link && isPathActive(subChild.link)) {
                  setActiveSubItem(child.name);
                  return;
                }
              }
            }
          }
        }
        return;
      }
    }
  }, [pathname]);

  const handleLogout = async () => {
    const response = await logout();
    if (response?.success) {
      toast.success("Logout successful!");
      router.push("/login");
    } else {
      toast.error(response?.message || "Logout failed");
    }
  };

  // Handle clicking on a parent item
  const handleItemClick = (item, event) => {
    if (!isExpanded) {
      setIsExpanded(true);
    }

    // If the item has children, toggle the dropdown
    if (item.children) {
      // If the dropdown arrow is clicked, only toggle the dropdown
      if (event.target.closest(".dropdown-arrow")) {
        event.preventDefault();
        setActiveItem(activeItem === item.name ? null : item.name);
        return;
      }

      // If the item itself is clicked (not the arrow), navigate to its link
      if (item.link) {
        router.push(item.link);
      }

      // Always open the dropdown when clicking on the item
      setActiveItem(item.name);
    } else if (item.link) {
      // If the item has no children, just navigate to its link
      router.push(item.link);
    }
  };

  // Handle clicking on a child item
  const handleSubItemClick = (subItem, event) => {
    event.stopPropagation();

    // If the dropdown arrow is clicked, only toggle the dropdown
    if (event.target.closest(".dropdown-arrow")) {
      event.preventDefault();
      setActiveSubItem(activeSubItem === subItem.name ? null : subItem.name);
      return;
    }

    // If the item has children, toggle the dropdown and navigate to its link
    if (subItem.children) {
      if (subItem.link) {
        router.push(subItem.link);
      }
      setActiveSubItem(activeSubItem === subItem.name ? null : subItem.name);
    } else if (subItem.link) {
      // If the item has no children, just navigate to its link
      router.push(subItem.link);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
    onExpandChange(!isExpanded);
  };

  useEffect(() => {
    if (setToggleFunction) {
      setToggleFunction(toggleSidebar);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
        onExpandChange(false);
      } else {
        setIsExpanded(true);
        onExpandChange(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onExpandChange]);

  // Filter navigation items based on search query
  const filteredItems = searchQuery
    ? navigationItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.children &&
            item.children.some(
              (child) =>
                child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (child.children &&
                  child.children.some((subChild) =>
                    subChild.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  ))
            ))
      )
    : navigationItems;

  return (
    <motion.div
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#000000] text-white transition-all duration-200 ease-in-out z-50 border-r border-[#3c3c3c]",
        isExpanded ? "w-64" : "w-16"
      )}
      animate={{ width: isExpanded ? 256 : 64 }}
      style={{
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar
              onClick={toggleSidebar}
              className="w-10 h-10 border-2 border-[#6366F1] cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#6366F1] text-white">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="ml-3"
              >
                <p className="text-sm font-medium text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-[#9ca3af]">
                  {user?.email || "user@example.com"}
                </p>
              </motion.div>
            )}
          </div>
          {isExpanded && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-white hover:bg-[#374151] rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={18} />
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-10 pr-4 rounded-lg bg-[#111111] text-white border border-[#3c3c3c] focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
              />
            </div>
          </div>
        )}

        <Separator className="bg-[#3c3c3c] my-2" />

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="mt-2 space-y-1 p-2">
            {filteredItems.map((item) => (
              <TooltipProvider key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <motion.div
                        className={cn(
                          "flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-200",
                          activeItem === item.name
                            ? "bg-[#1a1a1a] text-white border-l-2 border-l-[#6366F1]"
                            : hoveredItem === item.name
                            ? "bg-[#1a1a1a] text-white"
                            : "text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-white"
                        )}
                        onClick={(e) => handleItemClick(item, e)}
                        onHoverStart={() => setHoveredItem(item.name)}
                        onHoverEnd={() => setHoveredItem(null)}
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg mr-3",
                            activeItem === item.name
                              ? "bg-gradient-to-br from-black to-[#1a1a1a]"
                              : ""
                          )}
                        >
                          <Icon
                            icon={item.icon}
                            className={cn(
                              "w-5 h-5 transition-transform",
                              activeItem === item.name ? "scale-110" : ""
                            )}
                            style={{ color: item.color }}
                          />
                        </div>
                        {isExpanded && (
                          <span className="text-sm flex-1 font-medium">
                            {item.name}
                          </span>
                        )}
                        {isExpanded && item.children && (
                          <div
                            className="dropdown-arrow p-1 rounded-full hover:bg-[#2a2a2a] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveItem(
                                activeItem === item.name ? null : item.name
                              );
                            }}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-300 ${
                                activeItem === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent
                      side="right"
                      className="bg-[#1a1a1a] text-white border border-[#3c3c3c]"
                    >
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
                {isExpanded && activeItem === item.name && item.children && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 mt-1 space-y-1 pl-4 border-l border-[#3c3c3c]"
                    >
                      {item.children.map((child) => (
                        <div key={child.name}>
                          <div className="relative">
                            {child.children ? (
                              <motion.div
                                className={cn(
                                  "flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200",
                                  activeSubItem === child.name
                                    ? "bg-[#1a1a1a] text-white"
                                    : "text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-white"
                                )}
                                whileHover={{ scale: 1.02, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => handleSubItemClick(child, e)}
                              >
                                <div className="flex items-center justify-center w-6 h-6 rounded-md mr-3">
                                  <Icon
                                    icon={child.icon}
                                    className="w-4 h-4"
                                    style={{ color: item.color }}
                                  />
                                </div>
                                <span className="text-sm flex-1">
                                  {child.name}
                                </span>
                                <div
                                  className="dropdown-arrow p-1 rounded-full hover:bg-[#2a2a2a] transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSubItem(
                                      activeSubItem === child.name
                                        ? null
                                        : child.name
                                    );
                                  }}
                                >
                                  <ChevronDown
                                    className={`w-3 h-3 transition-transform duration-300 ${
                                      activeSubItem === child.name
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </div>
                              </motion.div>
                            ) : (
                              <Link href={child.link}>
                                <motion.div
                                  className={cn(
                                    "flex items-center p-2 rounded-lg transition-all duration-200",
                                    isPathActive(child.link)
                                      ? "bg-[#1a1a1a] text-white"
                                      : "text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-white"
                                  )}
                                  whileHover={{ scale: 1.02, x: 2 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="flex items-center justify-center w-6 h-6 rounded-md mr-3">
                                    <Icon
                                      icon={child.icon}
                                      className="w-4 h-4"
                                      style={{ color: item.color }}
                                    />
                                  </div>
                                  <span className="text-sm">{child.name}</span>
                                </motion.div>
                              </Link>
                            )}
                          </div>

                          {/* Third level navigation */}
                          {child.children && activeSubItem === child.name && (
                            <AnimatePresence>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-4 mt-1 space-y-1 pl-3 border-l border-[#3c3c3c]"
                              >
                                {child.children.map((subChild) => (
                                  <Link
                                    href={subChild.link}
                                    key={subChild.name}
                                  >
                                    <motion.div
                                      className={cn(
                                        "flex items-center p-1.5 rounded-lg transition-all duration-200",
                                        isPathActive(subChild.link)
                                          ? "bg-[#1a1a1a] text-white"
                                          : "text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-white"
                                      )}
                                      whileHover={{ scale: 1.02, x: 2 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className="flex items-center justify-center w-5 h-5 rounded-md mr-2">
                                        <Icon
                                          icon={subChild.icon}
                                          className="w-3.5 h-3.5"
                                          style={{ color: item.color }}
                                        />
                                      </div>
                                      <span className="text-xs">
                                        {subChild.name}
                                      </span>
                                    </motion.div>
                                  </Link>
                                ))}
                              </motion.div>
                            </AnimatePresence>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </TooltipProvider>
            ))}
          </div>
        </div>
        <Separator className="my-2 bg-[#3c3c3c]" />
        <div className="p-4 mb-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="overflow-hidden rounded-lg bg-gradient-to-r from-[#1a1a1a] to-[#111111] hover:from-[#111111] hover:to-[#1a1a1a]"
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-[#ff4e4e] hover:text-[#ff6b6b] hover:bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isExpanded && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
