import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileType } from "./schema";

// pre upload url

export const generateUploadUrl = mutation(async (context) => {
  const identity = await context.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("You must be logged in to upload some files");
  }

  return context.storage.generateUploadUrl();
});

async function hasAccessToOrg(
  context: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string,
) {
  const user = await getUser(context, tokenIdentifier);

  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

  return hasAccess;
}

export const createFile = mutation({
  args: {
    name: v.string(),
    type: fileType,
    fileId: v.id("_storage"),
    orgId: v.string(),
  },

  async handler(context, args) {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("you must be logged In first");
    }

    const hasAccess = await hasAccessToOrg(
      context,
      identity.tokenIdentifier,
      args.orgId,
    );

    if (!hasAccess) {
      throw new ConvexError("You are not authorized in this Organization");
    }

    await context.db.insert("files", {
      name: args.name,
      type: args.type,
      fileId: args.fileId,
      orgId: args.orgId,
    });
  },
});

// introducing queries with convex

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
  },

  async handler(context, args) {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrg(
      context,
      identity.tokenIdentifier,
      args.orgId,
    );

    if (!hasAccess) {
      return [];
    }

    const files = await context.db
      .query("files")
      .withIndex("by_org_id", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    if (query) {
      return files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase()),
      );
    } else {
      return files;
    }
  },
});

// deleting file

export const deleteFile = mutation({
  args: { fileId: v.id("files") },

  async handler(context, args) {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must first log in");
    }

    const file = await context.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("The file does not exist !");
    }

    const hasAccess = await hasAccessToOrg(
      context,
      identity.tokenIdentifier,
      file.orgId!,
    );

    if (!hasAccess) {
      throw new ConvexError("You do not have access to delete this file");
    }

    await context.db.delete(args.fileId);
  },
});
