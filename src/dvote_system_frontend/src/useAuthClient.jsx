import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { dvote_system_backend } from "../../declarations/dvote_system_backend";
import {
  canisterId,
  createActor,
  idlFactory,
} from "../../declarations/dvote_system_backend";
import { toast } from "react-toastify";

import { useAuthClient } from "@dfinity/use-auth-client";

const AuthContext = createContext();

// export const getIdentityProvider = () => {
//   let idpProvider;
//   // Safeguard against server rendering
//   if (typeof window !== "undefined") {
//     const isLocal = process.env.DFX_NETWORK !== "ic";
//     // Safari does not support localhost subdomains
//     const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
//     if (isLocal && isSafari) {
//       idpProvider = `http://localhost:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`;
//     } else if (isLocal) {
//       idpProvider = `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;
//     }
//   }

//   // "https://identity.ic0.app/#authorize"

//   return "https://identity.ic0.app/#authorize";
// };

// export const defaultOptions = {
//   /**
//    *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
//    */
//   createOptions: {
//     idleOptions: {
//       disableIdle: true,
//     },
//   },
//   /**
//    * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
//    */
//   loginOptions: {
//     identityProvider: getIdentityProvider(),
//   },
// };

// /**
//  *
//  * @param options - Options for the AuthClient
//  * @param {AuthClientCreateOptions} options.createOptions - Options for the AuthClient.create() method
//  * @param {AuthClientLoginOptions} options.loginOptions - Options for the AuthClient.login() method
//  * @returns
//  */
// export const useAuthClient = (options = defaultOptions) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [authClient, setAuthClient] = useState(null);
//   const [identity, setIdentity] = useState(null);
//   const [principal, setPrincipal] = useState(null);
//   const [principalId, setPrincipalId] = useState(null);

//   const [backendActor, setBackendActor] = useState(null);

//   // const getUser = async () => {
//   //   try {
//   //     // const response = await dvote_system_backend.restrictedFunction();
//   //     const response = await backendActor.restrictedFunction();

//   //     console.log(response);

//   //     setPrincipalId(response);
//   //   } catch (error) {
//   //     toast("ERROR", { type: "error" });
//   //   }
//   // };

//   // useEffect(() => {
//   //   getUser();
//   // }, [backendActor]);

//   useEffect(() => {
//     AuthClient.create(options.createOptions).then(async (client) => {
//       updateClient(client);
//     });
//   }, []);

//   const login = () => {
//     authClient.login({
//       ...options.loginOptions,
//       onSuccess: () => {
//         updateClient(authClient);
//       },
//     });
//   };

//   async function updateClient(client) {
//     const isAuthenticated = await client.isAuthenticated();
//     setIsAuthenticated(isAuthenticated);

//     const identity = client.getIdentity();
//     setIdentity(identity);

//     const principal = identity.getPrincipal();
//     setPrincipal(principal);

//     setAuthClient(client);

//     const actor = createActor(canisterId, {
//       agentOptions: {
//         identity,
//       },
//     });

//     setBackendActor(actor);
//   }

//   async function logout() {
//     await authClient?.logout();
//     await updateClient(authClient);
//   }

//   return {
//     isAuthenticated,
//     login,
//     logout,
//     authClient,
//     identity,
//     principal,
//     principalId,
//     backendActor,
//   };
// };

// const identityProvider =
//   // eslint-disable-next-line no-undef
//   process.env.DFX_NETWORK === "local"
//     ? // eslint-disable-next-line no-undef
//       `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`
//     : "https://identity.ic0.app";

const identityProvider = "https://identity.ic0.app";

/**
 * @type {React.FC}
 */
export const AuthProvider = ({ children }) => {
  const auth = useAuthClient({
    loginOptions: {
      identityProvider,
    },
    actorOptions: {
      canisterId,
      idlFactory,
    },
  });

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
