async function handler({
    method,
    action,
    employeeData,
    shiftData,
    attendanceData,
    performanceData,
  }) {
    const session = getSession();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }
  
    if (method === "POST") {
      switch (action) {
        case "addEmployee": {
          if (!employeeData?.name || !employeeData?.role) {
            return { error: "Missing required employee data" };
          }
  
          const result = await sql`
            INSERT INTO employees (name, role, status, created_by, created_at)
            VALUES (${employeeData.name}, ${employeeData.role}, 'Active', ${session.user.id}, NOW())
            RETURNING id, name, role, status, created_at
          `;
          return { employee: result[0] };
        }
  
        case "updateEmployee": {
          if (!employeeData?.id || !employeeData?.name || !employeeData?.role) {
            return { error: "Missing required employee data" };
          }
  
          const result = await sql`
            UPDATE employees 
            SET name = ${employeeData.name}, 
                role = ${employeeData.role}, 
                status = ${employeeData.status}
            WHERE id = ${employeeData.id} 
            AND created_by = ${session.user.id}
            RETURNING id, name, role, status
          `;
          return { employee: result[0] };
        }
  
        case "assignShift": {
          if (
            !shiftData?.employeeId ||
            !shiftData?.shiftName ||
            !shiftData?.date
          ) {
            return { error: "Missing required shift data" };
          }
  
          const result = await sql`
            INSERT INTO shifts (employee_id, shift_name, shift_date, created_by)
            VALUES (${shiftData.employeeId}, ${shiftData.shiftName}, ${shiftData.date}, ${session.user.id})
            RETURNING id, employee_id, shift_name, shift_date
          `;
          return { shift: result[0] };
        }
  
        case "recordAttendance": {
          if (
            !attendanceData?.employeeId ||
            !attendanceData?.date ||
            !attendanceData?.status
          ) {
            return { error: "Missing required attendance data" };
          }
  
          const result = await sql`
            INSERT INTO attendance (employee_id, date, status, recorded_by)
            VALUES (${attendanceData.employeeId}, ${attendanceData.date}, ${attendanceData.status}, ${session.user.id})
            RETURNING id, employee_id, date, status
          `;
          return { attendance: result[0] };
        }
  
        case "updatePerformance": {
          if (
            !performanceData?.employeeId ||
            !performanceData?.score ||
            !performanceData?.date
          ) {
            return { error: "Missing required performance data" };
          }
  
          const result = await sql`
            INSERT INTO performance_metrics (employee_id, score, review_date, reviewed_by)
            VALUES (${performanceData.employeeId}, ${performanceData.score}, ${performanceData.date}, ${session.user.id})
            RETURNING id, employee_id, score, review_date
          `;
          return { performance: result[0] };
        }
  
        default:
          return { error: "Invalid action" };
      }
    }
  
    if (method === "GET") {
      const employees = await sql`
        SELECT e.*, 
          (SELECT COUNT(*) FROM attendance a WHERE a.employee_id = e.id AND a.status = 'present') as attendance_count,
          (SELECT AVG(score) FROM performance_metrics p WHERE p.employee_id = e.id) as avg_performance
        FROM employees e
        WHERE e.created_by = ${session.user.id}
        ORDER BY e.created_at DESC
      `;
  
      return { employees };
    }
  
    if (method === "DELETE") {
      if (!employeeData?.id) {
        return { error: "Employee ID required" };
      }
  
      const result = await sql`
        UPDATE employees 
        SET status = 'Inactive'
        WHERE id = ${employeeData.id} 
        AND created_by = ${session.user.id}
        RETURNING id
      `;
      return { success: !!result[0] };
    }
  
    return { error: "Method not allowed" };
  }
//   front
"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [activeTab, setActiveTab] = useState("employees");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees] = useState([
    {
      id: 1,
      name: "John Smith",
      role: "Manager",
      status: "Active",
      attendance: 98,
      performance: 95,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Cashier",
      status: "On Leave",
      attendance: 92,
      performance: 88,
    },
    {
      id: 3,
      name: "Michael Brown",
      role: "Sales Associate",
      status: "Active",
      attendance: 95,
      performance: 90,
    },
  ]);

  const [shifts] = useState([
    {
      id: 1,
      name: "Morning",
      time: "8:00 AM - 4:00 PM",
      employees: ["John Smith", "Sarah Johnson"],
    },
    {
      id: 2,
      name: "Afternoon",
      time: "4:00 PM - 12:00 AM",
      employees: ["Michael Brown"],
    },
    { id: 3, name: "Night", time: "12:00 AM - 8:00 AM", employees: [] },
  ]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-xl text-gray-600">
          Loading employee management...
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/account/signin?callbackUrl=/employees";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Employee Management
            </h1>
            <p className="text-gray-600">Manage your team efficiently</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]">
              <i className="fas fa-plus mr-2"></i>Add Employee
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("employees")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "employees"
                ? "border-b-2 border-[#357AFF] text-[#357AFF]"
                : "text-gray-500"
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab("scheduling")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "scheduling"
                ? "border-b-2 border-[#357AFF] text-[#357AFF]"
                : "text-gray-500"
            }`}
          >
            Scheduling
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "attendance"
                ? "border-b-2 border-[#357AFF] text-[#357AFF]"
                : "text-gray-500"
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`pb-4 text-sm font-medium ${
              activeTab === "performance"
                ? "border-b-2 border-[#357AFF] text-[#357AFF]"
                : "text-gray-500"
            }`}
          >
            Performance
          </button>
        </div>

        {activeTab === "employees" && (
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-4 text-left text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="pb-4 text-left text-sm font-medium text-gray-500">
                      Role
                    </th>
                    <th className="pb-4 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="pb-4 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-gray-100">
                      <td className="py-4 text-gray-800">{employee.name}</td>
                      <td className="py-4 text-gray-800">{employee.role}</td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            employee.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="mr-2 text-[#357AFF] hover:text-[#2E69DE]">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="text-red-500 hover:text-red-600">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "scheduling" && (
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="grid gap-6 md:grid-cols-3">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <h3 className="mb-2 text-lg font-medium text-gray-800">
                    {shift.name} Shift
                  </h3>
                  <p className="mb-4 text-sm text-gray-500">{shift.time}</p>
                  <div className="space-y-2">
                    {shift.employees.map((employee, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
                      >
                        {employee}
                      </div>
                    ))}
                    <button className="mt-2 w-full rounded-lg border border-[#357AFF] px-3 py-2 text-sm text-[#357AFF] hover:bg-[#357AFF] hover:text-white">
                      Assign Employee
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="space-y-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-4"
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {employee.name}
                    </div>
                    <div className="text-sm text-gray-500">{employee.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-gray-800">
                      {employee.attendance}%
                    </div>
                    <div className="text-sm text-gray-500">Attendance Rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="space-y-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">
                        {employee.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.role}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-gray-800">
                        {employee.performance}%
                      </div>
                      <div className="text-sm text-gray-500">
                        Performance Score
                      </div>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-[#357AFF]"
                      style={{ width: `${employee.performance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;