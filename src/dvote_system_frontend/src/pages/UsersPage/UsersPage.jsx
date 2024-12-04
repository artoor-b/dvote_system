import React, { useEffect, useState } from "react";

import { useQueryCall } from "@ic-reactor/react";
import { Principal } from "@dfinity/principal";
import { toast } from "react-toastify";
import { BackButton, Spinner } from "../../components";
import { useNavigate } from "react-router-dom";

export const UsersPage = ({ setUserRole }) => {
  const navigate = useNavigate();

  const { call: getMyRole, data: role } = useQueryCall({
    functionName: "my_role",
    refetchOnMount: false,
  });

  const {
    call: getRoles,
    data: rolesData,
    loading: rolesDataLoading,
  } = useQueryCall({
    functionName: "get_roles",
    refetchOnMount: true,
    onError: (e) => {
      if (e.reject_message === "unauthorized") {
        navigate("/forms?status=notStarted");
        toast(e.reject_message === "unauthorized" && "Nieautoryzowany dostęp", {
          type: "error",
        });
      }
    },
    throwOnError: true,
  });

  //assign_role
  const {
    call: assignRole,
    data: assignRoleData,
    loading: assignRoleLoading,
  } = useQueryCall({
    functionName: "assign_role",
    refetchOnMount: false,
    onError: (e) => {
      toast(e.reject_message, { type: "error" });
    },
    throwOnError: true,
  });

  const [roleChanges, setRoleChanges] = useState({}); // To track changes in dropdown

  useEffect(() => {
    console.log(rolesData);
  }, [rolesData]);

  const handleRoleChange = (principalId, newRole, currentRole) => {
    setRoleChanges((prev) => ({
      ...prev,
      [principalId]: newRole !== currentRole ? newRole : null,
    }));
  };

  const onRoleChange = async (principal, newRole) => {
    const roleVariant = { [newRole]: null };
    console.log(`Change role of ${principal} to ${newRole}`);

    const data = await assignRole([principal, roleVariant]);

    if (data) {
      toast("Zmieniono rolę", { type: "warning" });
      await getRoles();
      const checkMyRole = await getMyRole();
      setUserRole(() => checkMyRole);
    }
  };

  const mapDataRoles = () =>
    rolesData &&
    rolesData.map(([principal, roleVariant]) => {
      const principalId = Principal.fromUint8Array(principal._arr).toText();
      const currentRole = Object.keys(roleVariant)[0];

      return (
        <tr key={principalId} className="border-b">
          <td className="px-4 py-2 flex">{principalId}</td>
          <td className="px-4 py-2">{currentRole}</td>
          <td className="px-4 py-2">
            <select
              className="border rounded p-1"
              onChange={(e) =>
                handleRoleChange(principalId, e.target.value, currentRole)
              }
              defaultValue={currentRole}
            >
              <option value="admin">Administrator</option>
              <option value="president">Prezes</option>
              <option value="organizationSecretary">
                Sekretarz organizacji
              </option>
              <option value="meetingChairperson">
                Przewodniczący zebrania
              </option>
              <option value="meetingSecretary">Sekretarz zebrania</option>
              <option value="voter">Głosujący</option>
            </select>
          </td>
          <td className="px-4 py-2">
            <button
              className={`text-white font-bold py-1 px-3 rounded ${
                roleChanges[principalId]
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!roleChanges[principalId]}
              onClick={() => onRoleChange(principal, roleChanges[principalId])}
            >
              Zmień
            </button>
          </td>
        </tr>
      );
    });

  if (rolesDataLoading) return <Spinner />;

  return (
    <section className="p-4">
      <BackButton backLocation="/manage" text="Zarządzaj" />
      <h1 className="flex text-3xl font-extralight mb-4">
        Zarządzaj użytkownikami
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-600 text-white">
              <th className="px-4 py-2 border">ID użytkownika</th>
              <th className="px-4 py-2 border">Aktualna rola</th>
              <th className="px-4 py-2 border">Nowa rola</th>
              <th className="px-4 py-2 border">Akcja</th>
            </tr>
          </thead>
          <tbody>{mapDataRoles()}</tbody>
        </table>
      </div>
    </section>
  );
};
