import { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { fetchInitialData, fetchInitialMetadata } from "../staticapi";
import Filters from "../components/Filters";
import FrensTable from "../components/FrensTable";
import Header from "../components/Header";
import Layout from "../components/layout";

export default function Home({ frensMeta, fallback }) {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);

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
              page,
              setPage,
              searchInput,
              setSearchInput,
            }}
          />
        </Header>
        <FrensTable {...{ page, searchInput }} />
      </Layout>
    </SWRConfig>
  );
}

export async function getStaticProps() {
  const frensData = await fetchInitialData();
  const frensMeta = await fetchInitialMetadata();
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
