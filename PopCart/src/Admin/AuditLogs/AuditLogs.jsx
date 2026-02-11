import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.jsx";
import { apiUrl } from "../../utils/api.js";
import "./AuditLogs.css";
import Sidebar from "../Sidebar/SidebarA.jsx";
import Header from "../Header/HeaderA.jsx";

export default function AuditLogs() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const { logout } = useAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError("");

    const mapLog = (log) => ({
      id: log.id,
      timestamp: log.timestamp,
      userId: log.user_id,
      userRole: log.role,
      actionDescription: log.action
    });

    const fetchLogs = async () => {
      try {
        const response = await fetch(apiUrl('get_logs.php'));
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load audit logs.");
        }

        const mappedLogs = (data.logs || []).map(mapLog);
        if (isMounted) {
          setAuditLogs(mappedLogs);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError("Unable to load audit logs. Please try again.");
          setIsLoading(false);
        }
      }
    };

    let initReceived = false;
    const eventSource = new EventSource(
      apiUrl("get_logs_stream.php")
    );

    eventSource.addEventListener("init", (event) => {
      try {
        const payload = JSON.parse(event.data || "{}");
        const logs = Array.isArray(payload.logs) ? payload.logs : [];
        const mappedLogs = logs.map(mapLog);
        if (isMounted) {
          setAuditLogs(mappedLogs);
          setIsLoading(false);
          initReceived = true;
        }
      } catch (error) {
        if (isMounted) {
          setLoadError("Unable to load audit logs. Please try again.");
          setIsLoading(false);
        }
      }
    });

    eventSource.addEventListener("log", (event) => {
      try {
        const log = JSON.parse(event.data || "{}");
        const mappedLog = mapLog(log);
        if (isMounted) {
          setAuditLogs((prevLogs) => {
            if (prevLogs.some((item) => item.id === mappedLog.id)) {
              return prevLogs;
            }
            return [...prevLogs, mappedLog];
          });
        }
      } catch (error) {
        // Ignore malformed log events
      }
    });

    eventSource.onerror = () => {
      if (!initReceived) {
        eventSource.close();
        fetchLogs();
        return;
      }
      if (isMounted) {
        setLoadError("Unable to load audit logs. Please try again.");
        setIsLoading(false);
      }
    };

    const initFallback = setTimeout(() => {
      if (!initReceived) {
        eventSource.close();
        fetchLogs();
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(initFallback);
      eventSource.close();
    };
  }, []);

  const getUserInitial = (role) => {
    if (!role || typeof role !== "string") {
      return "?";
    }
    return role.trim().charAt(0).toUpperCase();
  };

  const formatUserRole = (role) => {
    if (!role || typeof role !== "string") {
      return "";
    }
    const normalized = role.trim().replace(/_/g, " ");
    if (normalized.toLowerCase() === "superadmin" || normalized.toLowerCase() === "super admin") {
      return "Super Admin";
    }
    return normalized
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const normalizeDate = (timestamp) => {
    if (!timestamp || typeof timestamp !== "string") {
      return "";
    }
    const parts = timestamp.split(" ");
    if (parts.length > 0) {
      return parts[0];
    }
    return timestamp.split("T")[0] || "";
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) {
      return "Select Date";
    }
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const [year, month, day] = dateString.split("-");
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex]} ${parseInt(day, 10)}, ${year}`;
  };

  const filteredLogs = auditLogs.filter((log) => {
    const searchTerm = searchValue.trim().toLowerCase();
    const matchesSearch = !searchTerm || [
      String(log.id),
      String(log.userId),
      String(log.userRole || ""),
      String(log.actionDescription || ""),
      String(log.timestamp || "")
    ].some((value) => value.toLowerCase().includes(searchTerm));

    const matchesDate = !dateValue || normalizeDate(log.timestamp) === dateValue;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="admin-layout">
          <Header className="admin-header" />
          <div className="admin-content-wrapper">
            <Sidebar className="admin-sidebar" onSignOutClick={() => setShowSignOutModal(true)} />
            <main className="admin-main-content">
    <div className="audit-logs-container">
      <header className="audit-logs-header">
        <div className="audit-logs-header-title">
          <h1>Audit Logs</h1>
        </div>

        <div className="audit-logs-header-subtitle">
          <p>Track all system activities and changes</p>
        </div>
      </header>

      <div className="audit-logs-controls">
        <div className="audit-logs-search-container">
          <label htmlFor="search-logs" className="sr-only">
            Search logs
          </label>
          <input
            id="search-logs"
            placeholder="Search logs"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="Search logs"
          />

          <div
            className="search-icon"
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 13.9998L11.1067 11.1064" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#99A1AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="audit-logs-date-picker-container">
          <label
            htmlFor="date-picker"
            className="audit-logs-date-picker-label"
          >
            <span>{formatDateDisplay(dateValue)}</span>

            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.25 8.25H6.75V9.75H5.25V8.25ZM5.25 11.25H6.75V12.75H5.25V11.25ZM8.25 8.25H9.75V9.75H8.25V8.25ZM8.25 11.25H9.75V12.75H8.25V11.25ZM11.25 8.25H12.75V9.75H11.25V8.25ZM11.25 11.25H12.75V12.75H11.25V11.25Z" fill="#0A0A0A"/>
              <path d="M3.75 16.5H14.25C15.0773 16.5 15.75 15.8273 15.75 15V4.5C15.75 3.67275 15.0773 3 14.25 3H12.75V1.5H11.25V3H6.75V1.5H5.25V3H3.75C2.92275 3 2.25 3.67275 2.25 4.5V15C2.25 15.8273 2.92275 16.5 3.75 16.5ZM14.25 6L14.2507 15H3.75V6H14.25Z" fill="#0A0A0A"/>
            </svg>
          </label>
          <input
            id="date-picker"
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            aria-label="Select date"
          />
        </div>
      </div>

      <div className="audit-logs-table-wrapper">
        <div className="audit-logs-table-container">
          <div className="audit-logs-table">
            <div className="audit-logs-table-header">
              <div className="audit-logs-table-header-content">
                <div className="table-header-cell table-header-cell-id">
                  <div>ID</div>
                </div>

                <div className="table-header-cell table-header-cell-timestamp">
                  <div>Timestamp</div>
                </div>

                <div className="table-header-cell table-header-cell-userid">
                  <div>User ID</div>
                </div>

                <div className="table-header-cell table-header-cell-role">
                  <div>User Role</div>
                </div>

                <div className="table-header-cell table-header-cell-action">
                  <div>Action Description</div>
                </div>
              </div>
            </div>

            <div className="audit-logs-table-body">
              {isLoading && (
                <div className="audit-logs-table-row">
                  <div className="table-cell table-cell-action">
                    <div>Loading audit logs...</div>
                  </div>
                </div>
              )}

              {!isLoading && loadError && (
                <div className="audit-logs-table-row">
                  <div className="table-cell table-cell-action">
                    <div>{loadError}</div>
                  </div>
                </div>
              )}

              {!isLoading && !loadError && filteredLogs.length === 0 && (
                <div className="audit-logs-table-row">
                  <div className="table-cell table-cell-action">
                    <div>No audit logs found.</div>
                  </div>
                </div>
              )}

              {!isLoading && !loadError && filteredLogs.map((log, index) => (
                <div key={`${log.id}-${index}`} className="audit-logs-table-row">
                  <div className="table-cell table-cell-id">
                    <div>{log.id}</div>
                  </div>

                  <div className="table-cell table-cell-timestamp">
                    <div>{log.timestamp}</div>
                  </div>

                  <div className="table-cell table-cell-userid">
                    <div className="user-avatar-container">
                      <div className="user-id-text">{log.userId}</div>
                    </div>
                  </div>

                  <div className="table-cell table-cell-role">
                    <div className="user-avatar-container">
                      <div className="user-avatar">
                        <div>{getUserInitial(log.userRole)}</div>
                      </div>

                      <div className="user-info-container">
                        <div className="user-name">
                          <div>{formatUserRole(log.userRole)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table-cell table-cell-action">
                    <div>{log.actionDescription}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
    </div>

    {showSignOutModal && (
        <div className="modal-overlay">
          <div className="signout-modal">
            <h3>Sign Out</h3>
            <p>Are you sure you want to sign out?</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowSignOutModal(false)}>Cancel</button>
              <button
                className="confirm-btn"
                onClick={async () => {
                  await logout();
                  setShowSignOutModal(false);
                  navigate("/signin");
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


  );
};




 