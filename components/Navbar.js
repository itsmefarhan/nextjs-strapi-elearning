import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import MenuSvg from "./MenuSvg";

const Navbar = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const user =
    Cookie.get("elearning-user") && JSON.parse(Cookie.get("elearning-user"));

  const handleLogout = () => {
    Cookie.remove("elearning-jwt");
    Cookie.remove("elearning-user");
    router.replace("/auth/signin");
  };

  const renderPath = (pathname, label) => {
    return (
      <Link href={pathname}>
        <a
          onClick={() => setShowMenu(false)} // close menu list onclick
          className={`border-b-2 border-transparent pb-4 transition duration-300 ${
            router.pathname === pathname &&
            "md:border-yellow-500 text-yellow-500"
          }`}
        >
          {label}
        </a>
      </Link>
    );
  };

  return (
    <header className="text-white bg-gray-800 py-3 px-10">
      <nav className="flex items-center justify-between">
        <div>
          <Link href="/">
            <a
              className={`text-2xl font-medium ${
                router.pathname === "/" && "border-yellow-500 text-yellow-500"
              }`}
            >
              E-Learning
            </a>
          </Link>
        </div>
        <div>
          {/* medium and up screens */}
          <div className="hidden md:inline-block space-x-5">
            {!user ? (
              <>
                {renderPath("/auth/signup", "Sign Up")}
                {renderPath("/auth/signin", "Sign In")}
              </>
            ) : (
              <>
                {user.educator && renderPath("/teach", "Teach")}
                {renderPath("/user/dashboard", "Dashboard")}
                <button
                  className="bg-yellow-500 text-white py-1 px-4 rounded-md"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
          {/* below medium screens */}
          <div
            className="md:hidden cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MenuSvg />
          </div>
        </div>
      </nav>
      {/* below medium screens */}
      {showMenu && (
        <span className="flex flex-col items-start mt-4 md:hidden">
          {!user ? (
            <>
              {renderPath("/auth/signup", "Sign Up")}
              {renderPath("/auth/signin", "Sign In")}
            </>
          ) : (
            <>
              {user.educator && renderPath("/teach", "Teach")}
              {renderPath("/user/dashboard", "Dashboard")}
              <button
                className="bg-red-500 text-white py-1 px-4 rounded-md"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </span>
      )}
    </header>
  );
};

export default Navbar;
