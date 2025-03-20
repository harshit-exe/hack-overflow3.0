"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedSidebar } from "@/components/CustomSidebar";
import "./style.css";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";


  
  export default function DashboardLayout({ children }) {
    const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const sidebarRef = useRef(null); // Ref to store child function reference

  // Function to call toggleSidebar in child
  const handleToggleSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current(); // Calls toggleSidebar from the child
    }
  };

  const fetchNotifications = useCallback(async () => {
    // Simulating API call
    setNotifications([
      { id: 1, message: "New course available: Advanced React" },
      { id: 2, message: "Your mock interview is scheduled for tomorrow" },
      { id: 3, message: "Congratulations! You've earned a new badge" },
    ]);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleVideoCall = () => {
    window.open("h", "_blank");
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
        transition={{ duration: 0.1 }}
      >
        {/* <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#3c3c3c] bg-[#191919] px-6">
          <h1 className="text-xl font-semibold">
            <span className="text-[#6366F1]">S</span>hikshaVerse
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-[#9ca3af] hover:text-white transition-colors" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#ff4e4e]" />
              )}
            </Button>
            <Button
              variant="default"
              className="bg-gradient-to-r from-[#60a5fa] to-[#6366F1] text-white hover:from-[#4F46E5] hover:to-[#6366F1] transition-all duration-300"
              onClick={handleVideoCall}
            >
              Join Metaverse
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </header> */}
        <header className="flex justify-between items-center px-6 py-4">
        <Link href="/dashboard">
      <h1 className="logo cursor-pointer">
        <span className="text-[#6366F1]">D</span>ishaMarg
      </h1>
    </Link>
          <div className="flex items-center gap-4">
            <Link href='h' target="_blank" className="flex items-center gap-2 bg-gray-800 text-white px-7 py-1 pr-1 rounded-full">
              Enter VR Classroom
              <div className="bg-[#57FF31] text-black p-3 pt-3 pb-3 pl-1f rounded-full text-3xl font-bold">
                <ArrowUpRight className="ml-1 m-1" />
              </div>
            </Link>

            <button
              className="p-2 hover:bg-[#191919] rounded-full transition-colors"
              onClick={() => {
                handleToggleSidebar();
                // setIsSidebarExpanded(!isSidebarExpanded)
              }}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
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
        {/* <Footer /> */}
      </motion.div>
    </div>
  );
}
