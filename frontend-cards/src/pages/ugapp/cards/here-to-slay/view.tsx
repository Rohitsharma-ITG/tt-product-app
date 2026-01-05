import { useState, useEffect } from 'react';
import { Button, Col, Row, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { Api } from '../../../../components/api';
import { CardHereToSlay } from '../../../../dto/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import useHandleLike from '../useHandleLike'; // Import the like handler

export default function HereToSlayViewPage() {
  const api = new Api();
  const navigate = useNavigate();
  const { handleLikeClick, likeLoading } = useHandleLike(); // Hook for like handling

  const [card, setCard] = useState<CardHereToSlay | null>(null);
  const [mostPopularCards, setMostPopularCards] = useState<CardHereToSlay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPopular, setLoadingPopular] = useState<boolean>(true);

  useEffect(() => {
    fetchCard();
    fetchMostPopularCards();
  }, []);

  const fetchCard = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('t');
    if (!token) {
      navigate('/apps/ugapp/not-found');
      return;
    }
    const res: CardHereToSlay | null = await api.getHereToSlayCard(token);
    if (!res) {
      navigate('/apps/ugapp/not-found');
      return;
    }
    setCard(res);
    setLoading(false);
  };

  const fetchMostPopularCards = async () => {
    try {
      const res = await api.getHereToSlayCards(1, 'popular');
      setMostPopularCards(res.data);
    } catch (error) {
      console.error("Error fetching popular cards", error);
    } finally {
      setLoadingPopular(false);
    }
  };

  return (
    <div className="hts-here-to-slay">
      <Row justify={'center'}>
        <Col xs={24} lg={12}>
          <Row gutter={[8, 8]} className="image-row">
            <Col span={24}>
              <div className="character-image">
                {loading ? (
                  <Skeleton.Image active />
                ) : (
                  <img className="card-image" src={card?.cardImage} alt={`${card?.characterEffect} Base`} />
                )}
              </div>
            </Col>
          </Row>
          <div className="character-footer justify-content-between align-items-end">
            <div className="overlay-bg float-left">
              <div className="favorite d-flex align-items-center">
                {loading ? (
                  <Skeleton.Button active size="small" shape="default" />
                ) : (
                  <Button
                    onClick={() => handleLikeClick(card?.token)}
                    loading={likeLoading}
                    className="heart-action"
                  >
                    <FontAwesomeIcon icon={faHeart} /> {card?.likeCount}
                  </Button>
                )}
              </div>
            </div>
            <div className="author float-right">
              {loading ? (
                <Skeleton.Input style={{ width: 100 }} active />
              ) : (
                <>by <strong>{card?.firstName || 'Anonymous'} {card?.lastName || ''}</strong></>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row justify={'center'} style={{ marginTop: '20px' }}>
        <Col xs={24} lg={12}>
          {loading ? (
            <Skeleton.Button active style={{ width: 150, marginRight: 10 }} />
          ) : (
            <Button onClick={() => navigate('/apps/ugapp/cards/here-to-slay')} style={{ marginRight: '10px' }}>
              Browse All Cards
            </Button>
          )}

          {loading ? (
            <Skeleton.Button active style={{ width: 150 }} />
          ) : (
            <Button onClick={() => window.open(card?.cardImage, "_blank")}>
              Download/Print
            </Button>
          )}
        </Col>
      </Row>

      <div className="popular-cards-section" style={{ marginTop: '40px' }}>
        <h2>Most Popular Cards</h2>
        <Row gutter={[16, 16]} justify="center">
          {loadingPopular
            ? Array(4).fill(0).map((_, i) => (
              <Col xs={24} sm={12} lg={6} key={i}>
                <Skeleton.Image active />
                <Skeleton.Input style={{ marginTop: '10px' }} active />
              </Col>
            ))
            : mostPopularCards.slice(0, 4).map((popularCard, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <a href={`/apps/ugapp/cards/here-to-slay/view?t=${popularCard.token}`}>
                  <div className="popular-card">
                    <img src={popularCard.cardImage} alt={popularCard.characterName} className="card-image" />
                    <div className="popular-card-details">
                      <p>{popularCard.characterName}</p>
                    </div>
                  </div>
                </a>
              </Col>
            ))}
        </Row>
        <Row gutter={[16, 16]} justify="center" style={{ marginTop: '20px' }}>
          {loadingPopular
            ? Array(4).fill(0).map((_, i) => (
              <Col xs={24} sm={12} lg={6} key={i}>
                <Skeleton.Image active />
                <Skeleton.Input style={{ marginTop: '10px' }} active />
              </Col>
            ))
            : mostPopularCards.slice(4, 8).map((popularCard, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <a href={`/apps/ugapp/cards/here-to-slay/view?t=${popularCard.token}`}>
                  <div className="popular-card">
                    <img src={popularCard.cardImage} alt={popularCard.characterName} className="card-image" />
                    <div className="popular-card-details">
                      <p>{popularCard.characterName}</p>
                    </div>
                  </div>
                </a>
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
}
