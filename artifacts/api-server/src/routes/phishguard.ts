import { Router, type IRouter } from "express";
import { and, avg, count, desc, eq } from "drizzle-orm";
import { db, campaignsTable, quizQuestionsTable, quizResultsTable } from "@workspace/db";
import {
  CreateCampaignBody,
  CreateCampaignResponse,
  CreateQuizQuestionBody,
  CreateQuizQuestionResponse,
  DeleteCampaignParams,
  DeleteQuizQuestionParams,
  GetAdminStatsResponse,
  GetCampaignParams,
  GetCampaignResponse,
  GetDashboardResponse,
  ListCampaignsResponse,
  ListQuizQuestionsResponse,
  ListRecommendationsResponse,
  SubmitCampaignAttemptBody,
  SubmitCampaignAttemptParams,
  SubmitCampaignAttemptResponse,
  SubmitQuizBody,
  SubmitQuizResponse,
  UpdateCampaignBody,
  UpdateCampaignParams,
  UpdateCampaignResponse,
  UpdateQuizQuestionBody,
  UpdateQuizQuestionParams,
} from "@workspace/api-zod";
import { requireAdmin, requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router: IRouter = Router();

function campaignResponse(campaign: typeof campaignsTable.$inferSelect) {
  return {
    ...campaign,
    createdAt: campaign.createdAt.toISOString(),
    difficulty: campaign.difficulty as "beginner" | "intermediate" | "advanced",
    correctAnswer: campaign.correctAnswer as "legitimate" | "phishing",
  };
}

function quizResponse(question: typeof quizQuestionsTable.$inferSelect) {
  return {
    id: question.id,
    question: question.question,
    options: question.options,
    category: question.category,
    explanation: question.explanation,
  };
}

function scoreLevel(score: number) {
  if (score < 40) return "Faible" as const;
  if (score < 60) return "Moyen" as const;
  if (score < 80) return "Bon" as const;
  return "Très bon" as const;
}

function recommendationFor(score: number) {
  if (score < 40)
    return "Votre niveau de sensibilisation est faible. Renforcez votre vigilance face aux liens suspects, aux pièces jointes inconnues et aux demandes urgentes.";
  if (score < 60)
    return "Votre niveau est moyen. Apprenez à vérifier systématiquement l'expéditeur, les liens et le contexte du message.";
  if (score < 80)
    return "Bon niveau de sensibilisation. Continuez à appliquer les bonnes pratiques de sécurité.";
  return "Excellent niveau. Continuez à vérifier les expéditeurs, les liens et les demandes inhabituelles.";
}

router.get("/campaigns", async (_req, res): Promise<void> => {
  const campaigns = await db.select().from(campaignsTable).orderBy(desc(campaignsTable.createdAt));
  res.json(ListCampaignsResponse.parse(campaigns.map(campaignResponse)));
});

router.get("/campaigns/:id", async (req, res): Promise<void> => {
  const parsed = GetCampaignParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [campaign] = await db.select().from(campaignsTable).where(eq(campaignsTable.id, parsed.data.id));
  if (!campaign) {
    res.status(404).json({ error: "Campagne introuvable" });
    return;
  }
  res.json(GetCampaignResponse.parse(campaignResponse(campaign)));
});

router.post("/campaigns/:id/attempt", async (req, res): Promise<void> => {
  const params = SubmitCampaignAttemptParams.safeParse(req.params);
  const body = SubmitCampaignAttemptBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [campaign] = await db.select().from(campaignsTable).where(eq(campaignsTable.id, params.data.id));
  if (!campaign) {
    res.status(404).json({ error: "Campagne introuvable" });
    return;
  }
  res.json(SubmitCampaignAttemptResponse.parse({
    correct: body.data.answer === campaign.correctAnswer,
    answer: body.data.answer,
    correctAnswer: campaign.correctAnswer,
    explanation: campaign.explanation,
  }));
});

router.post("/campaigns", requireAdmin, async (req, res): Promise<void> => {
  const body = CreateCampaignBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const id = `campaign-${crypto.randomUUID()}`;
  const [campaign] = await db.insert(campaignsTable).values({ id, ...body.data }).returning();
  res.status(201).json(CreateCampaignResponse.parse(campaignResponse(campaign)));
});

router.patch("/campaigns/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateCampaignParams.safeParse(req.params);
  const body = UpdateCampaignBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [campaign] = await db.update(campaignsTable).set(body.data).where(eq(campaignsTable.id, params.data.id)).returning();
  if (!campaign) {
    res.status(404).json({ error: "Campagne introuvable" });
    return;
  }
  res.json(UpdateCampaignResponse.parse(campaignResponse(campaign)));
});

router.delete("/campaigns/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteCampaignParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [campaign] = await db.delete(campaignsTable).where(eq(campaignsTable.id, params.data.id)).returning();
  if (!campaign) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  res.sendStatus(204);
});

router.get("/quiz", async (_req, res): Promise<void> => {
  const questions = await db.select().from(quizQuestionsTable).orderBy(quizQuestionsTable.createdAt);
  res.json(ListQuizQuestionsResponse.parse(questions.map(quizResponse)));
});

router.post("/quiz/submit", requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  const body = SubmitQuizBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const questions = await db.select().from(quizQuestionsTable);
  const questionMap = new Map(questions.map((question) => [question.id, question]));
  const validAnswers = body.data.answers.filter((answer) => questionMap.has(answer.questionId));
  if (!validAnswers.length) {
    res.status(400).json({ error: "Au moins une réponse valide est requise" });
    return;
  }
  const correctAnswers = validAnswers.filter((answer) => questionMap.get(answer.questionId)?.correctAnswer === answer.answerIndex).length;
  const score = Math.round((correctAnswers / validAnswers.length) * 100);
  const level = scoreLevel(score);
  const recommendation = recommendationFor(score);
  const result = {
    score,
    correctAnswers,
    totalQuestions: validAnswers.length,
    level,
    recommendation,
    completedAt: new Date().toISOString(),
  };
  await db.insert(quizResultsTable).values({
    id: `result-${crypto.randomUUID()}`,
    userId: req.userId!,
    score,
    correctAnswers,
    totalQuestions: validAnswers.length,
    level,
    recommendation,
    answers: validAnswers,
  });
  res.json(SubmitQuizResponse.parse(result));
});

router.post("/quiz", requireAdmin, async (req, res): Promise<void> => {
  const body = CreateQuizQuestionBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [question] = await db.insert(quizQuestionsTable).values({
    id: `question-${crypto.randomUUID()}`,
    ...body.data,
  }).returning();
  res.status(201).json(CreateQuizQuestionResponse.parse(quizResponse(question)));
});

router.patch("/quiz/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateQuizQuestionParams.safeParse(req.params);
  const body = UpdateQuizQuestionBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [question] = await db.update(quizQuestionsTable).set(body.data).where(eq(quizQuestionsTable.id, params.data.id)).returning();
  if (!question) {
    res.status(404).json({ error: "Question de quiz introuvable" });
    return;
  }
  res.json((await import("@workspace/api-zod")).UpdateQuizQuestionResponse.parse(quizResponse(question)));
});

router.delete("/quiz/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteQuizQuestionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [question] = await db.delete(quizQuestionsTable).where(eq(quizQuestionsTable.id, params.data.id)).returning();
  if (!question) {
    res.status(404).json({ error: "Question de quiz introuvable" });
    return;
  }
  res.sendStatus(204);
});

router.get("/dashboard", requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  const [campaignProgress] = await db.select({ total: count() }).from(quizResultsTable).where(eq(quizResultsTable.userId, req.userId!));
  const [latest] = await db.select().from(quizResultsTable).where(eq(quizResultsTable.userId, req.userId!)).orderBy(desc(quizResultsTable.completedAt)).limit(1);
  const dashboard = {
    campaignsCompleted: 0,
    quizzesCompleted: Number(campaignProgress?.total ?? 0),
    latestScore: latest?.score ?? 0,
    level: latest?.level ?? "À découvrir",
    streak: latest ? 1 : 0,
    nextAction: latest ? "Rejouer un quiz pour progresser" : "Commencer votre premier quiz",
  };
  res.json(GetDashboardResponse.parse(dashboard));
});

router.get("/recommendations", requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  const [latest] = await db.select().from(quizResultsTable).where(eq(quizResultsTable.userId, req.userId!)).orderBy(desc(quizResultsTable.completedAt)).limit(1);
  const score = latest?.score ?? 0;
  const recommendations = [
    { id: "links", title: "Inspecter les liens", message: "Survolez un lien avant de cliquer et vérifiez le domaine réel.", focus: "Liens suspects", priority: score < 60 ? "high" : "medium" },
    { id: "urgency", title: "Résister à l'urgence", message: "Une demande urgente mérite une vérification par un autre canal.", focus: "Ingénierie sociale", priority: "medium" },
    { id: "mfa", title: "Activer le MFA", message: "Ajoutez un second facteur pour limiter l'impact d'un mot de passe compromis.", focus: "Protection du compte", priority: "low" },
  ];
  res.json(ListRecommendationsResponse.parse(recommendations));
});

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [campaignCount] = await db.select({ count: count() }).from(campaignsTable);
  const [quizCount] = await db.select({ count: count() }).from(quizQuestionsTable);
  const [resultCount] = await db.select({ count: count() }).from(quizResultsTable);
  const [average] = await db.select({ average: avg(quizResultsTable.score) }).from(quizResultsTable);
  const scores = await db.select({ level: quizResultsTable.level, count: count() }).from(quizResultsTable).groupBy(quizResultsTable.level);
  const stats = {
    users: 0,
    campaigns: Number(campaignCount?.count ?? 0),
    quizzesCompleted: Number(resultCount?.count ?? 0),
    averageScore: Math.round(Number(average?.average ?? 0)),
    successRate: 0,
    levels: scores.map((entry) => ({ label: entry.level, value: Number(entry.count) })),
  };
  stats.successRate = stats.quizzesCompleted ? Math.round((stats.averageScore / 100) * 100) : 0;
  res.json(GetAdminStatsResponse.parse(stats));
});

export default router;