import { FC } from "react";
import ProtectedRoute from "../../utils/ProtectedRoute";
import Header from "./Header/Header";
import Footer from "./Footer";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: FC<WrapperProps> = ({ children }) => {
  return (
    <ProtectedRoute>
       <Header />
      <div
    
        style={{
          background:
            "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)",height:"90vh",display:"flex",justifyContent:"center", flexDirection:"column",alignItems:"center"
        }}
        
      >
       
        {children}
      </div>
      <Footer year={new Date().getFullYear()} />
    </ProtectedRoute>
  );
};

export default Wrapper;
