import React, { useContext } from "react";
import { UserRoleContext } from "./UserRoleWrapper";

export const withUserRole = (WrappedComponent) => {
  return (props) => {
    const userRole = useContext(UserRoleContext);
    return <WrappedComponent {...props} userRole={userRole} />;
  };
};
