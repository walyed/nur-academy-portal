"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const { user, updateProfile, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user, loading, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setSaving(true);

    try {
      if (email !== user?.email) {
        const result = await api.checkEmail(email);
        if (result.exists) {
          setProfileError("This email is already in use");
          setSaving(false);
          return;
        }
      }
      await updateProfile(name, email);
      setProfileMessage("Profile updated successfully");
    } catch {
      setProfileError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setSaving(true);

    try {
      await api.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordMessage("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError(
        "Failed to change password. Check your current password.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "30px" }}>⚙️ Settings</h2>

      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "20px" }}>Profile Information</h3>

        {profileMessage && (
          <div
            style={{
              color: "hsl(145 60% 35%)",
              marginBottom: "16px",
              padding: "10px",
              background: "hsl(145 60% 95%)",
              borderRadius: "6px",
            }}
          >
            {profileMessage}
          </div>
        )}
        {profileError && (
          <div
            style={{
              color: "hsl(0 70% 50%)",
              marginBottom: "16px",
              padding: "10px",
              background: "hsl(0 70% 95%)",
              borderRadius: "6px",
            }}
          >
            {profileError}
          </div>
        )}

        <form onSubmit={handleProfileUpdate}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="name-input"
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              Full Name
            </label>
            <input
              id="name-input"
              title="Full Name"
              placeholder="Enter your full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="email-input"
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              Email
            </label>
            <input
              id="email-input"
              title="Email Address"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="role-input"
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              Role
            </label>
            <input
              id="role-input"
              title="Role"
              placeholder="User role"
              type="text"
              value={user?.role || ""}
              disabled
              style={{
                width: "100%",
                background: "hsl(220 15% 95%)",
                cursor: "not-allowed",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ padding: "10px 20px" }}
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "20px" }}>Change Password</h3>

        {passwordMessage && (
          <div
            style={{
              color: "hsl(145 60% 35%)",
              marginBottom: "16px",
              padding: "10px",
              background: "hsl(145 60% 95%)",
              borderRadius: "6px",
            }}
          >
            {passwordMessage}
          </div>
        )}
        {passwordError && (
          <div
            style={{
              color: "hsl(0 70% 50%)",
              marginBottom: "16px",
              padding: "10px",
              background: "hsl(0 70% 95%)",
              borderRadius: "6px",
            }}
          >
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordChange}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="current-password"
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              Current Password
            </label>
            <input
              id="current-password"
              title="Current Password"
              placeholder="Enter current password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={{ width: "100%" }}
              autoComplete="current-password"
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="new-password"
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              New Password
            </label>
            <input
              id="new-password"
              title="New Password"
              placeholder="Enter new password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: "100%" }}
              autoComplete="new-password"
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="confirm-password"
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              title="Confirm New Password"
              placeholder="Re-enter new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: "100%" }}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ padding: "10px 20px" }}
          >
            {saving ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
