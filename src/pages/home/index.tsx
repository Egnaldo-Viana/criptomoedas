import styles from './home.module.css';
import { BsSearch } from 'react-icons/bs';
import { Link } from 'react-router';

export function Home() {
  return (
    <main className={styles.container}>
      <form className={styles.form}>
        <input type="text" placeholder="Digite o nome da moeda... EX bitcoin" />
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
          {/* Linha da tabela representando uma moeda */}
          <tr className={styles.tr}>
            {/* Coluna da moeda */}
            <td className={styles.tdLabel} data-label="Moeda">
              <div className={styles.name}>
                {/* Link para página de detalhes da moeda */}
                <Link to={'/detail/bitcoin'}>
                  <span>Bitcoin</span> | BTC
                </Link>
              </div>
            </td>

            {/* Coluna do valor de mercado */}
            <td className={styles.tdLabel} data-label="Valor Mercado">
              1T
            </td>

            {/* Coluna do preço */}
            <td className={styles.tdLabel} data-label="Preço">
              8.4557
            </td>

            {/* Coluna do volume */}
            <td className={styles.tdLabel} data-label="Volume">
              5B
            </td>

            {/* Coluna da variação nas últimas 24 horas */}
            <td className={styles.tdProfit} data-label="Mudança 24h">
              <span>1.20</span>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
