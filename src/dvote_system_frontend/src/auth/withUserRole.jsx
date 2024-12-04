import React, { useContext } from "react";
import { UserRoleContext } from "./UserRoleWrapper";

export const withUserRole = (WrappedComponent) => {
  return (props) => {
    const { userRole, setUserRole } = useContext(UserRoleContext);
    return (
      <WrappedComponent
        {...props}
        userRole={userRole}
        setUserRole={setUserRole}
      />
    );
  };
};
