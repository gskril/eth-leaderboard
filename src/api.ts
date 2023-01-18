import useSWR from 'swr';

const frensPath = '/api/frens?';

const fetcher = (args: RequestInfo) => fetch(args).then((res) => res.json());

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
