
import { ConvexError, v } from 'convex/values'
import {mutation, query} from './_generated/server' 

export const createFile = mutation({
    args : {
        name : v.string(), 
        orgId : v.string()
    }, 

    async handler (context , args) {

        const identity = await context.auth.getUserIdentity(); 

        if(!identity) {

            throw new ConvexError('you must be logged In first') ; 
        }
        await context.db.insert('files', {
            name : args.name , 
            orgId: args.orgId
        })
    }
})


// introducing queries with convex 


export const getFiles = query({
    args: {
        orgId : v.string()
    } , 

   async handler(context, args) {

        const identity = context.auth.getUserIdentity() ; 

        if(!identity) {
            return [] ; 
        }


        return context.db.query('files')
        .withIndex('by_org_id', (q) => q.eq('orgId' , args.orgId))
        .collect() ; 

        
   }
})