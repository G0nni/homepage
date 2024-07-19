import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Check if the user already has a post
      const existingPost = await ctx.db.post.findFirst({
        where: { createdBy: { id: ctx.session.user.id } },
      });
      if (existingPost) {
        throw new Error("User already has a post");
      }

      // Proceed with creating a new post
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        public: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { id: input.id },
        data: { name: input.name, public: input.public },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({
        where: { id: input.id },
      });
    }),

  getByUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findFirst({
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getRandom: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.post.count();
    const randomRowNumber = Math.floor(Math.random() * count);
    return ctx.db.post.findFirst({
      skip: randomRowNumber,
    });
  }),
});
