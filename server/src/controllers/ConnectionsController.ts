import {Request, Response} from 'express'
import db from '../database/connection'
import responseHttp from '../utils/responseHttp'
export default class ConnectionController{
    async create(request: Request, response: Response){
        const { user_id } = request.body
        const transaction = await db.transaction()

        try {
            await transaction('connections').insert({
                user_id
            })

            transaction.commit()

            return response.status(responseHttp.CREATED).send()
            
        } catch (error) {
            transaction.rollback()
            return response.status(responseHttp.BAD_REQUEST).json({
                error:'Unexpected error while creating new connection.'
            })
        }
    }
    async index(request: Request, response: Response){
        const totalConnections = await db('connections').count('* as total')

        const { total } = totalConnections[0]

        return response.status(responseHttp.OK).json({total})

    }
}