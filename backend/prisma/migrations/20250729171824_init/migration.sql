-- CreateEnum
CREATE TYPE "public"."RecipeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "public"."Recipe" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "cookTime" INTEGER NOT NULL,
    "difficulty" "public"."RecipeDifficulty" NOT NULL,
    "servings" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "ingredients" TEXT[],
    "instructions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);
