import { useState, useEffect, useCallback } from 'react';
import { Button, Col, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Api } from '../../../../components/api';
import { CardCastingShadows, CardsCastingShadowsResponse } from '../../../../dto/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import useHandleLike from '../useHandleLike'; // Import the custom hook

export default function CastingShadowsPage() {
  const api = new Api();
  const navigate = useNavigate();
  const { handleLikeClick, likeLoading } = useHandleLike(); // Use the hook

  const [cards, setCards] = useState<CardCastingShadows[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>('popular'); // Default sort option

  // Reset page and card list when sort option changes
  useEffect(() => {
    setPage(1);
    setCards([]);
    setHasMore(true);
  }, [sortOption]);

  // Fetch cards when page or sort option changes
  useEffect(() => {
    fetchCards();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, sortOption]);

  const fetchCards = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const res: CardsCastingShadowsResponse = await api.getCastingShadowsCards(page, sortOption);

    setCards(prevCards => [...prevCards, ...res.data]);
    setHasMore(res.current_page < res.last_page);
    setLoading(false);
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight && hasMore) {
      setPage(prevPage => prevPage + 1); // Increment page
    }
  }, [hasMore, loading]);

  const handleSortChange = (value: string) => {
    setSortOption(value); // Trigger useEffect to reset and fetch new sorted cards
  };

  const handleCreateClick = async () => {
    localStorage.setItem('ug-card-url', '/apps/ugapp/cards/casting-shadows/create');
    const isAuthenticated = await api.checkAuthStatus();
    if (isAuthenticated) {
      navigate('/apps/ugapp/cards/casting-shadows/create');
    } else {
      navigate('/apps/ugapp/login'); // Redirect to login page if not authenticated
    }
  };

  return (
    <div className="cc-casting-shadows">
      <h1>Casting Shadows - Custom Player Boards</h1>
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
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: '30px' }}>
        {cards.map((card) => (
          <Col xs={24} sm={24} md={12} lg={12} key={card.token}>
            <div className="casting-shadows character-card">
              <Row gutter={[8, 8]} className="image-row">
                <Col span={12}>
                  <div className="character-image">
                    <a href={`/apps/ugapp/cards/casting-shadows/view?t=${card.token}`}>
                      <img className="card-image" src={card.baseImage} alt={`${card.baseFormName} Base`} />
                    </a>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="character-image">
                    <a href={`/apps/ugapp/cards/casting-shadows/view?t=${card.token}`}>
                      <img className="card-image" src={card.shadowImage} alt={`${card.shadowFormName} Shadow`} />
                    </a>
                  </div>
                </Col>
              </Row>
              <div className="text-left card-details">
                <p><span className="card-details--name">Base Form Name:</span> {card.baseFormName}</p>
                <p><span className="card-details--name">Shadow Form Name:</span> {card.shadowFormName}</p>
                <p><span className="card-details--ability">Shadow Form Ability:</span> {card.shadowEffectCustom}</p>
              </div>
              <div className="character-footer">
                <div className="favorite">
                  <Button
                    onClick={() => handleLikeClick(card.token)}
                    loading={likeLoading}
                    className="heart-action"
                  >
                    <FontAwesomeIcon icon={faHeart}/> {card.likeCount}
                  </Button>
                </div>
                <div className="author">by <strong>{card.firstName} {card.lastName}</strong></div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      {loading && <div className="loading-indicator">Loading...</div>}
    </div>
  );
}
