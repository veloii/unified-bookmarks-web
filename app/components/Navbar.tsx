import { Team } from "@prisma/client";
import { Link, NavLink, useSubmit } from "@remix-run/react";
import React, { useContext, useEffect, useState } from "react";
import { getTeams } from "~/models/team.server";
import {
  BellIcon,
  CogIcon,
  LogoutIcon,
  MenuAlt2Icon,
  PlusCircleIcon,
  PlusIcon,
  SearchIcon,
  ViewGridIcon,
} from "@heroicons/react/solid";
import { useUser } from "~/utils";
import Logo from "~/branding/UNFull75px.webp";
import LogoLight from "~/branding/UNFull75Lightpx.webp";
import { TourContext } from "~/contexts/TourContext";
import Flow1 from "./Flow1";

export default function Navbar(props: {
  children: React.ReactNode;
  teams: Awaited<ReturnType<typeof getTeams>>;
}) {
  const submit = useSubmit();
  const [logoutWarning, setLogoutWarning] = useState(false);
  const user = useUser();
  const { tour, setTour } = useContext(TourContext);
  useEffect(() => {
    if (tour === true) setTour(1);
  }, [tour]);

  return (
    <div className="drawer-mobile drawer min-h-screen">
      <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="navbar bg-base-100 lg:hidden">
          <div className="navbar-start">
            <label
              htmlFor="navbar-drawer"
              tabIndex={0}
              className="btn btn-ghost btn-circle"
            >
              {tour === 1 && (
                <div className="badge badge-primary absolute animate-ping"></div>
              )}
              <MenuAlt2Icon width={20} className="mx-auto" />
            </label>
          </div>
          <div className="navbar-center">
            <div className="btn btn-ghost text-xl normal-case">
              Unified Bookmarks
            </div>
          </div>
          <div className="navbar-end"></div>
        </div>
        <div className="h-full bg-base-200">{props.children}</div>
      </div>
      <div className="drawer-side">
        <label htmlFor="navbar-drawer" className="drawer-overlay"></label>
        <ul className="menu w-80 space-y-7 overflow-y-auto bg-base-300 p-4 font-semibold text-base-content">
          <div>
            <img
              src={LogoLight}
              alt="Unified Bookmarks"
              className="light-logo px-1"
            />
            <img
              src={Logo}
              alt="Unified Bookmarks"
              className="dark-logo px-1"
            />
          </div>
          <div className="space-y-2">
            <li>
              <NavLink
                to="teams/new"
                className={({ isActive }) => ` ${isActive ? "active" : ""}`}
              >
                <PlusCircleIcon width={20} /> Add Team
              </NavLink>
            </li>
            {props.teams.length > 0 && (
              <li>
                <NavLink
                  to="teams/view"
                  className={({ isActive }) => ` ${isActive ? "active" : ""}`}
                >
                  <ViewGridIcon width={20} /> View Teams
                </NavLink>
              </li>
            )}
          </div>

          {props.teams.filter((team) => team.owner.id === user.id).length >
            0 && (
            <div className="space-y-2">
              <li className="menu-title">
                <span>My Teams</span>
              </li>
              {props.teams
                .filter((team) => team.owner.id === user.id)
                .map((team, idx) => (
                  <React.Fragment key={team.id}>
                    <li>
                      <NavLink
                        className={({ isActive }) =>
                          ` ${isActive ? "active" : ""}`
                        }
                        to={`/dashboard/teams/${team.id}`}
                      >
                        {team.name}
                      </NavLink>
                    </li>
                    {idx === 0 && tour === 1 && <Flow1 />}
                  </React.Fragment>
                ))}
            </div>
          )}
          {props.teams.filter((team) => team.owner.id !== user.id).length >
            0 && (
            <div className="space-y-2">
              <li className="menu-title">
                <span>Teams</span>
              </li>
              {props.teams
                .filter((team) => team.owner.id !== user.id)
                .map((team, idx) => (
                  <React.Fragment key={team.id}>
                    <li>
                      <NavLink
                        className={({ isActive }) =>
                          ` ${isActive ? "active" : ""}`
                        }
                        to={`/dashboard/teams/${team.id}`}
                      >
                        {team.name}
                      </NavLink>
                    </li>
                    {idx === 0 && tour === 1 && <Flow1 />}
                  </React.Fragment>
                ))}
            </div>
          )}

          <div className="space-y-2">
            <li className="menu-title">
              <span>User</span>
            </li>
            <li>
              <NavLink
                to="settings"
                className={({ isActive }) => ` ${isActive ? "active" : ""}`}
              >
                <CogIcon width={20} /> Settings
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => {
                  if (logoutWarning)
                    submit(
                      {},
                      {
                        method: "post",
                        action: "/logout",
                      }
                    );

                  setLogoutWarning(true);
                  setTimeout(() => {
                    setLogoutWarning(false);
                  }, 2000);
                }}
              >
                <LogoutIcon width={20} />{" "}
                {logoutWarning ? "Are you sure?" : "Logout"}
              </button>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}
