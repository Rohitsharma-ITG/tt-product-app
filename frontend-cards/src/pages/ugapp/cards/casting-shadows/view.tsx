import { useState, useEffect } from 'react';
import { Button, Col, Row, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { Api } from '../../../../components/api';
import { CardCastingShadows } from '../../../../dto/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import useHandleLike from '../useHandleLike'; // Import custom like handler

export default function CastingShadowsViewPage() {
  const api = new Api();
  const navigate = useNavigate();
  const { handleLikeClick, likeLoading } = useHandleLike(); // Use like handler hook

  const [card, setCard] = useState<CardCastingShadows | null>(null);
  const [mostPopularCards, setMostPopularCards] = useState<CardCastingShadows[]>([]);
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
    const res: CardCastingShadows | null = await api.getCastingShadowsCard(token);
    if (!res) {
      navigate('/apps/ugapp/not-found');
      return;
    }
    setCard(res);
    setLoading(false);
  };

  const fetchMostPopularCards = async () => {
    try {
      const res = await api.getCastingShadowsCards(1, 'popular');
      setMostPopularCards(res.data);
    } catch (error) {
      console.error("Error fetching popular cards", error);
    } finally {
      setLoadingPopular(false);
    }
  };

  return (
    <div className="cc-casting-shadows">
      <Row justify={'center'}>
        <Col xs={24} lg={12}>
          <Row gutter={[8, 8]} className="image-row">
            <Col span={12}>
              <div className="character-image">
                {loading ? (
                  <Skeleton.Image active />
                ) : (
                  <>
                    <img className="card-image" src={card?.resultBaseImageUrl}
                         alt={`${card?.baseEffect} Base`} />
                    <img className="dials-overlay" src="https://unstablegames-web.s3.us-east-2.amazonaws.com/assets/template_card_base_dials.png"
                         alt={`${card?.baseEffect} Dials`} />
                  </>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div className="character-image">
                {loading ? (
                  <Skeleton.Image active />
                ) : (
                  <>
                    <img className="card-image" src={card?.resultShadowImageUrl}
                         alt={`${card?.shadowEffect} Shadow`} />
                    <img className="dials-overlay" src="https://unstablegames-web.s3.us-east-2.amazonaws.com/assets/template_card_shadow_dials.png"
                         alt={`${card?.shadowEffect} Dials`} />
                  </>
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
                    disabled={!card} // Disable if card is not yet loaded
                  >
                    <FontAwesomeIcon icon={faHeart} /> {card?.likeCount}
                  </Button>
                )}
              </div>
            </div>
            <div className="author float-right">
              {loading ? <Skeleton.Input style={{ width: 100 }} active /> : <>by <strong>{card?.firstName} {card?.lastName}</strong></>}
            </div>
          </div>
        </Col>
      </Row>

      <Row justify={'center'}>
        <Col xs={24} lg={12}>
          <div className="bottom-buttons">
            <Button onClick={() => navigate('/apps/ugapp/cards/casting-shadows')} style={{ marginRight: '10px' }}>
              {loading ? <Skeleton.Input style={{ width: 100 }} active /> : 'Browse All Cards'}
            </Button>
            <Button onClick={() => window.open(card?.resultPdfUrl, "_blank")}>
              {loading ? <Skeleton.Input style={{ width: 100 }} active /> : 'Download/Print'}
            </Button>
          </div>
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
            : mostPopularCards.map((popularCard) => (
              <Col xs={24} sm={24} md={12} lg={12} key={popularCard.token}>
                <div className="casting-shadows character-card">
                  <Row gutter={[8, 8]} className="image-row">
                    <Col span={12}>
                      <div className="character-image">
                        <a href={`/apps/ugapp/cards/casting-shadows/view?t=${popularCard.token}`}>
                          <img className="card-image" src={popularCard.baseImage} alt={`${popularCard.baseFormName} Base`} />
                        </a>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="character-image">
                        <a href={`/apps/ugapp/cards/casting-shadows/view?t=${popularCard.token}`}>
                          <img className="card-image" src={popularCard.shadowImage} alt={`${popularCard.shadowFormName} Shadow`} />
                        </a>
                      </div>
                    </Col>
                  </Row>
                  <div className="text-left card-details">
                    <p><span className="card-details--name">Base Form Name:</span> {popularCard.baseFormName}</p>
                    <p><span className="card-details--name">Shadow Form Name:</span> {popularCard.shadowFormName}</p>
                    <p><span className="card-details--ability">Shadow Form Ability:</span> {popularCard.shadowEffectCustom}</p>
                  </div>
                  <div className="character-footer">
                    <div className="favorite">
                      <Button
                        onClick={() => handleLikeClick(popularCard.token)}
                        loading={likeLoading}
                        className="heart-action"
                      >
                        <FontAwesomeIcon icon={faHeart} /> {popularCard.likeCount}
                      </Button>
                    </div>
                    <div className="author">by <strong>{popularCard.firstName} {popularCard.lastName}</strong></div>
                  </div>
                </div>
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
}
