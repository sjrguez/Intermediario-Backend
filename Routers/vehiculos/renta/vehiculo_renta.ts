import { Router, Request,Response } from 'express';

const ROUTER: Router = Router();



ROUTER.get('/prueba', (req: Request, res: Response) =>{
    res.json({ok:false})
})

module.exports = ROUTER