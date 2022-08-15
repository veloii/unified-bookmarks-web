import { Link } from "@remix-run/react";

export default function Hero() {
  return (
    <div className="flex min-h-[750px] w-full items-center justify-center bg-white py-5 px-10 text-black sm:px-5 md:px-2">
      <div className="text-center">
        <div className="max-w-3xl">
          <h1 className="font-brand text-4xl font-medium sm:text-5xl md:text-6xl lg:text-7xl">
            Bookmarks <span className="text-primary">made easy</span> for small
            teams
          </h1>
          <p className="py-6 text-lg tracking-tight text-slate-700">
            Unified Bookmarks is a completely free bookmark solution for small
            teams that want to collaborate with ease. Never lose a link again.
          </p>
          <div className="space-x-5">
            <Link to="/join">
              <button className="btn btn-md h-2.5 min-h-[2.5rem] rounded-full bg-slate-900 px-5 normal-case text-white">
                Sign up now
              </button>
            </Link>
            <a
              href="#learn-more"
              className="btn-white btn btn-outline btn-md h-2.5 min-h-[2.5rem] rounded-full border-slate-400 px-5 normal-case text-black hover:border-slate-700 hover:bg-transparent hover:text-inherit"
            >
              How does it work?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
