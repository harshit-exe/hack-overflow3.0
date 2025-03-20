"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  Menu,
  Search,
  ChevronDown,
  Settings,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedSidebar } from "@/components/CustomSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./style.css";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const sidebarRef = useRef(null); // Ref to store child function reference
  const searchInputRef = useRef(null);

  // Function to call toggleSidebar in child
  const handleToggleSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current(); // Calls toggleSidebar from the child
    }
  };

  const fetchNotifications = useCallback(async () => {
    // Simulating API call
    setNotifications([
      {
        id: 1,
        message: "New course available: Advanced React",
        time: "2 hours ago",
      },
      {
        id: 2,
        message: "Your mock interview is scheduled for tomorrow",
        time: "5 hours ago",
      },
      {
        id: 3,
        message: "Congratulations! You've earned a new badge",
        time: "1 day ago",
      },
    ]);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      toast.success("Logout successful!");
      router.push("/login");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent text-white">
      <EnhancedSidebar
        user={user}
        onExpandChange={setIsSidebarExpanded}
        setToggleFunction={(fn) => (sidebarRef.current = fn)}
      />
      <motion.div
        className="flex-1 flex flex-col"
        initial={false}
        animate={{
          marginLeft: isSidebarExpanded ? "256px" : "64px",
          width: isSidebarExpanded ? "calc(100% - 256px)" : "calc(100% - 64px)",
        }}
        transition={{ duration: 0.2 }}
      >
        <header className="sticky top-0 z-10 flex justify-between items-center px-6 py-3 bg-[#111111] border-b border-[#3c3c3c]">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <motion.h1
                className="logo cursor-pointer text-xl font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-[#6366F1]">D</span>ishaMarg
              </motion.h1>
            </Link>

            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "300px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="w-full h-9 pl-10 pr-4 rounded-lg bg-[#1a1a1a] text-white border border-[#3c3c3c] focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1]"
                  onBlur={() => setIsSearchOpen(false)}
                />
              </motion.div>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-[#1a1a1a]"
                      onClick={() => setIsSearchOpen(true)}
                    >
                      <Search className="h-5 w-5 text-[#9ca3af]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative rounded-full hover:bg-[#1a1a1a]"
                      >
                        <Bell className="h-5 w-5 text-[#9ca3af]" />
                        {notifications.length > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#ff4e4e] flex items-center justify-center p-0 text-xs">
                            {notifications.length}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent className="w-80 bg-[#1a1a1a] border border-[#3c3c3c] text-white">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs hover:bg-[#2a2a2a]"
                  >
                    Mark all as read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#3c3c3c]" />
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start py-3 hover:bg-[#2a2a2a] cursor-pointer"
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-[#6366F1] flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-[#9ca3af] mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-[#3c3c3c]" />
                <DropdownMenuItem className="justify-center hover:bg-[#2a2a2a]">
                  <Link
                    href="/dashboard/notifications"
                    className="text-sm text-[#6366F1]"
                  >
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/dashboard/vr-classroom" target="_blank">
              <motion.div
                className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-4 py-2 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-medium">Enter VR Classroom</span>
                <div className="bg-[#57FF31] text-black p-1.5 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-[#1a1a1a] p-1.5 rounded-lg transition-colors">
                  <Avatar className="h-8 w-8 border-2 border-[#6366F1]">
                    <AvatarImage
                      src={
                        user?.picture ||
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%209.jpg-ubJIv3OlkTThmXoVxdn2JwAFTB8vz7.jpeg"
                      }
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-gradient" />
                    <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#6366F1] text-white">
                      GS
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <span className="text-sm font-medium">
                      {isAuthenticated ? user?.name : "__"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1a1a1a] border border-[#3c3c3c] text-white">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="font-medium">
                    {isAuthenticated ? user?.name : "_"}
                  </span>
                  <span className="text-xs text-[#9ca3af]">
                    {isAuthenticated ? user?.email : "_"}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#3c3c3c]" />
                <DropdownMenuItem className="hover:bg-[#2a2a2a] cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#2a2a2a] cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#2a2a2a] cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#3c3c3c]" />
                <DropdownMenuItem className="hover:bg-[#2a2a2a] text-[#ff4e4e] cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span onClick={handleLogout}>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-[#1a1a1a]"
              onClick={handleToggleSidebar}
            >
              <Menu className="w-5 h-5 text-[#9ca3af]" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
}
