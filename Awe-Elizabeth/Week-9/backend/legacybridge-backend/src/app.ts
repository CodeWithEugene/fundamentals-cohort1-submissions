import express, { Request, Response } from 'express'
import cors from 'cors'
import axios from 'axios';
import dotenv from 'dotenv'
import cache from './utils/cache';
import  api  from './utils/api';
import { transformCustomerData, transformPaymentData } from './utils/utilityFunctions';
dotenv.config()

const app = express();

app.use(express.json())
app.use(cors())


const port = 5000
app.listen(5000, () => {
    console.log(`app currently running on port:${port}`)
});

app.get("/api/v2/payments", async(req: Request, res: Response) => {
    try {       
        const cacheKey = "payments:all"
        const cachedData = cache.get(cacheKey)
        if(cachedData){
            return res.status(200).json({success: true, message: "success", result:cachedData})
        }
        const response = await api.get(`/payments`)
        const modernData = response.data.map(transformPaymentData)
        cache.set(cacheKey, modernData, 120)
        return res.status(200).json({success: true, message: "success", result: modernData})
    } catch (error) {
        return res.status(500).json({success: false, message: "an error has occured"})
    }
})

app.get("/api/v2/customers", async(req: Request, res: Response) => {
    try {
        const cacheKey = "customers:all"
        const cachedData = cache.get(cacheKey)
        if(cachedData){
            return res.status(200).json({success: true, message: "success", result:cachedData})
        }
        const response = await api.get(`/customers`)
        const modernData = response.data.map(transformCustomerData)
        cache.set(cacheKey, modernData, 120)
        return res.status(200).json({success: true, message: "success", result: modernData})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: "an error has occured"})
    }
})
export default app;