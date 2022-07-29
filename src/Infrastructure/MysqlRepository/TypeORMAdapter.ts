import {dataSource} from "../Database/mysqlConnections";

import {Repository, ObjectLiteral} from "typeorm";
import logger from "../Logger/logger";

class TypeORMAdapter {
    model: Repository<ObjectLiteral>;
    name: string;
    constructor(name: string) {
        this.model = dataSource.getRepository(name);
        this.name = name;
    }

    async upsert(id: string, data: {grantId: string; userCode: string; uid: string}, expiresIn: number): Promise<void> {
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
        } catch (e) {
            logger.error(e.message);
        }
    }

    async find(id: string): Promise<any> {
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

    async findByUserCode(userCode: string): Promise<any> {
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

    async findByUid(uid: string): Promise<any> {
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

    async destroy(id: string): Promise<void> {
        try {
            await this.model.delete({id: id});
        } catch (e) {
            logger.error(e.message);
        }
    }

    async consume(id: string): Promise<void> {
        try {
            await this.model.update({id: id}, {consumedAt: new Date() as any});
        } catch (e) {
            logger.error(e.message);
        }
    }

    async revokeByGrantId(grantId: string): Promise<void> {
        try {
            await this.model.delete({grantId: grantId});
        } catch (e) {
            logger.error(e.message);
        }
    }
}

export default TypeORMAdapter;
