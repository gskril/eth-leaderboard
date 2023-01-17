export interface Fren {
  id: string;
  name: string;
  ens: string;
  handle: string;
  followers: number;
  verified: boolean;
  updated: string;
  pfp: string;
  ranking: number;
}

interface Nft {
  id: number;
  permalink: string;
  image_preview_url: string;
}

export interface OpenseaResponse {
  assets: Nft[];
}
