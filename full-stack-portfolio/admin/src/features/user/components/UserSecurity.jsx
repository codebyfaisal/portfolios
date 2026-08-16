import React, { useEffect, useState, useCallback } from "react";
import { FaShieldAlt, FaDesktop, FaMobileAlt, FaTabletAlt, FaClock, FaGlobe, FaSignOutAlt, FaMapMarkerAlt, FaLaptopCode } from "react-icons/fa";
import useDashboardStore from "@/store/useDashboardStore";
import toast from "react-hot-toast";
import { ConfirmationModal, Button } from "@/components";

const DeviceIcon = ({ device }) => {
  const type = (device || "").toLowerCase();
  if (type === "mobile") return <FaMobileAlt className="text-primary text-xl" />;
  if (type === "tablet") return <FaTabletAlt className="text-secondary text-xl" />;
  return <FaDesktop className="text-blue-400 text-xl" />;
};

const UserSecurity = () => {
  const { getLoginHistory, revokeSession, revokeAllOtherSessions } = useDashboardStore();
  const [history, setHistory] = useState({
    sessions: [],
    totalLogins30Days: 0,
    activeDevicesCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [confirmRevokeOther, setConfirmRevokeOther] = useState(false);
  const [selectedSessionToRevoke, setSelectedSessionToRevoke] = useState(null);

  const fetchHistory = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await getLoginHistory();
      if (data) {
        setHistory({
          sessions: Array.isArray(data.sessions) ? data.sessions : [],
          totalLogins30Days: data.totalLogins30Days ?? (data.sessions?.length || 0),
          activeDevicesCount: data.activeDevicesCount ?? (data.sessions?.filter(s => s.isActive)?.length || 0),
        });
      }
    } catch (err) {
      console.error("Failed to load security history", err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [getLoginHistory]);

  useEffect(() => {
    fetchHistory(true);

    // Refresh history every 30 seconds while page is open
    const interval = setInterval(() => {
      fetchHistory(false);
    }, 30000);

    // Send beacon notification on tab/window close
    const handleUnload = () => {
      try {
        const endpoint = "/api/v1/auth/sessions/ping-logout";
        const fullUrl = (import.meta.env.VITE_SERVER_URL || "") + endpoint;
        if (navigator.sendBeacon) {
          navigator.sendBeacon(fullUrl);
        }
      } catch (err) {
        // Ignore beacon errors on unload
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [fetchHistory]);

  const handleRevokeSingle = async () => {
    if (!selectedSessionToRevoke) return;
    try {
      await revokeSession(selectedSessionToRevoke.sessionId);
      toast.success("Device session revoked successfully");
      setSelectedSessionToRevoke(null);
      fetchHistory(true);
    } catch (err) {
      toast.error(err.message || "Failed to revoke session");
    }
  };

  const handleRevokeOthers = async () => {
    try {
      await revokeAllOtherSessions();
      toast.success("All other device sessions have been revoked");
      setConfirmRevokeOther(false);
      fetchHistory(true);
    } catch (err) {
      toast.error(err.message || "Failed to revoke sessions");
    }
  };

  const sessions = Array.isArray(history?.sessions) ? history.sessions : [];
  const activeSessions = sessions.filter((s) => s.isActive);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <FaShieldAlt className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Security & Multi-Device Sessions
              </h3>
              <p className="text-xs text-muted-foreground">
                Manage active device tokens, remote sessions, and 30-day login activity.
              </p>
            </div>
          </div>
          {activeSessions.length > 1 && (
            <Button
              uiType="danger"
              onClick={() => setConfirmRevokeOther(true)}
              className="text-xs px-4 py-2"
              icon={<FaSignOutAlt />}
              label="Revoke All Other Devices"
            />
          )}
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-background/50 border border-border/60 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">
                30-Day Logins History
              </p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {history?.totalLogins30Days || sessions.length}
              </p>
            </div>
            <FaClock className="text-3xl text-muted-foreground/30" />
          </div>

          <div className="bg-background/50 border border-border/60 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">
                Active Devices / Cookies
              </p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                {history?.activeDevicesCount || activeSessions.length || 0}
              </p>
            </div>
            <FaGlobe className="text-3xl text-green-400/30" />
          </div>
        </div>

        {/* Active Sessions List */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider text-xs flex items-center gap-2">
              <FaLaptopCode className="text-primary" />
              Active Sessions ({activeSessions.length})
            </h4>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Loading active sessions...
            </div>
          ) : activeSessions.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
              No active session recorded.
            </div>
          ) : (
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div
                  key={session._id || session.sessionId}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition-all gap-4 ${
                    session.isCurrent
                      ? "bg-primary/5 border-primary/40 shadow-sm"
                      : "bg-background/40 hover:bg-background/80 border-border/60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-card border border-border rounded-lg mt-0.5">
                      <DeviceIcon device={session.device} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground text-sm">
                          {session.device || "Desktop"} Device
                        </span>
                        {session.isCurrent ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                            This Device (Current Session)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Active Session
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="font-mono text-foreground/80">
                          IP: {session.ip}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-secondary text-[11px]" />
                          {session.location || "Localhost / Internal Network"}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground/80 truncate max-w-sm md:max-w-lg">
                        {session.userAgent}
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-border/40">
                    <span className="text-[11px] text-muted-foreground">
                      Logged in: {new Date(session.loggedInAt).toLocaleString()}
                    </span>
                    {!session.isCurrent && (
                      <button
                        onClick={() => setSelectedSessionToRevoke(session)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FaSignOutAlt size={12} />
                        Logout Device
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 30-Day Activity History List */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider text-xs">
            Full 30-Day Login Audit Log
          </h4>

          {sessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
              No login activity recorded in the last 30 days.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {sessions.map((log, index) => (
                <div
                  key={log._id || index}
                  className="flex items-center justify-between p-3 bg-background/30 hover:bg-background/70 border border-border/40 rounded-lg text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <DeviceIcon device={log.device} />
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <span>{log.device}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          ({log.ip})
                        </span>
                        <span className="text-[11px] text-secondary">
                          - {log.location}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate max-w-xs md:max-w-md">
                        {log.userAgent}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {new Date(log.loggedInAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={!!selectedSessionToRevoke}
        onClose={() => setSelectedSessionToRevoke(null)}
        onConfirm={handleRevokeSingle}
        title="Logout Device Session?"
        message={`Are you sure you want to revoke active session from ${selectedSessionToRevoke?.device || "device"} (${selectedSessionToRevoke?.ip})?`}
        confirmText="Logout Device"
        cancelText="Cancel"
        isDangerous={true}
      />

      <ConfirmationModal
        isOpen={confirmRevokeOther}
        onClose={() => setConfirmRevokeOther(false)}
        onConfirm={handleRevokeOthers}
        title="Logout All Other Devices?"
        message="This will immediately invalidate login cookies and active tokens on all other devices except this browser."
        confirmText="Revoke All Others"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
};

export default UserSecurity;
