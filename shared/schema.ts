import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  youtubeId: text("youtube_id"),
  isSubscribed: boolean("is_subscribed").default(false),
  preferredMood: text("preferred_mood").default("mario"),
  level: integer("level").default(1),
  totalPoints: integer("total_points").default(0),
  videosWatched: integer("videos_watched").default(0),
  gamesPlayed: integer("games_played").default(0),
  badgesEarned: jsonb("badges_earned").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameType: text("game_type").notNull(), // 'quiz_mario', 'quiz_fortnite', 'memory', 'drag_drop'
  score: integer("score").notNull(),
  timeSpent: integer("time_spent"), // in seconds
  achievedAt: timestamp("achieved_at").defaultNow(),
});

export const vipRewards = pgTable("vip_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  rewardType: text("reward_type").notNull(), // 'badge', 'image', 'secret_link', 'mystery_box'
  rewardData: jsonb("reward_data"),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const lotteryEntries = pgTable("lottery_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  weekNumber: integer("week_number").notNull(),
  year: integer("year").notNull(),
  enteredAt: timestamp("entered_at").defaultNow(),
});

export const lotteryWinners = pgTable("lottery_winners", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  weekNumber: integer("week_number").notNull(),
  year: integer("year").notNull(),
  blockchainTxHash: text("blockchain_tx_hash"),
  prizeDescription: text("prize_description"),
  wonAt: timestamp("won_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  youtubeId: true,
  isSubscribed: true,
  preferredMood: true,
});

export const insertGameScoreSchema = createInsertSchema(gameScores).pick({
  userId: true,
  gameType: true,
  score: true,
  timeSpent: true,
});

export const insertVipRewardSchema = createInsertSchema(vipRewards).pick({
  userId: true,
  rewardType: true,
  rewardData: true,
});

export const insertLotteryEntrySchema = createInsertSchema(lotteryEntries).pick({
  userId: true,
  weekNumber: true,
  year: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
export type VipReward = typeof vipRewards.$inferSelect;
export type InsertVipReward = z.infer<typeof insertVipRewardSchema>;
export type LotteryEntry = typeof lotteryEntries.$inferSelect;
export type InsertLotteryEntry = z.infer<typeof insertLotteryEntrySchema>;
export type LotteryWinner = typeof lotteryWinners.$inferSelect;
