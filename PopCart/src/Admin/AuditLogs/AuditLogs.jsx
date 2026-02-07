import { useState } from "react";
import "./AuditLogs.css";

export default function AuditLogs() {
 const [searchValue, setSearchValue] = useState("");
 const [dateValue, setDateValue] = useState("");
 const auditLogs = [
    {
      id: "LOG001",
      timestamp: "01/02/2026, 14:30:00",
      userId: "LOG001",
      userInitial: "A",
      userName: "Admin User",
      userRole: "Admin",
      actionDescription: "Deleted customer account: john.doe@example.com",
    },
    {
      id: "LOG001",
      timestamp: "01/02/2026, 14:30:00",
      userId: "LOG001",
      userInitial: "A",
      userName: "Admin User",
      userRole: "Admin",
      actionDescription: "Deleted customer account: john.doe@example.com",
    },
    {
      id: "LOG001",
      timestamp: "01/02/2026, 14:30:00",
      userId: "LOG001",
      userInitial: "A",
      userName: "Admin User",
      userRole: "Admin",
      actionDescription: "Deleted customer account: john.doe@example.com",
    },
    {
      id: "LOG001",
      timestamp: "01/02/2026, 14:30:00",
      userId: "LOG001",
      userInitial: "A",
      userName: "Admin User",
      userRole: "Admin",
      actionDescription: "Deleted customer account: john.doe@example.com",
    },
  ];

  return (
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
            <span>Select Date</span>

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
              {auditLogs.map((log, index) => (
                <div
                  key={index}
                  className="audit-logs-table-row"
                >
                  <div className="table-cell table-cell-id">
                    <div>{log.id}</div>
                  </div>

                  <div className="table-cell table-cell-timestamp">
                    <div>{log.timestamp}</div>
                  </div>

                  <div className="table-cell table-cell-userid">
                    <div className="user-avatar-container">
                      <div className="user-avatar">
                        <div>{log.userInitial}</div>
                      </div>

                      <div className="user-id-text">{log.userId}</div>
                    </div>
                  </div>

                  <div className="table-cell table-cell-role">
                    <div className="user-avatar-container">
                      <div className="user-avatar">
                        <div>{log.userInitial}</div>
                      </div>

                      <div className="user-info-container">
                        <div className="user-name">
                          <div>{log.userName}</div>
                        </div>

                        <div className="user-role">
                          <div>{log.userRole}</div>
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

  );
};




 