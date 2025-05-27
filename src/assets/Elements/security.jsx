async function handler({
    method,
    action,
    data,
    userId,
    resourceType,
    resourceId,
  }) {
    const session = getSession();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }
  
    if (method === "POST") {
      switch (action) {
        case "logActivity": {
          if (!data?.action || !data?.details) {
            return { error: "Missing required activity data" };
          }
  
          const values = [
            session.user.id,
            data.action,
            data.details,
            data.ipAddress || null,
            data.userAgent || null,
            "normal",
            new Date(),
          ];
  
          const result = await sql(
            "INSERT INTO security_logs (user_id, action, details, ip_address, user_agent, severity, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
            values
          );
  
          return { logId: result[0].id };
        }
  
        case "flagSuspiciousActivity": {
          if (!data?.type || !data?.details) {
            return { error: "Missing suspicious activity details" };
          }
  
          const values = [
            session.user.id,
            data.type,
            data.details,
            data.ipAddress || null,
            "high",
            new Date(),
          ];
  
          await sql(
            "INSERT INTO security_alerts (user_id, alert_type, details, ip_address, severity, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
            values
          );
  
          return { success: true };
        }
  
        case "checkAccess": {
          if (!resourceType || !resourceId) {
            return { error: "Missing resource information" };
          }
  
          const values = [session.user.id, resourceType, resourceId];
  
          const access = await sql(
            "SELECT permission_level FROM access_controls WHERE user_id = $1 AND resource_type = $2 AND resource_id = $3",
            values
          );
  
          return {
            hasAccess: access.length > 0,
            level: access[0]?.permission_level,
          };
        }
  
        case "generateAuditReport": {
          const { startDate, endDate, type } = data || {};
          if (!startDate || !endDate || !type) {
            return { error: "Missing report parameters" };
          }
  
          const values = [startDate, endDate, type];
  
          const logs = await sql(
            "SELECT * FROM security_logs WHERE created_at BETWEEN $1 AND $2 AND action = $3 ORDER BY created_at DESC",
            values
          );
  
          const alerts = await sql(
            "SELECT * FROM security_alerts WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at DESC",
            values
          );
  
          return {
            logs,
            alerts,
            generatedAt: new Date(),
            reportType: type,
          };
        }
  
        default:
          return { error: "Invalid action" };
      }
    }
  
    if (method === "GET") {
      const recentLogs = await sql(
        "SELECT * FROM security_logs WHERE created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC LIMIT 100"
      );
  
      const activeAlerts = await sql(
        "SELECT * FROM security_alerts WHERE created_at > NOW() - INTERVAL '24 hours' AND severity = 'high' ORDER BY created_at DESC"
      );
  
      return {
        recentLogs,
        activeAlerts,
        timestamp: new Date(),
      };
    }
  
    return { error: "Method not allowed" };
//   frontend
"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("activity");
  const [timeRange, setTimeRange] = useState("24h");
  const [securityData, setSecurityData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const response = await fetch("/api/security", { method: "GET" });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setSecurityData(data);
      } catch (err) {
        console.error("Failed to fetch security data:", err);
        setError("Failed to load security information");
      }
    };

    const interval = setInterval(fetchSecurityData, 30000);
    fetchSecurityData();

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-xl text-gray-600">
          Loading security dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/account/signin?callbackUrl=/security";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Security Dashboard
            </h1>
            <p className="text-gray-600">Monitor and manage system security</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "activity"
                ? "border-b-2 border-[#357AFF] text-[#357AFF]"
                : "text-gray-500"
            }`}
          >
            Real-time Activity
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "audit"
                ? "border-b-2 border-[#357AFF] text-[#357AFF]"
                : "text-gray-500"
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "alerts"
                ? "border-b-2 border-[#357AFF] text-[#357AFF]"
                : "text-gray-500"
            }`}
          >
            Security Alerts
          </button>
          <button
            onClick={() => setActiveTab("access")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "access"
                ? "border-b-2 border-[#357AFF] text-[#357AFF]"
                : "text-gray-500"
            }`}
          >
            Access Control
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-500">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-2 text-sm text-gray-500">Active Sessions</div>
            <div className="text-2xl font-bold text-gray-800">
              {securityData?.recentLogs?.length || 0}
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-2 text-sm text-gray-500">Security Alerts</div>
            <div className="text-2xl font-bold text-red-500">
              {securityData?.activeAlerts?.length || 0}
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-2 text-sm text-gray-500">System Status</div>
            <div className="text-2xl font-bold text-green-500">Protected</div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-2 text-sm text-gray-500">Last Updated</div>
            <div className="text-lg font-medium text-gray-800">
              {securityData?.timestamp
                ? new Date(securityData.timestamp).toLocaleTimeString()
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">
          {activeTab === "activity" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Activity
              </h2>
              {securityData?.recentLogs?.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 py-4"
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {log.action}
                    </div>
                    <div className="text-sm text-gray-500">{log.details}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                Security Alerts
              </h2>
              {securityData?.activeAlerts?.map((alert, index) => (
                <div key={index} className="rounded-lg bg-red-50 p-4">
                  <div className="font-medium text-red-700">
                    {alert.alert_type}
                  </div>
                  <div className="text-sm text-red-600">{alert.details}</div>
                  <div className="mt-2 text-xs text-red-500">
                    {new Date(alert.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Audit Log</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="pb-4 text-sm font-medium text-gray-500">
                        Time
                      </th>
                      <th className="pb-4 text-sm font-medium text-gray-500">
                        Action
                      </th>
                      <th className="pb-4 text-sm font-medium text-gray-500">
                        Details
                      </th>
                      <th className="pb-4 text-sm font-medium text-gray-500">
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityData?.recentLogs?.map((log, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 text-sm text-gray-800">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="py-4 text-sm text-gray-800">
                          {log.action}
                        </td>
                        <td className="py-4 text-sm text-gray-800">
                          {log.details}
                        </td>
                        <td className="py-4 text-sm text-gray-800">
                          {log.ip_address}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "access" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                Access Control
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-4 font-medium text-gray-800">
                    Active Users
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Administrators</span>
                      <span className="font-medium text-gray-800">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Security Officers</span>
                      <span className="font-medium text-gray-800">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Standard Users</span>
                      <span className="font-medium text-gray-800">24</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-4 font-medium text-gray-800">
                    Recent Access Changes
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      No recent changes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;