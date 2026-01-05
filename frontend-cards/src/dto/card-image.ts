// Casting Shadows
export interface CardImageCastingShadows {
  cardSide: string;
  src: string;
  thumb: string;
  name: string;
  type: string;
  file: string;
}

export interface CardImagePairCastingShadows {
  groupToken: string;
  baseImage: CardImageCastingShadows;
  shadowImage: CardImageCastingShadows;
}

export interface CardImageCastingShadowsResponse {
  items: CardImagePairCastingShadows[];
}

// Here to Slay
export interface CardImageHereToSlay {
  id: number;
  src: string;
  thumb: string;
  name: string;
  type: string;
}

export interface CardImageHereToSlayResponse {
  items: CardImageHereToSlay[];
}
