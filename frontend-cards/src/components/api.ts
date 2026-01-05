import {
  CardCastingShadows,
  CardHereToSlay,
  CardsCastingShadowsResponse,
  CardsHereToSlayResponse
} from "../dto/card.ts";
import { CardImageCastingShadowsResponse, CardImageHereToSlayResponse } from "../dto/card-image.ts";

export class Api {
  baseUrl: string;

  constructor() {
    this.baseUrl = 'https://shopifyapp.unstablegames.com';
  }

  public async getHello(): Promise<string> {
    try {
      const res = await fetch(`${this.baseUrl}/api/`, {
        credentials: 'include'
      });
      if (res.ok) {
        return await res.text();
      }
      return '';
    } catch (error) {
      console.error("Error fetching hello text: ", error);
      return '';
    }
  }

  public async getCastingShadowsCard(token: string): Promise<CardCastingShadows | null> {
    try {
      const res = await fetch(`${this.baseUrl}/app/cards/casting-shadows/${token}`, {
        credentials: 'include'
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (error) {
      console.error("Error fetching game cards: ", error);
      return null;
    }
  }

  public async getHereToSlayCard(token: string): Promise<CardHereToSlay | null> {
    try {
      const res = await fetch(`${this.baseUrl}/app/cards/here-to-slay/${token}`, {
        credentials: 'include'
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (error) {
      console.error("Error fetching game cards: ", error);
      return null;
    }
  }

  public async getCastingShadowsCards(page: number = 1, sort: string = 'popular'): Promise<CardsCastingShadowsResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/app/cards/casting-shadows?page=${page}&sort=${sort}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        return {
          data: data.data.map((card: CardCastingShadows) => ({
            token: card.token,
            cardImage: card.cardImage,
            baseFormName: card.baseFormName,
            shadowFormName: card.shadowFormName,
            baseEffect: card.baseEffect,
            baseEffectCustom: card.baseEffectCustom,
            shadowEffect: card.shadowEffect,
            shadowEffectCustom: card.shadowEffectCustom,
            baseImage: card.baseImage,
            shadowImage: card.shadowImage,
            resultBaseImageUrl: card.resultBaseImageUrl,
            resultShadowImageUrl: card.resultShadowImageUrl,
            resultPdfUrl: card.resultPdfUrl,
            likeCount: card.likeCount,
            firstName: card.firstName,
            lastName: card.lastName
          })),
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
        };
      }
      return { data: [], current_page: 1, last_page: 1, per_page: 0, total: 0 };
    } catch (error) {
      console.error("Error fetching game cards: ", error);
      return { data: [], current_page: 1, last_page: 1, per_page: 0, total: 0 };
    }
  }

  public async getHereToSlayCards(page: number = 1, sort: string = 'popular'): Promise<CardsHereToSlayResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/app/cards/here-to-slay?page=${page}&sort=${sort}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        return {
          data: data.data.map((card: CardHereToSlay) => ({
            token: card.token,
            cardImage: card.cardImage,
            baseImage: card.baseImage,
            characterName: card.characterName,
            characterClass: card.characterClass,
            characterEffect: card.characterEffect,
            characterDescription: card.characterDescription,
            characterImage: card.characterImage,
            characterDisplayName: card.characterDisplayName,
            likeCount: card.likeCount,
            firstName: card.firstName,
            lastName: card.lastName
          })),
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
        };
      }
      return { data: [], current_page: 1, last_page: 1, per_page: 0, total: 0 };
    } catch (error) {
      console.error("Error fetching game cards: ", error);
      return { data: [], current_page: 1, last_page: 1, per_page: 0, total: 0 };
    }
  }

  public async getCardImagesCastingShadows(): Promise<CardImageCastingShadowsResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/app/cards/casting-shadows/card-images`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        return {
          items: data.items,
        };
      }
      return { items: [] };
    } catch (error) {
      console.error("Error fetching game card images: ", error);
      return { items: [] };
    }
  }

  public async getCardImagesHereToSlay(): Promise<CardImageHereToSlayResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/app/cards/here-to-slay/card-images`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        return {
          items: data.items,
        };
      }
      return { items: [] };
    } catch (error) {
      console.error("Error fetching game card images: ", error);
      return { items: [] };
    }
  }

  public async submitCastingShadowsForm(formData: FormData): Promise<{ error?: string, cardToken?: string }> {
    const json = JSON.stringify(Object.fromEntries(formData));
    try {
      const res = await fetch(`${this.baseUrl}/app/cards/casting-shadows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: json,
        credentials: 'include'
      });

      if (res.ok) {
        return await res.json();
      } else {
        const errRes = await res.json();
        if (errRes['error']) {
          return errRes;
        }
      }
      return { error: 'Failed to submit the casting shadows form.' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { error: 'Error submitting the casting shadows form.' };
    }
  }

  public async submitHereToSlayForm(formData: FormData): Promise<{ error?: string, cardToken?: string }> {
    const json = JSON.stringify(Object.fromEntries(formData));
    try {
      const res = await fetch(`${this.baseUrl}/app/cards/here-to-slay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: json,
        credentials: 'include'
      });

      if (res.ok) {
        return await res.json();
      } else {
        const errRes = await res.json();
        if (errRes['error']) {
          return errRes;
        }
      }
      return { error: 'Failed to submit the here to slay form.' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { error: 'Error submitting the here to slay form.' };
    }
  }

  public async submitEmail(email: string, firstName?: string, lastName?: string): Promise<{ ok?: boolean, message: string }> {
    try {
      const body: any = { email };

      // Add first name and last name if provided
      if (firstName && lastName) {
        body.first_name = firstName;
        body.last_name = lastName;
      }

      const res = await fetch(`${this.baseUrl}/app/submit-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (res.ok) {
        return await res.json();
      }
      return { message: 'Failed to submit email.' };
    } catch (error) {
      console.error("Error submitting email: ", error);
      return { message: 'Error submitting email.' };
    }
  }

  public async checkAuthStatus(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/app/auth-status`, {
        method: 'GET',
        credentials: 'include', // Include credentials
      });

      // if (res.ok) {
      //   const data = await res.json();
      //   return data.is_authenticated;
      // }
      return true;
    } catch (error) {
      console.error("Error checking authentication status: ", error);
      return false;
    }
  }

  public async likeCard(cardToken: string): Promise<{ ok: boolean; message?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/app/cards/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ card_id: cardToken }),
      });

      if (res.ok) {
        return { ok: true, message: 'Card liked successfully.' };
      }

      const data = await res.json();

      if (res.status === 401) {
        return { ok: false, message: 'Unauthorized access. Please log in.' };
      }

      return { ok: false, message: data.error || 'Failed to like the card.' };
    } catch (error) {
      console.error('Error liking card:', error);
      return { ok: false, message: 'An error occurred while liking the card.' };
    }
  }

}
