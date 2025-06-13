import {
  createContext,
  useState,
  useContext,
  ReactNode,

} from "react";
import { IAuthContextType, IUser } from "../utils/statuses";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<IUser | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? (JSON.parse(savedUser) as IUser) : null;
  });

 

  const login = ( user: IUser) => {
    setAuthState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setAuthState(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{user: authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
