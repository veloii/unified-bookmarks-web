import { Link, useLocation, useNavigate } from "@remix-run/react";
import { MetaFunction } from "@remix-run/server-runtime";
import { useEffect } from "react";
import type { getTeams } from "~/models/team.server";
import { useMatchesData, useUser } from "~/utils";
import logo from "~/branding/UN.webp";

export const meta: MetaFunction = ({ parentsData }) => {
  return parentsData.root.user
    ? {
        title: "Teams - Unified Bookmarks",
        description: "View Teams",
        "twitter:card": "summary_large_image",
        "og:description": "View Teams",
        "og:image": logo,
      }
    : {};
};

export default function IndexPage() {
  const data = useMatchesData("routes/dashboard") as {
    teams: Awaited<ReturnType<typeof getTeams>>;
  };
  const navigate = useNavigate();
  const user = useUser();
  useEffect(() => {
    if (data.teams.length <= 0) navigate("/dashboard/teams/new");
  }, []);
  return (
    <div className="space-y-5 p-5">
      <h2 className="text-4xl font-black">Welcome back</h2>
      <h3 className="text-xl font-bold">Your Teams</h3>
      <div className="flex flex-wrap gap-5 ">
        {data.teams.map((team) => (
          <div
            key={team.id}
            className="card w-96 flex-grow bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title">{team.name}</h2>
              <p>
                {team.users.length} Member
                {team.users.length !== 1 && "s"}
              </p>
              <div className="card-actions pt-5">
                <Link to={`/dashboard/teams/${team.id}`}>
                  <button className="btn btn-primary">View</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
