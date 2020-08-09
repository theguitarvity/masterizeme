import {Request, Response} from 'express'
import ScheduleItemInterface from "../domain/contract/ScheduleInterface"
import db from "../database/connection"
import convertHourToMinutes from "../utils/convertHoursToMinutes"
import responseHttp from "../utils/responseHttp"

export default class ClassesController{
    async create(request: Request, response: Response){
        const {
            name,
            avatar,
            bio,
            whatsapp,
            subject,
            cost,
            schedule
        } = request.body
        
        const transaction = await db.transaction()
        try {     
        
            const insertedUsersIds = await transaction('users').insert({
                name,
                avatar,
                bio,
                whatsapp
            })
    
            const user_id = insertedUsersIds[0]
    
            const insertedClassesId = await transaction('classes').insert({
                subject,
                cost,
                user_id
            })
    
            const class_id = insertedClassesId[0]
    
            const classSchedule = schedule.map((scheduleItem: ScheduleItemInterface) => {
                return {
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to),
                    class_id
                }
            })
    
            await transaction('class_schedule').insert(classSchedule)
    
            await transaction.commit()
                
            return response.status(responseHttp.CREATED).send()
        } catch (error) {
            await transaction.rollback()
            response.status(responseHttp.BAD_REQUEST).json({
                error: 'Unexpected error while creating new class.'
            })
        }
    }
    async index(request:Request, response: Response){
        const filters = request.query

        if(!filters.week_day || !filters.subject ||!filters.time){
            return response.status(responseHttp.BAD_REQUEST).json({
                error: 'Missing filters to search classes.'
            })
        }
        const subject = filters.subject as string
        const week_day = filters.week_day as string
        const time = filters.time as string
        const timeInMinutes = convertHourToMinutes(time)

        const classes = await db('classes')
            .whereExists(function(){
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('subject', '=', subject)
            .join('users','classes.user_id', 'users.id')
            .select(['classes.*', 'users.*'])
        
        
        return response.send({classes})

    }
}