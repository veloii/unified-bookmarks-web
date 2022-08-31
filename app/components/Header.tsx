import { Link } from "@remix-run/react";
import logo from "~/branding/UNFull75Lightpx.webp";

export default function Header() {
  return (
    <div className="z-50 w-full bg-white py-5">
      <div className="navbar mx-auto max-w-7xl">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <a
                  target="_blank"
                  href={
                    typeof window !== "undefined"
                      ? (window as any).ENV.CHROME_EXTENSION_URL
                      : process.env.CHROME_EXTENSION_URL
                  }
                  rel="noreferrer"
                >
                  Chrome Extension
                </a>
              </li>
            </ul>
          </div>
          <img
            alt="Unified Bookmarks"
            src={logo}
            className="h-6 w-auto sm:h-12"
          />
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal p-0 font-semibold text-black">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <a
                target="_blank"
                href={
                  typeof window !== "undefined"
                    ? (window as any).ENV.CHROME_EXTENSION_URL
                    : process.env.CHROME_EXTENSION_URL
                }
                rel="noreferrer"
              >
                {" "}
                Chrome Extension
              </a>{" "}
            </li>{" "}
          </ul>
        </div>
        <div className="navbar-end">
          <Link
            to="/join"
            className="btn btn-md h-2.5 min-h-[2.5rem] rounded-full bg-slate-900 px-5 normal-case text-white"
          >
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
