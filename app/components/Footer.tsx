import { Link } from "@remix-run/react";
import logo from "~/branding/UNFull75px.webp";

export default function Footer() {
  return (
    <div>
      <footer className="footer bg-base-200 p-10 text-base-content">
        <div>
          <Link to="/login" className="footer-title">
            Login
          </Link>
          <Link to="/join" className="footer-title">
            Sign Up
          </Link>
        </div>
        <div>
          <span className="footer-title">Resources</span>
          <Link to="/privacy-policy" className="link link-hover">
            Privacy Policy
          </Link>
          <a
            target="_blank"
            href={
              typeof window !== "undefined"
                ? (window as any).ENV.CHROME_EXTENSION_URL
                : process.env.CHROME_EXTENSION_URL
            }
            rel="noreferrer"
            className="link link-hover"
          >
            Chrome Extension
          </a>
        </div>
      </footer>
      <footer className="footer border-t border-base-300 bg-base-200 px-10 py-4 text-base-content">
        <div className="grid-flow-col items-center justify-center">
          <img alt="Unified Bookmarks" src={logo} className="h-8" />
        </div>
      </footer>
    </div>
  );
}
