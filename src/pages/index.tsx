import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const CreateLinkForm = dynamic(() => import("../components/create-links"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div className="bg-black">
      <div className="mx-auto flex flex-col min-h-screen px-8 sm:px-4 prose-headings:text-white prose justify-center max-w-[500px] text-white">
        <Suspense>
          <CreateLinkForm />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
