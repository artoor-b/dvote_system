import React, { createContext, useContext, useState, useEffect } from "react";
import { useQueryCall } from "@ic-reactor/react";
// Create a Context for the userRole
export const UserRoleContext = createContext();

// Wrapper component
export const UserRoleWrapper = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  const { call: getMyRole, data: role } = useQueryCall({
    functionName: "my_role",
    refetchOnMount: false,
  });

  const getRole = async () => {
    await getMyRole();
  };

  useEffect(() => {
    getRole();
    // console.log(data);
  }, []);

  useEffect(() => {
    // console.log("ROLE", role && role[0]);
    if (role && Object.keys(role[0])) {
      const [roleData] = Object.keys(role[0]);
      // console.log(roleData);

      setUserRole(() => roleData);
    }
  }, [role]);

  // if (userRole === null) {
  //   // Optionally, show a loading state while fetching the role
  //   return <div>Loading...</div>;
  // }

  return (
    <UserRoleContext.Provider value={userRole}>
      {console.log(userRole)}
      {children}
    </UserRoleContext.Provider>
  );
};
