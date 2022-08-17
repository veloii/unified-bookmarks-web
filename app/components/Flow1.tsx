import { ArrowLeftIcon, ArrowUpIcon } from "@heroicons/react/solid";

export default function Flow1() {
  return (
    <div className="relative left-4 -bottom-2">
      <div className="flex animate-bounce items-center gap-2 text-primary">
        <ArrowUpIcon height={18} />
        <p>Select a team from here</p>
      </div>
    </div>
  );
}
