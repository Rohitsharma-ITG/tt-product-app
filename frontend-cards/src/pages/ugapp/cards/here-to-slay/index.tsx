import { useState, useEffect, useCallback } from 'react';
import { Button, Col, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Api } from '../../../../components/api';
import { CardHereToSlay, CardsHereToSlayResponse } from '../../../../dto/card';
import useHandleLike from '../useHandleLike'; // Import the custom hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function HereToSlayPage() {
  const api = new Api();
  const navigate = useNavigate();
  const { handleLikeClick, likeLoading } = useHandleLike(); // Use the hook

  const [cards, setCards] = useState<CardHereToSlay[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>('popular'); // Default sort option

  useEffect(() => {
    setPage(1);
    setCards([]);
    setHasMore(true);
  }, [sortOption]);

  useEffect(() => {
    fetchCards();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, sortOption]);

  const fetchCards = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const res: CardsHereToSlayResponse = await api.getHereToSlayCards(page, sortOption);

    setCards(prevCards => [...prevCards, ...res.data]);
    setHasMore(res.current_page < res.last_page);
    setLoading(false);
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [hasMore, loading]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const handleCreateClick = async () => {
    localStorage.setItem('ug-card-url', '/apps/ugapp/cards/here-to-slay/create');
    const isAuthenticated = await api.checkAuthStatus();
    if (isAuthenticated) {
      navigate('/apps/ugapp/cards/here-to-slay/create');
    } else {
      navigate('/apps/ugapp/login');
    }
  };

  const getCharacterClassIconUrl = (characterClass: string | undefined) => {
    switch (characterClass) {
      case 'Bard':
        return 'https://unstablegames-web.s3.us-east-2.amazonaws.com/assets/Icon_Bard.png';
      case 'Druid':
        return 'https://unstablegames-web.s3.us-east-2.amazonaws.com/assets/Icon_Druid.png';
      case 'Fighter':
        return 'https://unstablegames-web.s3.us-east-2.amazonaws.com/assets/Icon_Fighter.png';
      case 'Ranger':
        return 'https://unstablegames-web.s3.us-east-2.amazonaws.com/assets/Icon_Ranger.png';
      case 'Thief':
        return 'https://unstablegames-web.s3.us-east-2.amazonaws.com/assets/Icon_Thief.png';
      case 'Warrior':
        return 'https://unstablegames-web.s3.us-east-2.amazonaws.com/assets/Icon_Warrior.png';
      case 'Wizard':
        return 'https://unstablegames-web.s3.us-east-2.amazonaws.com/assets/Icon_Wizard.png';
      case 'Guardian':
        return 'https://unstablegames-web.s3.us-east-2.amazonaws.com/assets/Icon_Guardian.png';
      default:
        return '';
    }
  };

  return (
    <div className="hts-here-to-slay">
      <h1>Here to Slay - Custom Party Leaders</h1>
      <div className="card-buttons">
        <Button type="primary" onClick={handleCreateClick}>
          Create your own
        </Button>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={12} lg={6}>
          <Select
            defaultValue=""
            style={{ width: '100%' }}
            options={[
              { value: '', label: 'Show All' },
              { value: 'favorites', label: 'Favorites' },
            ]}
          />
        </Col>
        <Col xs={0} lg={12}></Col>
        <Col xs={12} lg={6}>
          <Select
            defaultValue="popular"
            style={{ width: '100%' }}
            onChange={(value) => handleSortChange(value as string)}
            options={[
              { value: 'popular', label: 'Sort By: Most Popular This Week' },
              { value: '-created', label: 'Sort By: Newest' },
              { value: 'created', label: 'Sort By: Oldest' },
              { value: '-like_count', label: 'Sort By: Most Popular' },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {cards.map((card, index) => (
          <Col xs={24} sm={24} md={8} lg={6} key={card.token + index}>
            <div className="casting-shadows character-card">
              <Row className="image-row">
                <Col span={24}>
                  <div className="character-image">
                    <a data-pjax="0" href={`/apps/ugapp/cards/here-to-slay/view?t=${card.token}`}>
                      <img className="card-image" src={card.baseImage} alt={`${card.characterName} Base`} />
                    </a>
                  </div>
                </Col>
              </Row>
              <div className="text-left card-details">
                <div className={"hts-card-name"}>
                  <span className="card-details--desc">{card.characterName}</span>
                </div>
                <div className={"hts-character-class " + card.characterClass?.toLowerCase()}>
                  <img
                    className="hts-character-class-icon"
                    src={getCharacterClassIconUrl(card.characterClass)}
                    alt={card.characterClass}
                  />
                  {card.characterClass} Party Leader
                </div>
                <div>
                  <span className="card-details--desc">{card.characterDescription}</span>
                </div>
              </div>
              <div className="character-footer">
                <div className="favorite">
                  <Button
                    onClick={() => handleLikeClick(card.token)}
                    loading={likeLoading}
                    className="heart-action"
                  >
                    <FontAwesomeIcon icon={faHeart} /> {card.likeCount}
                  </Button>
                </div>
                <div className="author">
                  by <strong>{card.firstName} {card.lastName}</strong>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      {loading && <div className="loading-indicator">Loading...</div>}
    </div>
  );
}
