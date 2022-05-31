import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreateLinkForm = dynamic(() => import("../components/create-links"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div className="bg-zinc-900">
      <div className="max-w-[700px] mx-auto flex flex-col min-h-screen px-8 sm:px-4 prose-headings:text-white prose justify-center max-w-[500px] text-white">
        <Suspense>
          <CreateLinkForm />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
