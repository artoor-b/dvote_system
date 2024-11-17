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

function App() {
  const { authenticated } = useAuthState();

  return (
    <Router>
      <NavBar />
      {!authenticated ? (
        <LoginPage />
      ) : (
        <>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="*"
              element={
                <ActorProvider idlFactory={idlFactory} canisterId={canisterId}>
                  <Routes>
                    <Route element={<ProtectedRoute />}>
                      <Route
                        path="/"
                        element={<Navigate to="/forms" replace />}
                      />
                      <Route path="/forms" element={<FormDashboardPage />} />
                      <Route
                        path="/form/:id"
                        element={
                          <FormPage
                            formTitle={undefined}
                            formDescription={undefined}
                            duration={undefined}
                            author={undefined}
                            users={undefined}
                          />
                        }
                      />
                      <Route
                        path="/form/:id/vote"
                        element={<BallotFormPage />}
                      />
                      <Route
                        path="/manage"
                        element={<ManagementDashboardPage />}
                      />
                      <Route
                        path="/manage/form/create"
                        element={<CreateFormPage />}
                      />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </ActorProvider>
              }
            />
          </Routes>
          <Footer />
        </>
      )}
      <ToastContainer position="bottom-right" />
    </Router>
  );
}

export default () => <App />;
