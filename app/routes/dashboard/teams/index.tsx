import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import type { getTeams } from "~/models/team.server";
import { useMatchesData } from "~/utils";

export default function IndexPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard/teams/view");
  });
  return <div></div>;
}
