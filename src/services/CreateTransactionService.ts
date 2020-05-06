import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('balance not available!', 400);
    }

    if (!title || title === '') {
      throw new AppError('Invalid title', 400);
    }

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Invalid transaction type', 400);
    }

    let categoryFound = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryFound) {
      categoryFound = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryFound);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryFound.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
