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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronRight, ChevronLeft, Menu } from "lucide-react";
// import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const navigationItems = [
  {
    "name": "Learning Hub",
    "icon": "mdi:book-open-variant",
    "color": "#60a5fa",
    "children": [
      {
        "name": "Virtual Mentor",
        "icon": "mdi:school-outline",
        "link": "/dashboard/mentor"
      },
      {
        "name": "Roadmap Generator",
        "icon": "mdi:map-outline",
        "link": "/dashboard/sidebar/learning-hub/roadmap"
      },
      {
        "name": "AI Mock Test",
        "icon": "mdi:robot-outline",
        "link": "/dashboard/sidebar/learning-hub/mocktest"
      },
      {
        "name": "Courses",
        "icon": "mdi:book-multiple-outline",
        "link": "/dashboard/sidebar/learning-hub/courses"
      }
    ]
  },
  {
    "name": "Career Development",
    "icon": "mdi:briefcase-outline",
    "color": "#4ade80",
    "children": [
      {
        "name": "Resume Builder",
        "icon": "mdi:file-document-edit-outline",
        "link": "/dashboard/sidebar/career-development/resume"
      },
      {
        "name": "Mock Interview",
        "icon": "mdi:account-voice",
        "link": "/dashboard/sidebar/career-development/mockinterview"
      },
      {
        "name": "Crash Course Generator",
        "icon": "mdi:flash-outline",
        "link": "/dashboard/sidebar/career-development/crashcourse"
      }
    ]
  },
  {
    "name": "VR Simulation",
    "icon": "mdi:virtual-reality",
    "color": "#facc15",
    "link": "/dashboard/virtual-room"
  },
  {
    "name": "Events & Webinars",
    "icon": "mdi:calendar-multiple-check",
    "color": "#fb923c",
    "link": "/dashboard/sidebar/event-webinars/events"
  },
  {
    "name": "Astrotalks",
    "icon": "mdi:podcast",
    "color": "#ff6b6b",
    "link": "/dashboard/sidebar/gamification/astrotalks"
  },
  {
    "name": "Account Settings",
    "icon": "mdi:cog-outline",
    "color": "#c084fc",
    "link": "/dashboard/sidebar/account-settings/settings"
  }
  
];

export function EnhancedSidebar({ user, onExpandChange, setToggleFunction }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const router = useRouter();
  const { logout } = useState(null);

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      toast.success("Logout successful!");
      router.push("/login");
    } else {
      toast.error(response.message);
    }
  };

  const handleItemClick = (item) => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  
    if (item.children) {
      setActiveItem(activeItem === item.name ? null : item.name);
    } else if (item.link) {
      router.push(item.link); // Redirect to the parent route
    }
  };

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
    setActiveItem(null);
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

  return (
    <motion.div
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#000000] text-white transition-all duration-100 ease-in-out z-50 border-r border-[#3c3c3c]",
        isExpanded ? "w-64" : "w-18"
      )}
      animate={{ width: isExpanded ? 256 : 64 }}
      // transition={{ duration: 0.1 }}
    >
      <div className="flex flex-col h-full ">
        <div className="p-4 pl-0 flex items-center justify-between">
          <div className="p-4 flex items-center">
            <Avatar   onClick={toggleSidebar} className="w-10 h-10 border-2 border-[#6366F1]">
              <AvatarImage src={user?.picture} alt={user?.firstName} />
              <AvatarFallback className="bg-[#2563eb] text-white">
                {user?.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-3"
              >
                <p className="text-sm font-medium text-white">
                  {user?.firstName}
                </p>
                <p className="text-xs text-[#9ca3af]">{user?.email}</p>
              </motion.div>
            )}
          </div>
          {/* {isExpanded ? (
            <Li href="/dashboard">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#6366F1] bg-clip-text text-transparent cursor-pointer"
              >
                DishaMarg
              </motion.h2>
            </Li
          ) : // <Icon icon="noto:books" className="w-8 h-8" />
          null} */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-[#374151]"
          >
            {isExpanded ? <ChevronLeft size={20} /> : null}
          </Button>
        </div>
        <Separator className=" bg-[#3c3c3c]" />
        <div className="flex-1  overflow-y-auto scrollbar-hide">
          <div className="mt-5 space-y-6 p-2">
            {navigationItems.map((item) => (
              <TooltipProvider key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={cn(
                        "flex items-center p-2 rounded-lg cursor-pointer transition-colors",
                        activeItem === item.name || hoveredItem === item.name
                          ? "bg-[#374151] text-white"
                          : "text-[#9ca3af] hover:bg-[#374151] hover:text-white"
                      )}
                      onClick={() => handleItemClick(item)}
                      onHoverStart={() => setHoveredItem(item.name)}
                      onHoverEnd={() => setHoveredItem(null)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon
                        icon={item.icon}
                        className="w-6 h-6 mr-3"
                        style={{ color: item.color }}
                      />
                      {isExpanded && (
                        <span className="text-sm">{item.name}</span>
                      )}
                      {isExpanded && activeItem === item.name && (
                        <ChevronRight className="ml-auto w-4 h-4" />
                      )}
                    </motion.div>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent
                      side="right"
                      className="bg-[#374151] text-white"
                    >
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
                {isExpanded && activeItem === item.name && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-6 mt-2 space-y-2"
                    >
                      {item.children.map((child) => (
                        <Link href={child.link} key={child.name}>
                          <motion.div
                            className="flex items-center p-2 rounded-lg text-[#9ca3af] hover:bg-[#374151] hover:text-white transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon
                              icon={child.icon}
                              className="w-5 h-5 mr-3"
                              style={{ color: item.color }}
                            />
                            <span className="text-sm">{child.name}</span>
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </TooltipProvider>
            ))}
          </div>
        </div>
        <Separator className="my-2 bg-[#3c3c3c]" />
        <div className="p-4 mb-5">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              className="w-full justify-start text-[#ff4e4e] hover:text-[#e84343] hover:bg-[#374151]"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isExpanded && <span className="text-sm">Logout</span>}
            </Button>
          </motion.div>
        </div>
        {/* <div className="p-4 flex items-center">
          <Avatar className="w-10 h-10 border-2 border-[#6366F1]">
            <AvatarImage src={user?.pic} alt={user?.username} />
            <AvatarFallback className="bg-[#2563eb] text-white">
              {user?.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ml-3"
            >
              <p className="text-sm font-medium text-white">
                {user?.firstName}
              </p>
              <p className="text-xs text-[#9ca3af]">{user?.email}</p>
            </motion.div>
          )}
        </div> */}
      </div>
    </motion.div>
  );
}
