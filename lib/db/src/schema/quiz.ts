import { createInsertSchema } from "drizzle-zod";
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const quizQuestionsTable = pgTable("quiz_questions", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  category: text("category").notNull(),
  explanation: text("explanation").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestionsTable).omit({
  createdAt: true,
});
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestionsTable.$inferSelect;