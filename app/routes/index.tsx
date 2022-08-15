import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "express";
import CTA from "~/components/CTA";
import ExtensionSection from "~/components/ExtensionSection";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Hero from "~/components/Hero";
import TeamsSection from "~/components/TeamsSection";
import { getUserId } from "~/session.server";

import { useOptionalUser } from "~/utils";

import logo from "~/branding/UN.png";
import invariant from "tiny-invariant";

export const meta: MetaFunction = () => {
  return {
    title: "Unified Bookmarks",
    description: "Home of Unifed Bookmarks",
    "twitter:card": "summary_large_image",
    "og:description": "Home of Unified Bookmarks",
    "og:image": logo,
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard/teams");
  return null;
};

export default function Index() {
  return (
    <div data-theme="dark">
      <Header />
      <Hero />
      <TeamsSection />
      <ExtensionSection />
      <CTA />
      <Footer />
    </div>
  );
}
