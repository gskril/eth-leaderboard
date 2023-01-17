export interface Fren {
  id: string;
  name: string;
  ens: string;
  handle: string;
  followers: number;
  verified: boolean;
  updated: Date;
  pfp: string;
  ranking: number;
}

export interface DatabaseFren extends Fren {
  avatar: string;
  pfp: never;
}

interface Nft {
  id: number;
  permalink: string;
  image_preview_url: string;
}

export interface OpenseaResponse {
  assets: Nft[];
}
