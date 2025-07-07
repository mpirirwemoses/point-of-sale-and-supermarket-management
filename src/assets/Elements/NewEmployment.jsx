"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Wallet, CalendarCheck, CalendarX, Pencil, Plus, ChevronDown, Search, Filter, X, Check, Clock, UserPlus, FileText, DollarSign, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Employment = () => {
  const [user, setUser] = useState(true); // Simulate user always logged in
  const userLoading = false;
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeTab, setActiveTab] = useState("details");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    position: "",
    department: "IT",
    status: "Active",
  });

  // Departments for filter dropdown
  const departments = useMemo(() => ["All", "IT", "HR", "Sales", "Marketing", "Finance"], []);
  const statusOptions = useMemo(() => ["All", "Active", "Inactive", "On Leave"], []);

  // Simulate fetching employees from the backend
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency
      const dummyEmployees = [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          position: "Senior Software Engineer",
          department: "IT",
          status: "Active",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          attendance: Array(31).fill(false).map((_, i) => i % 5 !== 0), // 80% attendance
          salary: 8500,
          joinDate: "2022-03-15",
          skills: ["React", "TypeScript", "Node.js"],
          leaves: [
            {
              id: 1,
              type: "Annual Leave",
              startDate: "2025-01-15",
              endDate: "2025-01-20",
              status: "Approved",
              reason: "Family vacation"
            }
          ]
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          position: "HR Manager",
          department: "HR",
          status: "Active",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          attendance: Array(31).fill(true), // 100% attendance
          salary: 7500,
          joinDate: "2021-06-10",
          skills: ["Recruitment", "Employee Relations", "Training"],
          leaves: []
        },
        {
          id: 3,
          name: "Alice Johnson",
          email: "alice.johnson@example.com",
          position: "Sales Executive",
          department: "Sales",
          status: "Inactive",
          avatar: "https://randomuser.me/api/portraits/women/68.jpg",
          attendance: Array(31).fill(false).map((_, i) => i % 3 === 0), // 33% attendance
          salary: 6500,
          joinDate: "2023-01-20",
          skills: ["Negotiation", "CRM", "Client Management"],
          leaves: [
            {
              id: 2,
              type: "Sick Leave",
              startDate: "2025-02-01",
              endDate: "2025-02-05",
              status: "Approved",
              reason: "Flu"
            }
          ]
        },
        {
          id: 4,
          name: "Robert Chen",
          email: "robert.chen@example.com",
          position: "Marketing Specialist",
          department: "Marketing",
          status: "Active",
          avatar: "https://randomuser.me/api/portraits/men/75.jpg",
          attendance: Array(31).fill(false).map((_, i) => i % 7 !== 0), // 85% attendance
          salary: 7000,
          joinDate: "2022-11-05",
          skills: ["Digital Marketing", "SEO", "Content Creation"],
          leaves: []
        },
        {
          id: 5,
          name: "Emily Wilson",
          email: "emily.wilson@example.com",
          position: "Financial Analyst",
          department: "Finance",
          status: "On Leave",
          avatar: "https://randomuser.me/api/portraits/women/63.jpg",
          attendance: Array(31).fill(false).map((_, i) => i < 15), // 50% attendance
          salary: 8000,
          joinDate: "2021-09-12",
          skills: ["Financial Modeling", "Excel", "Data Analysis"],
          leaves: [
            {
              id: 3,
              type: "Maternity Leave",
              startDate: "2025-03-01",
              endDate: "2025-08-31",
              status: "Approved",
              reason: "Maternity"
            }
          ]
        }
      ];
      setEmployees(dummyEmployees);
      setFilteredEmployees(dummyEmployees);
    } catch (err) {
      setError("Failed to load employees. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter employees based on search term, department, and status
  useEffect(() => {
    let result = employees;
    
    if (searchTerm) {
      result = result.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedDepartment !== "All") {
      result = result.filter(emp => emp.department === selectedDepartment);
    }
    
    if (selectedStatus !== "All") {
      result = result.filter(emp => emp.status === selectedStatus);
    }
    
    setFilteredEmployees(result);
  }, [searchTerm, selectedDepartment, selectedStatus, employees]);

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
    setSelectedEmployee({
      ...selectedEmployee,
      attendance: selectedEmployee.attendance.map((attended, index) =>
        index === dayIndex ? !attended : attended
      ),
    });
  };

  // Calculate attendance percentage
  const calculateAttendancePercentage = (attendance) => {
    const presentDays = attendance.filter(Boolean).length;
    return Math.round((presentDays / attendance.length) * 100);
  };

  // Handle adding a new employee
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.position) {
      setError("Please fill all required fields");
      return;
    }
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const employeeToAdd = {
      id: newId,
      name: newEmployee.name || "",
      email: newEmployee.email || "",
      position: newEmployee.position || "",
      department: newEmployee.department || "IT",
      status: newEmployee.status || "Active",
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
      attendance: Array(31).fill(true),
      salary: 5000,
      joinDate: new Date().toISOString().split('T')[0],
      skills: [],
      leaves: []
    };
    setEmployees([...employees, employeeToAdd]);
    setIsAddModalOpen(false);
    setNewEmployee({
      name: "",
      email: "",
      position: "",
      department: "IT",
      status: "Active",
    });
  };

  // Handle editing an employee
  const handleEditEmployee = () => {
    if (!selectedEmployee) return;
    const updatedEmployees = employees.map(emp => 
      emp.id === selectedEmployee.id ? selectedEmployee : emp
    );
    setEmployees(updatedEmployees);
    setIsEditModalOpen(false);
  };

  if (userLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // router.push("/account/signin?callbackUrl=/employees");
    window.location.href = "/account/signin?callbackUrl=/employees";
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Employee Management</h1>
          <p className="text-gray-600">Manage your team members efficiently</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-200"
          >
            <BarChart2 size={18} />
            <span>View Stats</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <UserPlus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-3 pr-8 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "All" ? "All Departments" : dept}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="relative">
          <select
            className="w-full appearance-none rounded-lg border border-gray-300 py-2 pl-3 pr-8 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All Statuses" : status}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <X className="mr-2 h-5 w-5" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-800 hover:text-red-900">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Employee Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm font-medium text-gray-500">
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Position</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Attendance</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            src={employee.avatar}
                            alt={`${employee.name}'s avatar`}
                            className="h-full w-full rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-gray-900">{employee.position}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {employee.department}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          employee.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : employee.status === "Inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-2 text-sm font-medium">
                          {calculateAttendancePercentage(employee.attendance)}%
                        </div>
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-green-500"
                            style={{
                              width: `${calculateAttendancePercentage(employee.attendance)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsEditModalOpen(true);
                          }}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsAttendanceModalOpen(true);
                          }}
                          className="rounded-lg p-2 text-blue-500 hover:bg-blue-50"
                          title="Attendance"
                        >
                          <CalendarCheck size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsLeaveModalOpen(true);
                            setActiveTab("leaves");
                          }}
                          className="rounded-lg p-2 text-purple-500 hover:bg-purple-50"
                          title="Leaves"
                        >
                          <CalendarX size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsPayrollModalOpen(true);
                          }}
                          className="rounded-lg p-2 text-green-500 hover:bg-green-50"
                          title="Payroll"
                        >
                          <Wallet size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No employees found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Modal */}
      <AnimatePresence>
        {isStatsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Employee Statistics</h2>
                <button
                  onClick={() => setIsStatsModalOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl bg-blue-50 p-6">
                  <div className="text-sm font-medium text-blue-600">Total Employees</div>
                  <div className="mt-2 text-3xl font-bold text-blue-800">{employees.length}</div>
                </div>
                
                <div className="rounded-xl bg-green-50 p-6">
                  <div className="text-sm font-medium text-green-600">Active Employees</div>
                  <div className="mt-2 text-3xl font-bold text-green-800">
                    {employees.filter(e => e.status === "Active").length}
                  </div>
                </div>
                
                <div className="rounded-xl bg-purple-50 p-6">
                  <div className="text-sm font-medium text-purple-600">Avg. Attendance</div>
                  <div className="mt-2 text-3xl font-bold text-purple-800">
                    {employees.length > 0 
                      ? Math.round(employees.reduce((sum, emp) => 
                          sum + calculateAttendancePercentage(emp.attendance), 0) / employees.length)
                      : 0}%
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-medium text-gray-700">Employees by Department</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {departments.filter(d => d !== "All").map(dept => (
                    <div key={dept} className="rounded-lg bg-gray-50 p-4">
                      <div className="text-sm text-gray-500">{dept}</div>
                      <div className="text-xl font-semibold text-gray-800">
                        {employees.filter(e => e.department === dept).length}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={newEmployee.name || ""}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={newEmployee.email || ""}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Position *</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={newEmployee.position || ""}
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={newEmployee.department || "IT"}
                      onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    >
                      {departments.filter(d => d !== "All").map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={newEmployee.status || "Active"}
                      onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Add Employee
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Employee Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Edit Employee</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-gray-200">
                    <img
                      src={selectedEmployee.avatar}
                      alt={`${selectedEmployee.name}'s avatar`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedEmployee.name}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedEmployee.email}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedEmployee.position}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, position: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={selectedEmployee.department}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, department: e.target.value})}
                    >
                      {departments.filter(d => d !== "All").map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={selectedEmployee.status}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Salary</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={selectedEmployee.salary || 0}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, salary: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditEmployee}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attendance Modal */}
      <AnimatePresence>
        {isAttendanceModalOpen && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Attendance - {selectedEmployee.name}
                </h2>
                <button
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium text-gray-700">
                    Current Month: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Present</span>
                    <div className="mx-2 h-3 w-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm text-gray-600">Absent</span>
                  </div>
                </div>
              </div>
             <div className="mb-6">
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => {
                    const date = new Date();
                    date.setDate(i + 1);
                    const dayOfWeek = date.getDay();
                    
                    return (
                      <div
                        key={i}
                        className={`flex h-12 flex-col items-center justify-center rounded-lg border p-2 text-center ${
                          selectedEmployee.attendance[i]
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        } cursor-pointer hover:shadow-sm`}
                        onClick={() => toggleAttendance(i)}
                      >
                        <div className="text-sm font-medium">{i + 1}</div>
                        {selectedEmployee.attendance[i] ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <X size={16} className="text-gray-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                <div className="text-blue-800">
                  <div className="font-medium">Attendance Summary</div>
                  <div className="text-sm">
                    {selectedEmployee.attendance.filter(Boolean).length} days present / {selectedEmployee.attendance.length} days
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {calculateAttendancePercentage(selectedEmployee.attendance)}%
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave Modal */}
      <AnimatePresence>
        {isLeaveModalOpen && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Leave Management - {selectedEmployee.name}
                </h2>
                <button
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex space-x-2 border-b border-gray-200">
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === "details"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                  </button>
                  <button
                    className={`px-4 py-2 font-medium ${
                      activeTab === "leaves"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("leaves")}
                  >
                    Leave Requests
                  </button>
                </div>
              </div>
              
              {activeTab === "details" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl bg-green-50 p-4">
                      <div className="flex items-center">
                        <CalendarCheck className="mr-2 h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Annual Leave</span>
                      </div>
                      <div className="mt-2 text-xl font-bold text-green-900">15 days</div>
                    </div>
                    
                    <div className="rounded-xl bg-blue-50 p-4">
                      <div className="flex items-center">
                        <CalendarX className="mr-2 h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Sick Leave</span>
                      </div>
                      <div className="mt-2 text-xl font-bold text-blue-900">10 days</div>
                    </div>
                    
                    <div className="rounded-xl bg-purple-50 p-4">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">Leave Taken</span>
                      </div>
                      <div className="mt-2 text-xl font-bold text-purple-900">
                        {selectedEmployee.leaves?.filter(l => l.status === "Approved").length || 0} days
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-700">Leave Policy</h3>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <ul className="list-disc space-y-2 pl-5 text-gray-600">
                        <li>Annual leave accrues at 1.25 days per month</li>
                        <li>Maximum of 15 days annual leave can be carried forward</li>
                        <li>Sick leave requires medical certificate after 3 days</li>
                        <li>Maternity leave: 12 weeks fully paid</li>
                        <li>Paternity leave: 2 weeks fully paid</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-lg font-medium text-gray-700">Leave History</h3>
                    <button className="flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                      <Plus size={16} className="mr-1" />
                      New Request
                    </button>
                  </div>
                  
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Dates</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Days</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedEmployee.leaves && selectedEmployee.leaves.length > 0 ? (
                          selectedEmployee.leaves.map((leave) => (
                            <tr key={leave.id}>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{leave.type}</td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                {leave.startDate} to {leave.endDate}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                {Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)} days
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    leave.status === "Approved"
                                      ? "bg-green-100 text-green-800"
                                      : leave.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {leave.status}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800">
                                    <Pencil size={16} />
                                  </button>
                                  <button className="text-red-600 hover:text-red-800">
                                    <X size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                              No leave requests found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Employment;
