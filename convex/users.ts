import { MutationCtx, QueryCtx, internalMutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { roles } from "./schema";

export async function getUser(
  context: QueryCtx | MutationCtx,
  tokenIdentifier: string,
) {
  const user = await context.db
    .query("users")
    .withIndex("by_tokenidentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier),
    )
    .first();

  if (!user) {
    throw new ConvexError("User must be exist");
  }

  return user;
}

export const createUser = internalMutation({
  args: { tokenIdentifier: v.string() },

  async handler(context, args) {
    await context.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role : roles
  },

  async handler(context, args) {
    // Get user information  first

    const user = await getUser(context, args.tokenIdentifier);

    // append org identifiers  to existing user organization list

    await context.db.patch(user._id, {
      orgIds: [...user.orgIds, {orgId : args.orgId, role : args.role}],
    });
  },
});


export const updateRoleInOrgForUser = internalMutation({
  args : {
    tokenIdentifier : v.string(), 
    orgId : v.string() , 
    role : roles
  } , 

  async handler(context , args) {

    const user = await getUser(context, args.tokenIdentifier); 

    const org = user.orgIds.find((org) => org.orgId === args.orgId)

    if(!org) {
      throw new ConvexError('Expected Organization but not found while updating user information');
    }

    org.role = args.role


    await context.db.patch(user._id , {
      orgIds : user.orgIds
    })
  }
})