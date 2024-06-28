import { internalMutation } from "./_generated/server";
import {v} from 'convex/values'
export const createUser = internalMutation({
    args : {tokenIdentifier : v.string()} , 

    async handler (context , args) {

    }
})