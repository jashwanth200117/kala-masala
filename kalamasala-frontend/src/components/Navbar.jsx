import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../redux/authSlice";
import { selectTotalItems } from "../redux/cartSlice";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const totalItems = useSelector(selectTotalItems); // ✅ from Redux
  const user = useSelector(selectUser); // ✅ from Redux
  const dispatch = useDispatch();

  return (
    <header className="w-full bg-white border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                KM
              </div>
              <span className="text-xl font-semibold text-gray-800">
                KalaMasala
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  "text-sm font-medium " +
                  (isActive ? "text-accent" : "text-gray-700 hover:text-accent")
                }
              >
                {n.label}
              </NavLink>
            ))}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 text-gray-700 hover:text-accent"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                ></path>
              </svg>
              <span className="text-sm">Cart</span>
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-accent text-white text-xs">
                {totalItems}
              </span>
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <>
                <span className="ml-4 text-sm font-medium">
                  Hello, {user.username}
                </span>
                <button
                  onClick={() => dispatch(logout())}
                  className="ml-2 px-4 py-1.5 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="ml-4 px-4 py-1.5 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-2 px-4 py-1.5 bg-accent text-white rounded-md text-sm hover:bg-accent/90"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="mr-3 text-gray-700">
              🛒 {totalItems > 0 ? `(${totalItems})` : ""}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    open
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  "block px-2 py-2 rounded-md " +
                  (isActive
                    ? "text-accent font-medium"
                    : "text-gray-700 hover:bg-gray-50")
                }
              >
                {n.label}
              </NavLink>
            ))}

            {/* Mobile Auth Buttons */}
            {user ? (
              <>
                <span className="block px-2 py-2 text-gray-700">
                  Hello, {user.username}
                </span>
                <button
                  onClick={() => {
                    dispatch(logout());
                    setOpen(false);
                  }}
                  className="block w-full text-left px-2 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="block px-2 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="block px-2 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
