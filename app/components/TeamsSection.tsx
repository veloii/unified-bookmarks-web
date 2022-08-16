import screenshot from "~/screenshots/s1.webp";
import screenshot2 from "~/screenshots/s2.webp";

export default function TeamsSection() {
  return (
    <div>
      <div className="polka-dots flex justify-center py-16 px-2 sm:px-5 md:px-1">
        <div className="space-y-10">
          <div className="mx-auto flex flex-col items-center justify-center">
            <h1 className="text-center font-brand text-5xl text-white">
              Create teams and invite others
            </h1>
            <p className="max-w-2xl py-6 text-center text-lg tracking-tight text-slate-200">
              Invite members quickly with a URL for your team members to sign up
              quickly. No messing around with inviting each email.
            </p>
          </div>
          <div className="relative">
            <img
              className="w-[1000px] -rotate-1 rounded-xl shadow transition hover:-translate-y-8"
              src={screenshot2}
            />
            <img
              className="absolute mt-64 w-[1000px] -translate-y-full rotate-6 rounded-xl shadow transition-all hover:mt-56"
              src={screenshot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
