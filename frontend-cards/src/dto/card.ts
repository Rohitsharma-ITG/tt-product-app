export interface CardCastingShadows
{
  token: string;
  cardImage?: string;
  baseFormName?: string;
  shadowFormName?: string;
  baseEffect?: string;
  baseEffectCustom?: string;
  shadowEffect?: string;
  shadowEffectCustom?: string;
  baseImage?: string;
  shadowImage?: string;
  resultBaseImageUrl?: string;
  resultShadowImageUrl?: string;
  resultPdfUrl?: string;
  likeCount: number;
  firstName?: string;
  lastName?: string;
}

export interface Card {
  token: string;
  cardImage: string;
  baseFormName: string;
  shadowFormName: string;
  baseEffect: string;
  baseEffectCustom: string;
  shadowEffect: string;
  shadowEffectCustom: string;
  baseImage: string;
  shadowImage: string;
  resultBaseImageUrl: string;
  resultShadowImageUrl: string;
  resultPdfUrl: string;
  likeCount: number;
  fistName: string;
  lastName: string;
}

export interface CardsCastingShadowsResponse {
  data: CardCastingShadows[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CardsResponse {
  data: Card[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CardHereToSlay
{
  token: string;
  cardImage?: string;
  baseImage?: string;
  characterName?: string;
  characterClass?: string;
  characterEffect?: string;
  characterDescription?: string;
  characterImage?: string;
  characterDisplayName?: string;
  likeCount: number;
  firstName?: string;
  lastName?: string;
}

export interface CardsHereToSlayResponse {
  data: CardHereToSlay[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
