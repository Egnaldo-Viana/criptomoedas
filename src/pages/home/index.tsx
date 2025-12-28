import React from 'react';
import styles from './home.module.css';
import { BsSearch } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router';

interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

// Interface que define a estrutura da resposta da API
interface DataProp {
  data: CoinProps[];
}

export function Home() {
  const [input, setInput] = React.useState('');
  const [coins, setCoins] = React.useState<CoinProps[]>([]);
  const [offset, setOffset] = React.useState(0);

  const navigate = useNavigate();

  React.useEffect(() => {
    getData();
  }, [offset]);

  // Função responsável por buscar e tratar os dados da API
  async function getData() {
    fetch(
      ` https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=549e64704abf3fadc787a206ddcdcf914137034798207246ad3215286e3a6e9c`,
    )
      // Converte a resposta para JSON
      .then((response) => response.json())
      // Tipagem da resposta usando a interface DataProp
      .then((data: DataProp) => {
        const coinsData = data.data;

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

        const formatedResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
          };

          return formated;
        });

        // console.log(formatedResult);
        const listCoins = [...coins, ...formatedResult];
        setCoins(listCoins);
      });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (input === '') return;

    navigate(`/detail/${input}`);
  }

  function handleGetMore() {
    if (offset === 0) {
      setOffset(10);
      return;
    }
    setOffset(offset + 10);
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda... EX bitcoin"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#fff" />
        </button>
      </form>

      <table>
        {/* Cabeçalho da tabela */}
        <thead>
          <tr>
            {/* scope="col" indica que o th é o cabeçalho da coluna (acessibilidade) */}
            <th scope="col">Moeda</th>
            <th scope="col">Valor Mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>

        {/* Corpo da tabela */}
        <tbody id="tbody">
          {coins.length > 0 &&
            coins.map((item) => (
              /* Linha da tabela representando uma moeda */
              <tr className={styles.tr} key={item.id}>
                {/* Coluna da moeda */}
                <td className={styles.tdLabel} data-label="Moeda">
                  <div className={styles.name}>
                    <img
                      className={styles.logo}
                      src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}2@2x.png`}
                      alt="Logo Cripto"
                    />
                    {/* Link para página de detalhes da moeda */}
                    <Link to={`/detail/${item.id}`}>
                      <span>{item.name}</span> | {item.symbol}
                    </Link>
                  </div>
                </td>

                {/* Coluna do valor de mercado */}
                <td className={styles.tdLabel} data-label="Valor Mercado">
                  {item.formatedMarket}
                </td>

                {/* Coluna do preço */}
                <td className={styles.tdLabel} data-label="Preço">
                  {item.formatedPrice}
                </td>

                {/* Coluna do volume */}
                <td className={styles.tdLabel} data-label="Volume">
                  {item.formatedVolume}
                </td>

                {/* Coluna da variação nas últimas 24 horas */}
                <td
                  className={
                    Number(item.changePercent24Hr) > 0
                      ? styles.tdProfit
                      : styles.tdLoss
                  }
                  data-label="Mudança 24h"
                >
                  <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais
      </button>
    </main>
  );
}
