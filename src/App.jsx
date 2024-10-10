import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { useAuth, AuthProvider } from "./hooks/auth";
import AuthIndex from "./pages/auth/AuthIndex";
import HomeIndex from "./pages/home/HomeIndex";
import NotesIndex from "./pages/notes/NotesIndex";
import Header from "./components/header/Header";

const LayoutWithHeader = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/auth" && <Header />}
      {children}
    </>
  );
};

const ProtectedRoute = ({ element }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  return element;
};

const PublicRoute = ({ element }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return element;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <LayoutWithHeader>
          <Routes>
            <Route
              path="/auth"
              element={<PublicRoute element={<AuthIndex />} />}
            />

            <Route
              path="/"
              element={<ProtectedRoute element={<HomeIndex />} />}
            />
            <Route
              path="/notes"
              element={<ProtectedRoute element={<NotesIndex />} />}
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </LayoutWithHeader>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
