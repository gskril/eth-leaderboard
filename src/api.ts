import useSWR from 'swr';

import { server } from './config';

const frensPath = '/api/frens?';
const metaPath = '/api/meta';

const fetcher = (args: RequestInfo) => fetch(args).then((res) => res.json());

export const initialFetchMeta = () =>
  fetch(server + metaPath).then((res) => res.json());
export const initialFetchFrens = () =>
  fetch(server + frensPath).then((res) => res.json());

interface UseFrens {
  searchInput?: string;
  page?: number;
}

export const useFrens = ({ searchInput, page }: UseFrens) => {
  const searchParams = new URLSearchParams();

  if (page) {
    const skip = page * 100;
    searchParams.append('skip', skip.toString());
  }

  if (searchInput) {
    searchParams.append('q', searchInput);
  }

  return useSWR(frensPath + searchParams.toString(), fetcher);
};
