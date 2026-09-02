import { createInsertSchema } from "drizzle-zod";
import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const quizResultsTable = pgTable("quiz_results", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  score: integer("score").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  level: text("level").notNull(),
  recommendation: text("recommendation").notNull(),
  answers: jsonb("answers").$type<Array<{ questionId: string; answerIndex: number }>>().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQuizResultSchema = createInsertSchema(quizResultsTable).omit({
  completedAt: true,
});
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof quizResultsTable.$inferSelect;