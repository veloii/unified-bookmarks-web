import { useLocation, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getTeams } from "~/models/team.server";
import NewTeamPage from "~/routes/dashboard/teams/new";
import { useMatchesData } from "~/utils";

export default function Flow() {
  const data = useMatchesData("routes/dashboard") as {
    teams: Awaited<ReturnType<typeof getTeams>>;
  };
  const [page, setPage] = useState(0);
  const [enrolled, setEnrolled] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname !== "/dashboard/teams/new" && page === 1) {
      navigate("/dashboard/teams/new");
    }
    if (data?.teams.length === 1 && enrolled) {
      setPage(2);
    }
    if (data?.teams.length === 0 && !enrolled) {
      setPage(0);
      setEnrolled(true);
    }
  });
  return enrolled ? (
    <>
      <input
        type="checkbox"
        defaultChecked
        id="my-modal-5"
        className="modal-toggle"
      />
      <div className="modal bg-neutral">
        {page === 0 && (
          <div className="modal-box w-3/12 max-w-5xl">
            <h3 className="text-2xl font-bold">Let{"'"}s get you setup!</h3>
            <p className="py-4">
              We{"'"}ll just setup your teams and you{"'"}ll be on your way.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setPage(1)}>
                Next
              </button>
              {/* <label htmlFor="my-modal-5" className="btn">
                Next
              </label> */}
            </div>
          </div>
        )}
        {page === 1 && (
          <div className="modal-box w-96">
            <NewTeamPage />
          </div>
        )}
        {page === 2 && (
          <div className="modal-box w-3/12 max-w-5xl">
            <h3 className="text-2xl font-bold">Install the chrome extension</h3>
            <p className="py-4">
              Install the chrome extension to be able to access your bookmarks
              from the bookmark bar.
            </p>
            <div className="modal-action">
              <a target="_blank" className="btn btn-primary">
                Install
              </a>
              <label
                onClick={() => {
                  navigate(`/dashboard/teams/${data.teams[0].id}`);
                }}
                htmlFor="my-modal-5"
                className="btn"
              >
                Done
              </label>
            </div>
          </div>
        )}
      </div>
    </>
  ) : (
    <div></div>
  );
}
