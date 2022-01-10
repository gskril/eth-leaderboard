import useSWR, { mutate } from "swr";

const frensPath = "/api/frens";
const metaPath = "/api/meta";

export const useFrens = () => useSWR(frensPath);
export const useMeta = () => useSWR(metaPath);
