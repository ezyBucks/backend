import { NextFunction, Request, Response } from 'express';
import Router from './base.router';
import Service from './services';
import { MetaTransactionEntity, TransactionEntity } from '../entities';
import { validate, ValidationError } from 'class-validator';
import HttpException from '../error/HttpException';

/**
 * Transaction Routes
 */
class TransactionRoutes extends Router {
    /**
     * Routes to register
     */
    get services() {
        return [
            new Service('get', '/transaction', 'getAllTransactions'),
            new Service('post', '/transaction', 'createTransaction')
        ];
    }

    /**
     * Gets all transactions for the user that is requesting
     *
     * @param req Request
     * @param res Response
     * @param next NextFunction
     */
    public async getAllTransactions(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const items = await MetaTransactionEntity.find();
        const count = await MetaTransactionEntity.count();

        res.json({
            count,
            items
        });
    }

    /**
     * Creates new Transaction against the user token
     *
     * @param req Request
     * @param res Response
     * @param next NextFunction
     */
    public async createTransaction(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const data = req.body;

        // Need to add validation to make sure the user ID exists
        const metaTransactionObject = await MetaTransactionEntity.create({
            from: req.user.id,
            to: data.to
        });

        const metaErrors = await validate(metaTransactionObject, {
            validationError: { target: false }
        });

        if (metaErrors.length > 0) {
            next(new HttpException(400, metaErrors));
        } else {
            await MetaTransactionEntity.save(metaTransactionObject);
        }

        // Creates the transactions in both directions
        const toTransaction = TransactionEntity.create({
            metaTransaction: metaTransactionObject,
            amount: data.amount
        });

        const fromTransaction = TransactionEntity.create({
            metaTransaction: metaTransactionObject,
            amount: -data.amount
        });

        fromTransaction.save();
        toTransaction.save();

        res.send(metaTransactionObject);
    }
}

export default TransactionRoutes;
