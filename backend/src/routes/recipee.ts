import express from 'express';
import { Request,Response } from 'express';
const router  = express.Router();

router.get('recipee', ( req: Request, res: Response<{message: string}> ) => {
  res.json({ message: "Hello from recipee endpoint" });

})