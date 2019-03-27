import { NextFunction, Request, Response } from 'express';
import Router from './base.router';
import Service from './services';
import { MetaTransactionEntity } from '../entities';
/**
 * AuthRoutes
 *
 * Defines the authentication routes.
 *
 * @extends Router
 */
class BalanceRoutes extends Router {
    /**
     * The HTTP methods supported by the routes and the functions
     * they will call.
     */
    get services() {
        return [
            new Service('get', '/balance', 'getBalance').withNoMiddleware()
        ];
    }

    /**
     * Returns the users current balance.
     *
     * @param req Request
     * @param res Response
     * @param next NextFunction
     */
    private async getBalance(req: Request, res: Response, next: NextFunction) {
        const totalSent = await MetaTransactionEntity.createQueryBuilder(
            'metaTransaction'
        )
            .select('SUM(sent.amount)', 'total')
            .leftJoin('metaTransaction.fromTransaction', 'sent')
            .where('metaTransaction.from = :id', { id: 3 })
            .getRawOne();

        const totalReceived = await MetaTransactionEntity.createQueryBuilder(
            'metaTransaction'
        )
            .select('SUM(received.amount)', 'total')
            .leftJoin('metaTransaction.toTransaction', 'received')
            .where('metaTransaction.to = :id', { id: 3 })
            .getRawOne();

        const balance = {
            sent: Number(totalSent.total) || 0,
            received: Number(totalReceived.total) || 0,
            total: 0
        };

        balance.total = balance.sent + balance.received;

        res.send(balance);
    }
}

export default BalanceRoutes;
