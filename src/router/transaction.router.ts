import { NextFunction, Request, Response } from 'express';
import Router from './base.router';
import Service from './services';
import { MetaTransactionEntity, TransactionEntity } from '../entities';
import { validate } from 'class-validator';
import HttpException from '../error/HttpException';
import { getManager } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

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

        const userTo = await UserEntity.findOne({ id: data.to });
        const userFrom = await UserEntity.findOne({ id: req.user.id });

        if (!userTo) {
            res.status(404);
            res.send({
                message: `Could not find a user with the id: ${data.to}`
            });
            return;
        }

        await getManager().transaction(async transactionalEntityManager => {
            // Creates the transactions in both directions
            const toTransaction = TransactionEntity.create({
                amount: data.amount
            });

            const fromTransaction = TransactionEntity.create({
                amount: -data.amount
            });

            await fromTransaction.save();
            await toTransaction.save();

            // Need to add validation to make sure the user ID exists
            const metaTransactionObject = await MetaTransactionEntity.create({
                from: userFrom,
                to: userTo,
                toTransaction,
                fromTransaction
            });

            // Make use of class validator
            const metaErrors = await validate(metaTransactionObject, {
                validationError: { target: false }
            });

            // Check if we got errors.
            if (metaErrors.length > 0) {
                next(new HttpException(400, metaErrors));
            } else {
                await MetaTransactionEntity.save(metaTransactionObject);
            }

            const response = await MetaTransactionEntity.findOne(
                metaTransactionObject.id
            );

            (response.from as any) = response.from.fieldReflector();
            (response.to as any) = response.to.fieldReflector();

            res.send(response);
        });
    }
}

export default TransactionRoutes;
