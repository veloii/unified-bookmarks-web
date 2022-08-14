import screenshot1 from "~/screenshots/s3.png";
import screenshot2 from "~/screenshots/s4.png";
import screenshot3 from "~/screenshots/s5.png";
import screenshot4 from "~/screenshots/s6.png";
import screenshot5 from "~/screenshots/s7.png";
import chrome from "~/screenshots/unified.png";
import bookmarks from "~/screenshots/bookmarks.png";
import { ArrowDownIcon } from "@heroicons/react/solid";
import { useState } from "react";
import bg from "~/screenshots/bg.png";

export default function ExtensionSection() {
  const [active, setActive] = useState<number>(0);
  const tabs = [
    {
      name: "Chrome Extension",
      desc: "Sync your bookmarks directly to chrome without any complications.",
      img: screenshot1,
    },
    {
      name: "Bookmark Bar",
      desc: "Access your bookmarks between teams through the built-in bookmark bar.",
      img: screenshot2,
    },
    {
      name: "Transfer Bookmarks",
      desc: "With one drag you can quickly transfer bookmarks between all your teams.",
      img: screenshot3,
    },
    {
      name: "New Bookmarks",
      desc: "Create your bookmarks directly from your web browser.",
      img: screenshot4,
    },
    {
      name: "Delete Bookmarks",
      desc: "Delete your bookmarks directly from your web browser.",
      img: screenshot5,
    },
  ];

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${bg})`,
        }}
        className="py-80 text-white"
      >
        <div id="learn-more" className="space-y-10 py-16">
          <div className="mx-auto flex flex-col items-center justify-center">
            <h1
              className=" 
             text-center font-brand text-5xl text-white"
            >
              Everything you need for bookmarking.
            </h1>
            <p className="max-w-2xl py-6 text-center text-lg tracking-tight text-slate-200">
              Install the chrome extension helper and you{"'"}ll be set!
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 items-center gap-y-2 overflow-hidden pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0">
            <div className="-mx-4 flex w-full justify-center overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5 lg:justify-end">
              <div className="flex flex-row flex-wrap justify-center gap-5 lg:flex-col lg:justify-end lg:gap-0">
                {tabs.map((tab, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setActive(index);
                    }}
                    className={`cursor-pointer rounded-full border border-white bg-white py-3 px-5 font-brand transition-all lg:rounded-l-lg lg:rounded-r-none lg:p-5 ${
                      index === active
                        ? "border-r-0 border-opacity-30 bg-opacity-20 backdrop-blur-md"
                        : "border-opacity-0 bg-opacity-0 backdrop-blur-none hover:bg-opacity-10"
                    }`}
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl lg:font-semibold">{tab.name}</h3>
                      <p className="text-md hidden max-w-md tracking-tight text-slate-200 lg:block">
                        {tab.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 w-[45rem] overflow-hidden rounded-xl shadow-xl shadow-blue-900/20 sm:w-auto lg:col-span-7 lg:mt-0 lg:w-[67.8125rem]">
              <img
                src={tabs[active].img}
                className="w-full"
                width="100vw"
                height="45rem"
              />
            </div>
          </div>
          {/* <div className="flex flex-col items-center justify-center gap-10">
            <img src={chrome} className="w-96 rounded-lg shadow" />
            <ArrowDownIcon height={30} />
            <img src={bookmarks} className="w-96 rounded-lg shadow" />
          </div> */}
        </div>
      </div>
    </div>
  );
}
