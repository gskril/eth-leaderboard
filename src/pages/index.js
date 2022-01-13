import { useEffect, useRef, useState } from "react";
import { SWRConfig } from "swr";
import { fetchInitialData, fetchInitialMetadata } from "../staticapi";
import Filters from "../components/Filters";
import FrensTable from "../components/FrensTable";
import Header from "../components/Header";
import Layout from "../components/layout";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

export default function Home({ frensMeta, fallback }) {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [showFixed, setShowFixed] = useState(false);
  const filterDivRef = useRef();

  useScrollPosition(
    ({ _, currPos }) => {
      if (currPos.y < 0 && !showFixed) setShowFixed(true);
      if (currPos.y > 0 && showFixed) setShowFixed(false);
    },
    [showFixed],
    filterDivRef
  );

  return (
    <SWRConfig
      value={{
        fallback,
        revalidateOnReconnect: false,
        revalidateOnFocus: false,
      }}
    >
      <Layout {...{ showFixed }}>
        <Header {...frensMeta}>
          <Filters
            {...{
              page,
              setPage,
              searchInput,
              setSearchInput,
              filterDivRef,
              showFixed,
            }}
          />
        </Header>
        <FrensTable {...{ page, searchInput, showFixed }} />
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
