import { Link } from "@remix-run/react";

export default function CTA() {
  return (
    <div className="w-full bg-white px-5 text-black sm:px-6 md:px-1">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-10 py-16 text-center font-brand">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold">Completely free!</h2>
          <p className="">
            You and your team members can get setup for free in just 5 minutes!
          </p>
        </div>
        <Link to="/join">
          <button className="btn btn-md h-2.5 min-h-[2.5rem] rounded-full bg-slate-900 px-5 normal-case text-white">
            Create an account for free
          </button>
        </Link>
      </div>
    </div>
  );
}
