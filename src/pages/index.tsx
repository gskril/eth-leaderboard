import { SWRConfig } from 'swr';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

import { fetchInitialData, fetchInitialMetadata } from '../staticapi';
import { Metadata } from '../types';
import Filters from '../components/Filters';
import FrensTable from '../components/FrensTable';
import Header from '../components/Header';
import Layout from '../components/Layout';
import Modal from '../components/Modal';

interface HomeProps {
  frensMeta: Metadata;
  fallback: { [key: string]: any } | undefined;
}

export default function Home({ frensMeta, fallback }: HomeProps) {
  const router = useRouter();
  const initialQuery = useRef<{ q?: string; page?: number | null }>({});
  const [searchInput, _setSearchInput] = useState('');
  const [page, _setPage] = useState(0);
  const [showFixed, setShowFixed] = useState(false);
  const filterDivRef = useRef() as RefObject<HTMLDivElement>;

  const changeRouter = (change: { [key: string]: string | number | null }) => {
    const query = {
      ...router.query,
      ...change,
    };
    Object.keys(query).forEach(
      (key) => query[key] === null && delete query[key]
    );
    router.push(
      {
        query,
      },
      undefined,
      { shallow: true }
    );
  };

  const setPage = (inputPage: number) => {
    _setPage(inputPage);
    changeRouter({ page: inputPage > 0 ? inputPage + 1 : null });
  };

  const setSearchInput = (input: string) => {
    _setSearchInput(input);
    _setPage(0);
    changeRouter({ q: input.length > 0 ? input : null, page: null });
  };

  useScrollPosition(
    ({ currPos }) => {
      if (currPos.y < 0 && !showFixed) setShowFixed(true);
      if (currPos.y > 0 && showFixed) setShowFixed(false);
    },
    [showFixed],
    filterDivRef as unknown as any
  );

  useEffect(() => {
    if (window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      const { q, page: _pageQuery } = Object.fromEntries(urlParams.entries());
      const pageQuery = _pageQuery ? parseInt(_pageQuery as string) : null;
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
            page={page}
            setPage={setPage}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            filterDivRef={filterDivRef}
            showFixed={showFixed}
            initialQuery={initialQuery as unknown as any}
          />
        </Header>
        {modalIsOpen && (
          <Modal setIsOpen={setModalIsOpen} fren={selectedFren} />
        )}
        <FrensTable
          page={page}
          searchInput={searchInput}
          setModalIsOpen={setModalIsOpen}
          setSelectedFren={setSelectedFren}
        />
      </Layout>
    </SWRConfig>
  );
}

export async function getStaticProps() {
  const frensData = await fetchInitialData({});
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
