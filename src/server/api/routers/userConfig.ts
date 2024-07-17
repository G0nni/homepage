import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// Schéma Zod pour la création et la mise à jour de la configuration utilisateur
const userConfigSchema = z.object({
  autoThemeEnabled: z.boolean().optional(),
  tabs: z.string().optional(),
  themeImage: z.string().optional(),
  searchEngine: z.string().optional(),
  topColor: z.string().optional(),
  bottomColor: z.string().optional(),
  darkVibrant: z.string().optional(),
  lightVibrant: z.string().optional(),
});

export const userConfigRouter = createTRPCRouter({
  // Créer une nouvelle configuration utilisateur
  create: protectedProcedure
    .input(userConfigSchema)
    .mutation(async ({ input, ctx }) => {
      const userConfig = await ctx.db.userConfig.create({
        data: {
          ...input,
          // Assurez-vous d'ajouter le userId ici, par exemple:
          userId: ctx.session.user.id,
        },
      });
      return userConfig;
    }),

  // Obtenir la configuration utilisateur par userId
  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userConfig = await ctx.db.userConfig.findUnique({
        where: { userId: input.userId },
      });
      return userConfig;
    }),

  // Mettre à jour la configuration utilisateur
  update: protectedProcedure
    .input(z.object({ userId: z.string() }).merge(userConfigSchema))
    .mutation(async ({ input, ctx }) => {
      const { userId, ...updateData } = input;
      const updatedUserConfig = await ctx.db.userConfig.update({
        where: { userId },
        data: updateData,
      });
      return updatedUserConfig;
    }),

  // Supprimer la configuration utilisateur
  delete: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const deletedUserConfig = await ctx.db.userConfig.delete({
        where: { userId: input.userId },
      });
      return deletedUserConfig;
    }),
});
