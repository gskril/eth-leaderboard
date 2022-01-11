import { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { initialFetchFrens, initialFetchMeta } from "../api";
import Filters from "../components/Filters";
import FrensTable from "../components/FrensTable";
import Header from "../components/Header";
import Layout from "../components/layout";

export default function Home({ frensMeta, fallback }) {
  const [verifiedFilter, setVerifiedFilter] = useState("All");
  const [searchInput, setSearchInput] = useState("");

  return (
    <SWRConfig
      value={{
        fallback,
        revalidateOnReconnect: false,
        revalidateOnFocus: false,
      }}
    >
      <Layout>
        <Header {...frensMeta}>
          <Filters
            {...{
              verifiedFilter,
              setVerifiedFilter,
              searchInput,
              setSearchInput,
            }}
          />
        </Header>
        <FrensTable {...{ verifiedFilter, searchInput }} />
      </Layout>
    </SWRConfig>
  );
}

export async function getStaticProps() {
  const frensData = await initialFetchFrens();
  const frensMeta = await initialFetchMeta();
  return {
    props: {
      frensMeta,
      fallback: {
        "/api/frens?": frensData,
      },
    },
    revalidate: 300,
  };
}
