import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SWRConfig } from 'swr';
import { fetchInitialData, fetchInitialMetadata } from '../staticapi';
import Filters from '../components/Filters';
import FrensTable from '../components/FrensTable';
import Header from '../components/Header';
import Layout from '../components/layout';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useRouter } from 'next/router';
import Modal from '../components/Modal';

export default function Home({ frensMeta, fallback }) {
  const router = useRouter();
  const initialQuery = useRef();
  const [searchInput, _setSearchInput] = useState('');
  const [page, _setPage] = useState(0);
  const [showFixed, setShowFixed] = useState(false);
  const filterDivRef = useRef();

  const changeRouter = (change) => {
    const query = {
      ...router.query,
      ...change,
    };
    Object.keys(query).forEach(
      (key) => query[key] === null && delete query[key]
    );
    console.log('setting query to', query);
    router.push(
      {
        query,
      },
      undefined,
      { shallow: true }
    );
  };

  const setPage = (inputPage) => {
    _setPage(inputPage);
    changeRouter({ page: inputPage > 0 ? inputPage + 1 : null });
  };

  const setSearchInput = (input) => {
    _setSearchInput(input);
    _setPage(0);
    changeRouter({ q: input.length > 0 ? input : null, page: null });
  };

  useScrollPosition(
    ({ _, currPos }) => {
      if (currPos.y < 0 && !showFixed) setShowFixed(true);
      if (currPos.y > 0 && showFixed) setShowFixed(false);
    },
    [showFixed],
    filterDivRef
  );

  useEffect(() => {
    if (window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      const { q, page: pageQuery } = Object.fromEntries(urlParams.entries());
      if (q) _setSearchInput(q);
      if (pageQuery) _setPage(pageQuery - 1);
      initialQuery.current = { q, page: pageQuery };
    }
  }, []);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFren, setSelectedFren] = useState(null);

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
              initialQuery,
            }}
          />
        </Header>
        {modalIsOpen && (
          <Modal setIsOpen={setModalIsOpen} fren={selectedFren} />
        )}
        <FrensTable
          {...{ page, searchInput, showFixed, setModalIsOpen, setSelectedFren }}
        />
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
        '/api/frens?': frensData,
      },
    },
    revalidate: 300,
  };
}
