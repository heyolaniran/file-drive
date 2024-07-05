
import { ConvexError, v } from 'convex/values'
import {MutationCtx, QueryCtx, mutation, query} from './_generated/server' 
import { getUser } from './users';

// pre upload url 

export const generateUploadUrl = mutation(async (context) => {

    const identity = await context.auth.getUserIdentity() ; 

    if(!identity) {
        throw new ConvexError('You must be logged in to upload some files'); 
    }

    return context.storage.generateUploadUrl(); 
})


async function hasAccessToOrg (context : QueryCtx | MutationCtx , tokenIdentifier : string , orgId : string) {

    const user = await getUser(context , tokenIdentifier); 

    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)

    return hasAccess ; 
}



export const createFile = mutation({
    args : {
        name : v.string(), 
        fileId : v.id('_storage'), 
        orgId : v.string()
    }, 

    async handler (context , args) {

        const identity = await context.auth.getUserIdentity(); 

        if(!identity) {

            throw new ConvexError('you must be logged In first') ; 
        }

        const hasAccess = await hasAccessToOrg(context , identity.tokenIdentifier , args.orgId)

        if(!hasAccess) {
            throw new ConvexError('You are not authorized in this Organization') ; 
        }

        await context.db.insert('files', {
            name : args.name , 
            fileId: args.fileId, 
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

        const identity = await  context.auth.getUserIdentity() ; 

        if(!identity) {
            return [] ; 
        }

        const hasAccess = await hasAccessToOrg(context , identity.tokenIdentifier , args.orgId)

        if(!hasAccess) {
            return [] ; 
        }
        



        return context.db.query('files')
        .withIndex('by_org_id', (q) => q.eq('orgId' , args.orgId))
        .collect() ; 

        
   }
})