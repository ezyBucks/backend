import { NextFunction, Request, Response } from 'express';
import Router from './base.router';
import Service from './services';
import {
    MetaTransactionEntity,
    TransactionEntity,
    UserEntity
} from '../entities';
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
        res.json({
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

        // Wait for sub records to be saved.
        // This should really be made as a function on the
        // MetaTransaction
        await fromTransaction.save();
        await toTransaction.save();

        const response = await MetaTransactionEntity.findOne(
            metaTransactionObject.id
        );

        (response.from as any) = response.from.fieldReflector();
        (response.to as any) = response.to.fieldReflector();

        res.send(response);
    }
}

export default TransactionRoutes;
