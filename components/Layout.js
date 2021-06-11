import Head from "next/head";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="py-3 px-10">{children}</div>
    </div>
  );
};

export default Layout;
