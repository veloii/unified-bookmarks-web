import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import type { getTeams } from "~/models/team.server";
import { useMatchesData } from "~/utils";

export default function IndexPage() {
  const navigate = useNavigate();
  const data = useMatchesData("routes/dashboard") as {
    teams: Awaited<ReturnType<typeof getTeams>>;
  };
  useEffect(() => {
    if (data.teams.length <= 0) navigate("/dashboard/teams/new");
    else navigate("/dashboard/teams/view");
  }, []);
  return <div></div>;
}
