import React from "react";
import "./App.css";
import { Footer, NavBar } from "./components";
import {
  FormDashboardPage,
  FormPage,
  BallotFormPage,
  ManagementDashboardPage,
  CreateFormPage,
  LoginPage,
  NotFoundPage,
  ResultsPage,
} from "./pages";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { ActorProvider, useAuthState } from "@ic-reactor/react";
import {
  idlFactory,
  canisterId,
} from "../../declarations/dvote_system_backend";
import { ErrorBoundary } from "react-error-boundary";
import { withUserRole } from "./auth/withUserRole";
import { UserRoleWrapper } from "./auth/UserRoleWrapper";

import { useAuth } from "@ic-reactor/react";

function Fallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  resetErrorBoundary();

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

function App() {
  // const { authenticated } = useAuthState();

  const { logout, identity, authenticated } = useAuth({
    onLoggedOut: () => {
      console.log("loggedout");
      toast("Wylogowano", { type: "warning" });
    },
  });

  const FormDashboardPageWithRole = withUserRole(FormDashboardPage);
  const CreateFormPageWithRole = withUserRole(CreateFormPage);
  const ManagementDashboardPageWithRole = withUserRole(ManagementDashboardPage);
  const BallotFormPageWithRole = withUserRole(BallotFormPage);
  const NavBarWithRole = withUserRole(NavBar);

  return (
    <Router>
      {!authenticated ? (
        <>
          <NavBar identity={identity} authenticated={authenticated} />
          <LoginPage />
        </>
      ) : (
        <>
          <ErrorBoundary
            FallbackComponent={Fallback}
            onReset={() => console.log("dfgds")}
          >
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="*"
                element={
                  <ActorProvider
                    idlFactory={idlFactory}
                    canisterId={canisterId}
                  >
                    <UserRoleWrapper>
                      <NavBarWithRole
                        logout={logout}
                        identity={identity}
                        authenticated={authenticated}
                      />
                      {console.log(`actorProvider canisterID: ${canisterId}`)}
                      <Routes>
                        <Route element={<ProtectedRoute />}>
                          <Route
                            path="/"
                            element={<Navigate to="/forms" replace />}
                          />
                          <Route
                            path="/forms"
                            element={<FormDashboardPageWithRole />}
                          />
                          <Route path="/form/:id" element={<FormPage />} />
                          <Route
                            path="/form/:id/results"
                            element={<ResultsPage />}
                          />
                          <Route
                            path="/form/:id/vote"
                            element={<BallotFormPageWithRole />}
                          />
                          <Route
                            path="/manage"
                            element={<ManagementDashboardPageWithRole />}
                          />
                          <Route
                            path="/manage/form/create"
                            element={<CreateFormPageWithRole />}
                          />
                        </Route>
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </UserRoleWrapper>
                  </ActorProvider>
                }
              />
            </Routes>
            <Footer />
          </ErrorBoundary>
        </>
      )}
      <ToastContainer position="bottom-right" />
    </Router>
  );
}

export default () => <App />;
