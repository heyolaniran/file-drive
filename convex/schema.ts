import { defineSchema, defineTable } from "convex/server";

import { v } from "convex/values";

export default defineSchema({

    // files table
    files: defineTable({
        name : v.string() , 
        orgId: v.optional(v.string())  // make optional column 
    }).index('by_org_id' , ['orgId']) , 

    //users table 
    users: defineTable({
        tokenIdentifier : v.string() , 
        orgIds : v.array(v.string())
    }).index('by_tokenidentifier', ['tokenIdentifier'])

})