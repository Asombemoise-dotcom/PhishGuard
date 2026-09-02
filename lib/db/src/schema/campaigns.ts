import { createInsertSchema } from "drizzle-zod";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const campaignsTable = pgTable("campaigns", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sender: text("sender").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  link: text("link").notNull(),
  suspiciousClues: text("suspicious_clues").array().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull().default("beginner"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaignsTable).omit({
  createdAt: true,
});
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaignsTable.$inferSelect;