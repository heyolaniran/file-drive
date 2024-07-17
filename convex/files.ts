import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileType } from "./schema";
import { Id } from "./_generated/dataModel";

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
    favorites: v.optional(v.boolean()),
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

    let files = await context.db
      .query("files")
      .withIndex("by_org_id", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    if (args.favorites) {
      const user = await context.db
        .query("users")
        .withIndex("by_tokenidentifier", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .first();

      if (!user) {
        return files;
      }

      const favorites = await context.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) => q.eq("userId", user._id))
        .collect();

      files = files.filter((file) =>
        favorites.some((fav) => fav.fileId === file._id),
      );
    }

    if (query) {
      files = files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    return files;
  },
});

// toogle  Fav

export const toogleFavorite = mutation({
  args: { fileId: v.id("files") },

  async handler(context, args) {
    const access = await hasAccessToFile(context, args.fileId);

    if (!access) {
      throw new ConvexError(
        "You do not have permission to access to this file",
      );
    }

    const { user, file } = access;

    const favorite = await context.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", user._id).eq("orgId", file.orgId!),
      )
      .first();

    if (!favorite) {
      await context.db.insert("favorites", {
        fileId: file._id,
        orgId: file.orgId!,
        userId: user._id,
      });
    } else {
      await context.db.delete(favorite._id);
    }
  },
});

// All favorites

export const getAllFavorites = query({
  args: { orgId: v.string() },

  async handler(contex, args) {
    const identity = await contex.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const access = await hasAccessToOrg(
      contex,
      identity.tokenIdentifier,
      args.orgId,
    );

    if (!access) {
      return [];
    }
  },
});

// deleting file

export const deleteFile = mutation({
  args: { fileId: v.id("files") },

  async handler(context, args) {
    const access = await hasAccessToFile(context, args.fileId);

    if (!access) {
      throw new ConvexError(
        "You do not have permission to access to this file",
      );
    }

    await context.db.delete(args.fileId);
  },
});

// Have access to File Helper

const hasAccessToFile = async (
  context: QueryCtx | MutationCtx,
  fileId: Id<"files">,
) => {
  const identity = await context.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const file = await context.db.get(fileId);

  if (!file) {
    return null;
  }

  const hasAccess = await hasAccessToOrg(
    context,
    identity.tokenIdentifier,
    file.orgId!,
  );

  if (!hasAccess) {
    return null;
  }

  const user = await context.db
    .query("users")
    .withIndex("by_tokenidentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .first();

  if (!user) {
    return null;
  }

  return { user, file };
};
