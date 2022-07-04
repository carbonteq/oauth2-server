import {dataSource} from "../Database/mysqlConnections";

import {Repository, ObjectLiteral} from "typeorm";
import logger from "../Logger/logger";

class TypeORMAdapter {
    model: Repository<ObjectLiteral>;
    name: string;
    constructor(name) {
        this.model = dataSource.getRepository(name);
        this.name = name;
    }

    async upsert(id, data, expiresIn) {
        try {
            await this.model.upsert(
                {
                    id,
                    data,
                    ...(data.grantId ? {grantId: data.grantId} : undefined),
                    ...(data.userCode ? {userCode: data.userCode} : undefined),
                    ...(data.uid ? {uid: data.uid} : undefined),
                    ...((expiresIn ? {expiresAt: new Date(Date.now() + expiresIn * 1000)} : undefined) as any)
                },
                []
            );
            // const found = await this.model.findOne({where: {id: id}});
            // if (!found) {
            //     await this.model.save({
            //         id,
            //         data,
            //         ...(data.grantId ? {grantId: data.grantId} : undefined),
            //         ...(data.userCode ? {userCode: data.userCode} : undefined),
            //         ...(data.uid ? {uid: data.uid} : undefined),
            //         ...(expiresIn ? {expiresAt: new Date(Date.now() + expiresIn * 1000)} : undefined)
            //     });
            // } else {
            //     await this.model.update(
            //         {id: id},
            //         {
            //             id,
            //             data,
            //             ...(data.grantId ? {grantId: data.grantId} : undefined),
            //             ...(data.userCode ? {userCode: data.userCode} : undefined),
            //             ...(data.uid ? {uid: data.uid} : undefined),
            //             ...((expiresIn ? {expiresAt: new Date(Date.now() + expiresIn * 1000)} : undefined)) as any
            //         }
            //     );
            // }
        } catch (e) {
            logger.error(e.message);
        }
    }

    async find(id) {
        try {
            const found = await this.model.findOne({where: {id: id}});
            if (!found) {
                return undefined;
            }
            return {
                ...found.data,
                ...(found.consumedAt ? {consumed: true} : undefined)
            };
        } catch (e) {
            logger.error(e.message);
        }
    }

    async findByUserCode(userCode) {
        try {
            const found = await this.model.findOne({where: {userCode: userCode}});
            if (!found) {
                return undefined;
            }
            return {
                ...found.data,
                ...(found.consumedAt ? {consumed: true} : undefined)
            };
        } catch (e) {
            logger.error(e.message);
        }
    }

    async findByUid(uid) {
        try {
            const found = await this.model.findOne({where: {uid: uid}});
            if (!found) {
                return undefined;
            }
            return {
                ...found.data,
                ...(found.consumedAt ? {consumed: true} : undefined)
            };
        } catch (e) {
            logger.error(e.message);
        }
    }

    async destroy(id) {
        try {
            await this.model.delete({id: id});
        } catch (e) {
            logger.error(e.message);
        }
    }

    async consume(id) {
        try {
            await this.model.update({id: id}, {consumedAt: new Date() as any});
        } catch (e) {
            logger.error(e.message);
        }
    }

    async revokeByGrantId(grantId) {
        try {
            await this.model.delete({grantId: grantId});
        } catch (e) {
            logger.error(e.message);
        }
    }
}

export default TypeORMAdapter;
