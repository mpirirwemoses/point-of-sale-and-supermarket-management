"use client";
import React, { useState, useEffect } from "react";
import {Wallet, CalendarCheck, CalendarX, Pencil} from "lucide-react";

function Employment() {
  const { data: user, loading: userLoading } = useUser();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching employees from the backend
  const fetchEmployees = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network latency
      const dummyEmployees = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          position: "Software Engineer",
          department: "IT",
          status: "Active",
          avatar: "https://via.placeholder.com/50 ",
          attendance: Array(31).fill(false), // Track attendance for 31 days
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          position: "HR Manager",
          department: "HR",
          status: "Active",
          avatar: "https://via.placeholder.com/50 ",
          attendance: Array(31).fill(false),
        },
        {
          id: 3,
          name: "Alice Johnson",
          email: "alice.johnson@example.com",
          position: "Sales Executive",
          department: "Sales",
          status: "Inactive",
          avatar: "https://via.placeholder.com/50 ",
          attendance: Array(31).fill(false),
        },
      ];
      setEmployees(dummyEmployees);
    } catch (err) {
      setError("Failed to load employees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [user]);

  // Toggle attendance for a specific day
  const toggleAttendance = (dayIndex) => {
    if (!selectedEmployee) return;

    const updatedEmployees = employees.map((employee) =>
      employee.id === selectedEmployee.id
        ? {
            ...employee,
            attendance: employee.attendance.map((attended, index) =>
              index === dayIndex ? !attended : attended
            ),
          }
        : employee
    );

    setEmployees(updatedEmployees);
  };

  if (userLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/account/signin?callbackUrl=/employees";
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            title="Add a new employee"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Add Employee
          </button>
          <a href="/dashboard" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </a>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-500">{error}</div>
      )}

      {/* Employee Table */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-4">Name</th>
                <th className="pb-4">Position</th>
                <th className="pb-4">Department</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Attendance</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200">
                        <img
                          src={employee.avatar || "/default-avatar.png"}
                          alt={`${employee.name}'s avatar`}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{employee.position}</td>
                  <td className="py-4">{employee.department}</td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-1">
                      {employee.attendance.map((attended, index) =>
                        attended ? (
                          <div
                            key={index}
                            className="h-2 w-2 rounded-full bg-green-500"
                          ></div>
                        ) : (
                          <div
                            key={index}
                            className="h-2 w-2 rounded-full bg-gray-300"
                          ></div>
                        )
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button
  onClick={() => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  }}
  className="rounded p-2 text-blue-600 hover:bg-gray-100"
  title="Edit Employee Details"
>
  <Pencil size={18} />
</button>
                    

<button
  onClick={() => {
    setSelectedEmployee(employee);
    setIsAttendanceModalOpen(true);
  }}
  className="rounded p-2 text-blue-600 hover:bg-gray-100"
  title="View Attendance"
>
  <CalendarCheck size={18} />
</button>

                     <button
  onClick={() => {
    setSelectedEmployee(employee);
    setIsLeaveModalOpen(true);
  }}
  className="rounded p-2 text-black-600 hover:bg-blue-100"
  title="Manage Leave Requests"
>
  <CalendarX size={18} />
</button>
                     <button
  onClick={() => {
    setSelectedEmployee(employee);
    setIsPayrollModalOpen(true);
  }}
  className="rounded p-2 text-gray-600 hover:bg-gray-100"
  title="Process Payroll"
>
  <Wallet size={18} />
</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Modal */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Attendance - {selectedEmployee?.name}
            </h2>
            <div className="mb-4">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => (
                  <div
                    key={i}
                    className={`flex h-10 flex-col items-center justify-center rounded border p-2 text-center ${
                      selectedEmployee?.attendance[i]
                        ? "bg-green-500 text-green-800"
                        : "bg-gray-50 text-gray-600"
                    } cursor-pointer`}
                    onClick={() => toggleAttendance(i)}
                  >
                    <div className="text-sm font-medium">{i + 1}</div>
                    {selectedEmployee?.attendance[i] && (
                      <i className="fa-solid fa-check text-green-500 mt-2"></i>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Leave Requests - {selectedEmployee?.name}
            </h2>
            <div className="mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2">Type</th>
                    <th className="pb-2">From</th>
                    <th className="pb-2">To</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Annual Leave</td>
                    <td className="py-2">2025-01-15</td>
                    <td className="py-2">2025-01-20</td>
                    <td className="py-2">
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex space-x-2">
                           <button
  onClick={() => {
   
  }}
  className="rounded p-2 text-blue-600 hover:bg-gray-100"
  title="Edit Employee Details"
>
  <Pencil size={18} />
</button>
                    

<button
  onClick={() => {
    
  }}
  className="rounded p-2 text-blue-600 hover:bg-gray-100"
  title="View Attendance"
>
  <CalendarCheck size={18} />
</button>

                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Modal */}
      {isPayrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Payroll - {selectedEmployee?.name}
            </h2>
            <div className="mb-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Basic Salary
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                    defaultValue="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Allowances
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                    defaultValue="1000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Date
                </label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsPayrollModalOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                Process Payroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mocked hooks for demonstration purposes
function useUser() {
  return {
    data: { id: 1, name: "Admin User", email: "admin@example.com" },
    loading: false,
  };
}

export default Employment;