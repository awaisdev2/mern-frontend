import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Spinner } from "react-bootstrap";

import { useAuth } from "./hooks/auth";
import AuthIndex from "./pages/auth/AuthIndex";
import Header from "./components/Header";
import HomeIndex from "./pages/home/HomeIndex";
import NotesIndex from "./pages/notes/NotesIndex";
import ExpensesIndex from "./pages/expenses/ExpensesIndex";
import TodosIndex from "./pages/todos/TodosIndex";
import UserProfileIndex from "./pages/profile/UserProfileIndex";

import "./App.css";

const LayoutWithHeader = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/auth" && <Header />}
      {children}
    </>
  );
};

const App = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-between my-3">
        <Spinner />
        <p className="font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <LayoutWithHeader>
        <Routes>
          {currentUser ? (
            <>
              <Route path="/" element={<HomeIndex />} />
              <Route path="/notes" element={<NotesIndex />} />
              <Route path="/expenses" element={<ExpensesIndex />} />
              <Route path="/todos" element={<TodosIndex />} />
              <Route path="/user-profile" element={<UserProfileIndex />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/auth" element={<AuthIndex />} />
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
          )}
        </Routes>
      </LayoutWithHeader>
    </BrowserRouter>
  );
};

export default App;
