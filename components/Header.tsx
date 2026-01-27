"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { MessageCircle } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchUnread = () => {
        api
          .getUnreadCount()
          .then((data) => setUnreadCount(data.count))
          .catch(() => {});
      };
      fetchUnread();
      const interval = setInterval(fetchUnread, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    return user.role === "student" ? "/student-dashboard" : "/tutor-dashboard";
  };

  return (
    <header
      style={{
        background: "white",
        borderBottom: "1px solid hsl(220 15% 85%)",
        padding: "16px 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Link href={getDashboardLink()} style={{ textDecoration: "none" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              color: "hsl(210 60% 45%)",
              fontWeight: 700,
            }}
          >
            📚 Nur Academy
          </h1>
        </Link>

        <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {user ? (
            <>
              <span style={{ color: "hsl(220 10% 50%)" }}>
                Welcome,{" "}
                <strong style={{ color: "hsl(220 20% 20%)" }}>
                  {user.name}
                </strong>
                {user.role && (
                  <span
                    style={{
                      marginLeft: "4px",
                      fontSize: "12px",
                      color: "hsl(210 60% 45%)",
                    }}
                  >
                    ({user.role})
                  </span>
                )}
              </span>
              <Link
                href="/chat"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <MessageCircle size={20} />
                Chat
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      background: "hsl(0 70% 50%)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      minWidth: "18px",
                      textAlign: "center",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/settings">Settings</Link>
              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{ padding: "8px 16px" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">
                <button style={{ padding: "8px 20px" }}>Sign Up</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
