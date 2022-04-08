import { DetectType } from '../detection/DetectType.js'
import { Pool } from '../pool/pool.js'
import { Request, Response } from "express";

const executePoolRequest = (pool: Pool, reqType: DetectType, req: Request, res: Response) => {
    pool
        .exec(reqType, req.body.img)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => res.send(err));
}

export { executePoolRequest }