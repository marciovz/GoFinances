import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface TransactionsApi {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  created_at: Date;
  category: { title: string };
}

interface ResponseTransactionApi {
  data: {
    transactions: TransactionsApi[];
    balance: Balance;
  };
}

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
  incomeFormated: string;
  outcomeFormated: string;
  totalFormated: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response: ResponseTransactionApi = await api.get('transactions');

      const transactionsResponse = response.data.transactions.map(
        transactionResponse => ({
          ...transactionResponse,
          formattedValue: formatValue(transactionResponse.value),
          formattedDate: formatDate(String(transactionResponse.created_at)),
        }),
      );

      const balanceResponse = {
        ...response.data.balance,
        incomeFormated: formatValue(Number(response.data.balance.income)),
        outcomeFormated: formatValue(Number(response.data.balance.outcome)),
        totalFormated: formatValue(Number(response.data.balance.total)),
      };

      setTransactions(transactionsResponse);
      setBalance(balanceResponse);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.incomeFormated}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcomeFormated}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.totalFormated}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            {transactions.length > 0 && (
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    {transaction.type === 'income' ? (
                      <td className="income">{transaction.formattedValue}</td>
                    ) : (
                      <td className="outcome">{`- ${transaction.formattedValue}`}</td>
                    )}
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
