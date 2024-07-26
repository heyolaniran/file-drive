import { defineSchema, defineTable } from "convex/server";

import { v } from "convex/values";

export const fileType = v.union(
  v.literal("image"),
  v.literal("csv"),
  v.literal("pdf"),
);

export const roles = v.union(v.literal("admin"), v.literal("member"));

export default defineSchema({
  // files table
  files: defineTable({
    name: v.string(),
    type: fileType,
    fileId: v.id("_storage"),
    userId : v.id('users'), 
    orgId: v.optional(v.string()), // make optional column
    shouldDelete: v.optional(v.boolean()),
  }).index("by_org_id", ["orgId"])
  .index('by_ShouldDelete', ["shouldDelete"]),

  favorites: defineTable({
    fileId: v.id("files"),
    orgId: v.string(),
    userId: v.id("users"),
  }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),

  //users table
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()), 
    image: v.optional(v.string()), 
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      }),
    ),
  }).index("by_tokenidentifier", ["tokenIdentifier"]),
});
