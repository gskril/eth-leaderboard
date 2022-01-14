import useSWR, { mutate } from "swr";
import { server } from "./config";

const frensPath = "/api/frens?";
const metaPath = "/api/meta";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const initialFetchMeta = () =>
  fetch(server + metaPath).then((res) => res.json());
export const initialFetchFrens = () =>
  fetch(server + frensPath).then((res) => res.json());

export const useFrens = (params = {}) => {
  const searchParams = new URLSearchParams();
  params.verifiedFilter !== undefined &&
    searchParams.append(
      "verified",
      params.verifiedFilter === "Yes" ? "true" : "false"
    );
  params.count && searchParams.append("count", params.count);
  params.page &&
    searchParams.append("skip", params.page * (params.count || 100));
  params.searchInput && searchParams.append("q", params.searchInput);

  return useSWR(frensPath + searchParams.toString(), fetcher);
};

export const useMeta = () => useSWR(metaPath);
