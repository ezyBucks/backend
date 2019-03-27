import { NextFunction, Request, Response } from 'express';
import UserEntity from '../entities/user.entity';
import Router from './base.router';
import Service from './services';
import HttpException from '../exceptions/HttpException';

/**
 * User Routes
 */
class UserRoutes extends Router {
    /**
     * Routes to register
     */
    get services() {
        return [
            new Service('get', '/user', 'getAllUsers'),
            new Service('get', '/user/:id', 'getUserById'),
            new Service('post', '/user', 'addNewUser'),
            new Service('delete', '/user/:id', 'deleteUser')
        ];
    }

    /**
     * Gets all users from the DB
     *
     * @param req Request
     * @param res Response
     * @param next NextFunction
     */
    public async getAllUsers(req: Request, res: Response, next: NextFunction) {
        let results: UserEntity[];

        if (req.query.username) {
            results = await UserEntity.createQueryBuilder('user')
                .where('username LIKE :name', {
                    name: req.query.username + '%'
                })
                .getMany();
        } else {
            results = await UserEntity.find();
        }

        res.send({ items: results });
    }

    /**
     * Gets the User with the provided ID
     *
     * @param req Request
     * @param res Response
     * @param next NextFunction
     */
    public async getUserById(req: Request, res: Response, next: NextFunction) {
        const user = await UserEntity.findOne(req.params.id);

        if (!user) {
            res.status(404);
            res.send({
                message: `No user with the ID of ${req.params.id}`
            });
        }

        res.send(user);
    }

    /**
     * Adds the User
     *
     * @param req Request
     * @param res Response
     * @param next NextFunction
     */
    public async addNewUser(req: Request, res: Response, next: NextFunction) {
        const user = UserEntity.create(req.body);
        res.send(await UserEntity.save(user));
    }

    /**
     * Deletes the User
     *
     * @param req Request
     * @param res Response
     * @param next NextFunction
     */
    public async deleteUser(req: Request, res: Response, next: NextFunction) {
        const user = await UserEntity.findOne(req.params.id);
        if (user) {
            user.active = false;
            res.send(await UserEntity.save(user));
        } else {
            next(
                new HttpException(
                    404,
                    `Failed to find user with ID : ${req.params.id}`
                )
            );
        }
    }
}

export default UserRoutes;
