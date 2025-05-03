import React, { useEffect, useState } from "react";
import {
  changeUserStatus,
  changeUserRole,
  getListAllUsers,
  deleteUser,
} from "../../Api/api-admin.jsx";
import useShopStore from "../../store/shop-store.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faUserShield,
  faCheckCircle,
  faTimesCircle,
  faTrashAlt,
  faEdit,
  faEye,
  faSpinner,
  faCaretDown,
  faSearch,
  faFilter,
  faPlus,
  faDownload,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const TableUsers = () => {
  const token = useShopStore((state) => state.token);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    GetUsers(token);
  }, []);

  const GetUsers = (token) => {
    setIsLoading(true);
    getListAllUsers(token)
      .then((res) => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDeleteUser = (userId, userEmail) => {
    Swal.fire({
      title: "Confirm User Deletion",
      html: `<p>Are you sure you want to delete <strong>${userEmail}</strong>?</p><p class="text-red-500 dark:text-red-400">This action cannot be undone!</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete User",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      customClass: {
        popup: "dark:bg-gray-800",
        title: "dark:text-white",
        htmlContainer: "dark:text-gray-300",
      },
      preConfirm: () => {
        setDeletingId(userId);
        return deleteUser(token, userId)
          .then(() => {
            return { success: true };
          })
          .catch((error) => {
            Swal.showValidationMessage(
              `Failed to delete user: ${error.message}`
            );
            return { success: false };
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      setDeletingId(null);
      if (result.isConfirmed && result.value?.success) {
        Swal.fire({
          title: "Deleted!",
          text: `User ${userEmail} has been deleted`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "dark:bg-gray-800",
            title: "dark:text-white",
          },
        });
        GetUsers(token);
      }
    });
  };

  const usersStatus = (userId, userStatus, userEmail) => {
    Swal.fire({
      title: "Confirm Status Change",
      html: `Are you sure you want to ${
        userStatus ? "disable" : "enable"
      } <strong>${userEmail}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "dark:bg-gray-800",
        title: "dark:text-white",
        htmlContainer: "dark:text-gray-300",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const value = { id: userId, enabled: !userStatus };
        changeUserStatus(token, value)
          .then(() => {
            Swal.fire({
              title: "Success!",
              text: "Status updated successfully",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              customClass: {
                popup: "dark:bg-gray-800",
                title: "dark:text-white",
              },
            });
            GetUsers(token);
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "Please try again",
              icon: "error",
              customClass: {
                popup: "dark:bg-gray-800",
                title: "dark:text-white",
              },
            });
          });
      }
    });
  };

  const usersStatusRole = (userId, userRole, userEmail) => {
    Swal.fire({
      title: "Confirm Role Change",
      html: `Are you sure you want to change <strong>${userEmail}</strong> to "${userRole}" role?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "dark:bg-gray-800",
        title: "dark:text-white",
        htmlContainer: "dark:text-gray-300",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const value = { id: userId, role: userRole };
        changeUserRole(token, value)
          .then(() => {
            Swal.fire({
              title: "Success!",
              text: "Role updated successfully",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              customClass: {
                popup: "dark:bg-gray-800",
                title: "dark:text-white",
              },
            });
            GetUsers(token);
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "Please try again",
              icon: "error",
              customClass: {
                popup: "dark:bg-gray-800",
                title: "dark:text-white",
              },
            });
          });
      }
    });
  };

  const handleViewUser = (userId) => {
    const user = users.find((u) => u.id === userId);

    if (!user) {
      Swal.fire({
        title: "Error",
        text: "User not found",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: "dark:bg-gray-800",
          title: "dark:text-white",
          htmlContainer: "dark:text-gray-300",
        },
      });
      return;
    }

    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    Swal.fire({
      title: `User Details: ${user.email}`,
      html: `
        <div class="text-left space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 class="font-semibold text-lg mb-3 text-gray-800 dark:text-white">Basic Information</h3>
              <div class="space-y-2">
                <p><span class="font-medium text-gray-700 dark:text-gray-300">Email:</span> <span class="text-gray-900 dark:text-white">${
                  user.email
                }</span></p>
                <p><span class="font-medium text-gray-700 dark:text-gray-300">Role:</span> <span class="capitalize px-2 py-1 rounded text-sm ${
                  user.role === "admin"
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                    : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                }">${user.role}</span></p>
                <p><span class="font-medium text-gray-700 dark:text-gray-300">Status:</span> <span class="inline-flex items-center px-2 py-1 rounded text-sm ${
                  user.enabled
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                }">
                  ${
                    user.enabled
                      ? '<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> Active'
                      : '<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg> Inactive'
                  }
                </span></p>
                <p><span class="font-medium text-gray-700 dark:text-gray-300">User ID:</span> <span class="font-mono text-gray-900 dark:text-white">${
                  user.id
                }</span></p>
              </div>
            </div>

            <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 class="font-semibold text-lg mb-3 text-gray-800 dark:text-white">Timeline</h3>
              <div class="space-y-2">
                <p><span class="font-medium text-gray-700 dark:text-gray-300">Created:</span> <span class="text-gray-900 dark:text-white">${formatDate(
                  user.createdAt
                )}</span></p>
                ${
                  user.updatedAt
                    ? `<p><span class="font-medium text-gray-700 dark:text-gray-300">Last Updated:</span> <span class="text-gray-900 dark:text-white">${formatDate(
                        user.updatedAt
                      )}</span></p>`
                    : ""
                }
                ${
                  user.lastLogin
                    ? `<p><span class="font-medium text-gray-700 dark:text-gray-300">Last Login:</span> <span class="text-gray-900 dark:text-white">${formatDate(
                        user.lastLogin
                      )}</span></p>`
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      width: "800px",
      customClass: {
        popup: "dark:bg-gray-800",
        htmlContainer: "dark:text-gray-300",
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300">
        {/* Header with search and actions */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg mr-3 shadow-md">
                  <FontAwesomeIcon icon={faUserShield} className="mr-2" />
                  User Management
                </span>
                <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full shadow-sm">
                  {filteredUsers.length} user
                  {filteredUsers.length !== 1 ? "s" : ""}
                </span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>

              <div className="relative min-w-[150px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="block appearance-none w-full pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    className="text-gray-400"
                  />
                </div>
              </div>

              <button
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                onClick={() => console.log("Add user clicked")}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            {/* Table Header */}
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="mr-2 opacity-70"
                    />
                    Email
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUserShield}
                      className="mr-2 opacity-70"
                    />
                    Role
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Loading users...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-gray-400 text-4xl mb-4"
                      />
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No users found
                      </p>
                      {searchTerm || selectedRole !== "all" ? (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedRole("all");
                          }}
                          className="mt-4 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors shadow-sm"
                        >
                          Clear filters
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((el, i) => (
                  <tr
                    key={el.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    data-aos="fade-up"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white w-12">
                      {i + 1 + (currentPage - 1) * usersPerPage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center shadow-inner">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="w-4 h-4 text-blue-600 dark:text-blue-300"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {el.email}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {el.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          onChange={(e) =>
                            usersStatusRole(el.id, e.target.value, el.email)
                          }
                          value={el.role}
                          className={`block appearance-none min-w-[120px] bg-opacity-50 ${
                            el.role === "admin"
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700"
                          } border py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                            el.role === "admin"
                              ? "focus:ring-purple-500 focus:border-purple-500"
                              : "focus:ring-blue-500 focus:border-blue-500"
                          } hover:bg-opacity-70 transition-all cursor-pointer shadow-sm`}
                        >
                          <option
                            value="user"
                            className="bg-white dark:bg-gray-800"
                          >
                            User
                          </option>
                          <option
                            value="admin"
                            className="bg-white dark:bg-gray-800"
                          >
                            Admin
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                          <FontAwesomeIcon
                            icon={faCaretDown}
                            className="opacity-70"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => usersStatus(el.id, el.enabled, el.email)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center transition-all ${
                          el.enabled
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800/50"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800/50"
                        } shadow-sm`}
                      >
                        <FontAwesomeIcon
                          icon={el.enabled ? faCheckCircle : faTimesCircle}
                          className="mr-1.5 w-3 h-3"
                        />
                        {el.enabled ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Created:  
                        </span>
                        <span>
                          {new Date(el.createdAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {el.updatedAt && (
                          <>
                            <span className="font-medium text-gray-700 dark:text-gray-300 mt-1">
                              Last Active:
                            </span>
                            <span>
                              {new Date(el.updatedAt).toLocaleString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* View Button */}
                        <button
                          onClick={() => handleViewUser(el.id)}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-700 hover:shadow-sm shadow-sm"
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-1.5" />
                          View
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteUser(el.id, el.email)}
                          disabled={deletingId === el.id}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-700 hover:shadow-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === el.id ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              className="mr-1.5 animate-spin"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="mr-1.5"
                            />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{indexOfFirstUser + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastUser, filteredUsers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredUsers.length}</span>{" "}
            results
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Export
            </button>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg border ${
                      currentPage === pageNum
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-medium"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    } transition-colors shadow-sm`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableUsers;
