import { useLocation, useNavigate } from "@remix-run/react";
import { useContext, useEffect, useRef, useState } from "react";
import type { getTeams } from "~/models/team.server";
import NewTeamPage from "~/routes/dashboard/teams/new";
import { useMatchesData } from "~/utils";
import { motion } from "framer-motion";
import { TourContext } from "~/contexts/TourContext";

const fadeIn = {
  initial: {
    opacity: "0%",
  },
  animate: {
    opacity: "100%",
  },
};

export default function Flow() {
  const data = useMatchesData("routes/dashboard") as {
    teams: Awaited<ReturnType<typeof getTeams>>;
  };
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname !== "/dashboard/teams/new" && page === 1)
      navigate("/dashboard/teams/new");
    if (data?.teams.length === 1 && page === 1) setPage(2);
  });

  const [page, setPage] = useState(0);
  const [flow, setFlow] = useState(false);
  const [close, setClose] = useState(false);
  const page1 = useRef<HTMLDivElement | null>(null);
  const page2 = useRef<HTMLDivElement | null>(null);
  const page3 = useRef<HTMLDivElement | null>(null);
  const page4 = useRef<HTMLDivElement | null>(null);
  const { tour, setTour } = useContext(TourContext);

  const showFlow = () => {
    if (close) return false;
    if (tour) return false;
    if (page !== 0) return true;
    if (data?.teams.length === 0) return true;
    return false;
  };

  useEffect(() => {
    if (tour === 1 && pathname.includes(data?.teams[0].id)) setTour(2);
  }, [tour, pathname]);

  useEffect(() => {
    if (tour === 3) {
      setPage(0);
      setTimeout(() => {
        setTour(false);
      }, 2000);
    }
  }, [tour]);

  useEffect(() => {
    if (showFlow()) {
      setFlow(true);
    } else {
      setTimeout(() => {
        setFlow(false);
      }, 1000);
    }
  }, [page, tour, data, close]);

  return (
    <>
      {tour === 3 && (
        <div className="toast toast-center z-50 w-64">
          <div className="alert alert-success justify-center font-semibold">
            <div>
              <span>Quick Tour Completed</span>
            </div>
          </div>
        </div>
      )}
      <input
        type="checkbox"
        defaultChecked
        id="my-modal-5"
        className="modal-toggle"
      />
      <motion.div
        animate={{
          backdropFilter: showFlow() ? "blur(16px)" : "blur(0px)",
          backgroundColor: showFlow()
            ? "rgba(0, 0, 0, 0.2)"
            : "rgba(0, 0, 0, 0)",
          display: flow ? "" : "none",
        }}
        className="modal backdrop-blur-lg"
      >
        {page === 0 && (
          <motion.div
            ref={page1}
            initial={{
              opacity: showFlow() ? "100%" : "0%",
              scale: "0",
            }}
            animate={{
              opacity: showFlow() ? "100%" : "0%",
              scale: showFlow() ? "1" : "0.9",
            }}
            className="modal-box w-[40rem] max-w-5xl p-0 opacity-0"
          >
            <motion.div {...fadeIn} className="p-5">
              <h3 className="text-2xl font-bold">Let{"'"}s get you setup!</h3>
              <p className="py-4">
                We{"'"}ll just setup your teams and you{"'"}ll be on your way.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-ghost text-primary"
                  onClick={() => setPage(1)}
                >
                  Next
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {page === 1 && (
          <motion.div
            layout
            initial={{
              height: page1.current?.offsetHeight,
              width: page1.current?.offsetWidth,
            }}
            animate={{
              height: "auto",
              width: "60rem",
            }}
            className="modal-box max-w-5xl overflow-hidden p-0 "
            ref={page2}
          >
            <motion.div {...fadeIn} className="p-5">
              <NewTeamPage />
            </motion.div>
          </motion.div>
        )}
        {page === 2 && (
          <motion.div
            layout
            initial={{
              height: page2.current?.offsetHeight,
              width: page2.current?.offsetWidth,
            }}
            animate={{
              height: "auto",
              width: "30rem",
            }}
            className="modal-box max-w-5xl overflow-hidden p-0 "
            ref={page3}
          >
            <motion.div {...fadeIn} className="p-5">
              <h3 className="text-2xl font-bold">
                Install the chrome extension
              </h3>
              <p className="py-4">
                Install the chrome extension to be able to access your bookmarks
                from the bookmark bar.
              </p>
              <div className="modal-action">
                <a target="_blank" className="btn btn-primary">
                  Install
                </a>
                <button
                  className="btn btn-ghost text-primary"
                  onClick={() => setPage(3)}
                >
                  Next
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {page === 3 && (
          <motion.div
            layout
            initial={{
              height: page3.current?.offsetHeight,
              scale: "0",
              width: page3.current?.offsetWidth,
              opacity: "100%",
            }}
            animate={{
              height: "auto",
              width: "30rem",
              opacity: showFlow() ? "100%" : "0%",
              scale: showFlow() ? "1" : "0.9",
            }}
            className="modal-box max-w-5xl overflow-hidden p-0 opacity-0"
            ref={page4}
          >
            <motion.div {...fadeIn} className="p-5">
              <h3 className="text-2xl font-bold">Take a tour?</h3>
              <p className="py-4">
                Not sure how everything works? Get familar with the dashboard in
                a quick tour.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-primary"
                  onClick={() => setTour(true)}
                >
                  Take a tour
                </button>
                <button
                  className="btn btn-ghost text-primary"
                  onClick={() => setClose(true)}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
