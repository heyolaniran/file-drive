import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from "./_generated/server";
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

async function hasAccessToOrg(context: QueryCtx | MutationCtx, orgId: string) {
  const identity = await context.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await getUser(context, identity.tokenIdentifier);

  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    return null;
  }

  return { user };
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

    const hasAccess = await hasAccessToOrg(context, args.orgId);

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
    favoritesOnly: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
  },

  async handler(context, args) {
    const identity = await context.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrg(
      context,

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

    if (args.favoritesOnly) {
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

    if (args.deletedOnly) {
      files = files.filter((file) => file.shouldDelete);
    } else {
      files = files.filter((file) => !file.shouldDelete);
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

    const access = await hasAccessToOrg(contex, args.orgId);

    if (!access) {
      return [];
    }

    const favorites = await contex.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", access.user._id).eq("orgId", args.orgId),
      )
      .collect();

    return favorites;
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

    let isAdmin =
      access.user.orgIds.find((org) => org.orgId === access.file.orgId)
        ?.role === "admin";

    if (!isAdmin) {
      throw new ConvexError("You have no access to delete this file");
    }

    await context.db.patch(args.fileId, {
      shouldDelete: true,
    });

    //await context.db.delete(args.fileId);
  },
});

// restore files

export const restoreFile = mutation({
  args: { fileId: v.id("files") },
  async handler(context, args) {
    const access = await hasAccessToFile(context, args.fileId);

    if (!access) {
      throw new ConvexError("You do not have access to this file");
    }

    let isAdmin =
      access.user.orgIds.find((org) => org.orgId === access.file.orgId)
        ?.role === "admin";

    if (!isAdmin) {
      throw new ConvexError("You have no rights to make this action");
    }

    await context.db.patch(args.fileId, {
      shouldDelete: false,
    });
  },
});


// delete Trash files 

export const clearTrash = internalMutation({
  args : {}, 
  async handler (context) {

      const files =  await context.db.query('files').withIndex('by_ShouldDelete', q=> q.eq("shouldDelete", true)).collect();


      await Promise.all(files.map(async (file) => {
        await context.storage.delete(file.fileId) ; 
        return await context.db.delete(file._id)
      }))

    
  }
})

// Have access to File Helper

const hasAccessToFile = async (
  context: QueryCtx | MutationCtx,
  fileId: Id<"files">,
) => {
  const file = await context.db.get(fileId);

  if (!file) {
    return null;
  }

  const hasAccess = await hasAccessToOrg(context, file.orgId!);

  if (!hasAccess) {
    return null;
  }

  return { user: hasAccess.user, file };
};
