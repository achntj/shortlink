import type { NextPage } from "next";
import { useState } from "react";
import classNames from "classnames";
import debounce from "lodash/debounce";
import { trpc } from "../../utils/trpc";
import copy from "copy-to-clipboard";

type Form = {
  slug: string;
  url: string;
};

const CreateLinkForm: NextPage = () => {
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const url = window.location.origin;

  const slugCheck = trpc.useQuery(["slugCheck", { slug: form.slug }], {
    refetchOnReconnect: false, // replacement for enable: false which isn't respected.
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const createSlug = trpc.useMutation(["createSlug"]);

  const input =
    "text-black my-1 p-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:outline-none focus:ring-0 block w-full rounded-md sm:text-sm focus:ring-1";

  const slugInput = classNames(input, {
    "border-2 border-red-500": slugCheck.isFetched && slugCheck.data!.used,
    "text-red-500": slugCheck.isFetched && slugCheck.data!.used,
  });

  if (createSlug.status === "success") {
    return (
      <>
        <div className="sm:flex justify-center items-center">
          <h3 className="mb-0">{`${url}/${form.slug}`}</h3>
        </div>
        <input
          type="button"
          value="Copy Link"
          className="rounded bg-cyan-500 py-1.5 px-1 font-bold cursor-pointer m-5 hover:bg-cyan-600 active:bg-cyan-700"
          onClick={() => {
            copy(`${url}/${form.slug}`);
          }}
        />

        <input
          type="button"
          value="Create More!"
          className="rounded bg-cyan-500 py-1.5 px-1 font-bold cursor-pointer m-5 hover:bg-cyan-600 active:bg-cyan-700"
          onClick={() => {
            createSlug.reset();
            setForm({ slug: "", url: "" });
          }}
        />
      </>
    );
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSlug.mutate({ ...form });
        }}
      >
        <h1 className="text-xl sm:text-4xl my-0">URL Shortener</h1>
        <h2 className="text-base sm:text-xl mt-0">
          Created by{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://achintyajha.com/"
            className="text-pink-600"
          >
            Achintya.
          </a>
        </h2>
        {slugCheck.data?.used && (
          <span className="font-medium text-center text-red-500">
            <code className="text-white">{form.slug}</code> is taken, please try
            something else.
          </span>
        )}
        <div className="sm:flex items-center">
          <span className="font-medium mr-2">Slug</span>
          <input
            type="text"
            onChange={(e) => {
              setForm({
                ...form,
                slug: e.target.value,
              });
              debounce(slugCheck.refetch, 100);
            }}
            minLength={1}
            placeholder="some-link"
            className={slugInput}
            value={form.slug}
            pattern={"^[-a-zA-Z0-9]+$"}
            title="Use alphanumeric characters and hyphens only."
            required
          />
        </div>
        <div className="sm:flex items-center">
          <span className="font-medium mr-2">Link</span>
          <input
            type="url"
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://example.com"
            title="Enter the URL here."
            className={input}
            required
          />
        </div>
        <input
          type="submit"
          value="Generate"
          className={`rounded w-full bg-cyan-500 p-1 font-bold cursor-no-drop mt-1 opacity-50 ${
            !slugCheck.data?.used &&
            form.slug != "" &&
            "!opacity-100 !cursor-pointer"
          }`}
          disabled={slugCheck.isFetched && slugCheck.data!.used}
        />
      </form>
    </>
  );
};

export default CreateLinkForm;
