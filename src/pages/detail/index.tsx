import React from 'react';
import { useParams, useNavigate } from 'react-router';
import type { CoinProps } from '../home';
import styles from './detail.module.css';

interface ResponseData {
  data: CoinProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export function Detail() {
  const { cripto } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = React.useState<CoinProps>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function getCoin() {
      try {
        fetch(
          `https://rest.coincap.io/v3/assets/${cripto}?apiKey=549e64704abf3fadc787a206ddcdcf914137034798207246ad3215286e3a6e9c`,
        )
          .then((response) => response.json())
          .then((data: DataProps) => {
            if ('error' in data) {
              navigate('/');
              return;
            }
            // Formatação de valores monetários (preço normal)
            const price = Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            });

            // Formatação compacta (milhões, bilhões, etc.)
            const priceCompact = Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
            });

            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(
                Number(data.data.marketCapUsd),
              ),
              formatedVolume: priceCompact.format(
                Number(data.data.volumeUsd24Hr),
              ),
            };
            setCoin(resultData);
            setLoading(false);
          });
      } catch (err) {
        console.log(err);
        navigate('/');
      }
    }

    getCoin();
  }, [cripto]);

  if (loading || !coin) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando detalhes...</h4>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coin?.name}</h1>
      <h1 className={styles.center}>{coin?.symbol}</h1>

      <section className={styles.content}>
        <img
          src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLocaleLowerCase()}2@2x.png`}
          alt="Logo da moeda"
          className={styles.logo}
        />
        <h1>
          {coin?.name} | {coin?.symbol}
        </h1>
        <p>
          <strong>Preço:</strong> {coin?.formatedPrice}
        </p>
        <a>
          <strong>Mercado: </strong>
          {coin?.formatedMarket}
        </a>
        <a>
          <strong>Volume: </strong>
          {coin?.formatedVolume}
        </a>

        <a>
          <strong>Mudança 24h: </strong>
          <span
            className={
              Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss
            }
          >
            {Number(coin?.changePercent24Hr).toFixed(3)}
          </span>
        </a>
      </section>
    </div>
  );
}
