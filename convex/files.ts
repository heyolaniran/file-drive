
import { v } from 'convex/values'
import {mutation, query} from './_generated/server' 

export const createFile = mutation({
    args : {
        name : v.string()
    }, 

    async handler (context , args) {
        await context.db.insert('files', {
            name : args.name
        })
    }
})


// introducing queries with convex 


export const getFiles = query({
    args: {} , 

   async handler(context, args) {
        return context.db.query('files').collect() ; 
   }
})