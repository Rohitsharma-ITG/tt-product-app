import { useState } from 'react';
import { message } from 'antd';
import { Api } from '../../../components/api';
import { useNavigate } from "react-router-dom";

export default function useHandleLike() {
  const [likeLoading] = useState<boolean>(false);
  const api = new Api();
  const navigate = useNavigate();

  const handleLikeClick = async (cardToken: string | undefined) => {
    try {
      if (!cardToken) {
        message.error('Card token not provided.');
        return;
      }
      const res = await api.likeCard(cardToken);

      if (res.ok) {
        message.success(res.message || 'Card liked successfully.');
      } else {
        if (res.message?.includes('Unauthorized')) {
          message.error('You need to log in to like a card.');
          navigate('/apps/ugapp/login'); // Redirect to login if unauthorized
        } else {
          message.error(res.message || 'Failed to like the card.');
        }
      }
    } catch (error) {
      console.error('Error liking card:', error);
      message.error('An error occurred while liking the card.');
    }
  };


  return { handleLikeClick, likeLoading };
}
