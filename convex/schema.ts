import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // User profiles with skills and interests
  userProfiles: defineTable({
    userId: v.id("users"),
    skills: v.array(v.string()),
    interests: v.array(v.string()),
    location: v.string(),
    educationLevel: v.string(), // "high-school", "college", "graduate"
    preferredType: v.string(), // "college", "tesda", "both"
    budget: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // Course recommendations and details
  courses: defineTable({
    name: v.string(),
    type: v.string(), // "college", "tesda"
    category: v.string(),
    description: v.string(),
    duration: v.string(),
    requirements: v.array(v.string()),
    careerPaths: v.array(v.string()),
    skills: v.array(v.string()),
    averageSalary: v.optional(v.string()),
  }).index("by_type", ["type"])
    .index("by_category", ["category"]),

  // Schools and institutions
  schools: defineTable({
    name: v.string(),
    type: v.string(), // "university", "college", "tesda"
    location: v.string(),
    region: v.string(),
    courses: v.array(v.string()),
    website: v.optional(v.string()),
    contactInfo: v.optional(v.string()),
    tuitionRange: v.optional(v.string()),
    accreditation: v.array(v.string()),
  }).index("by_location", ["location"])
    .index("by_region", ["region"])
    .index("by_type", ["type"]),

  // Scholarships and financial aid
  scholarships: defineTable({
    name: v.string(),
    provider: v.string(),
    type: v.string(), // "academic", "need-based", "sports", "talent"
    amount: v.string(),
    requirements: v.array(v.string()),
    eligibleCourses: v.array(v.string()),
    deadline: v.optional(v.string()),
    applicationLink: v.optional(v.string()),
    description: v.string(),
  }).index("by_type", ["type"]),

  // AI recommendations and chat history
  recommendations: defineTable({
    userId: v.id("users"),
    type: v.string(), // "course", "school", "scholarship"
    recommendations: v.array(v.object({
      id: v.string(),
      name: v.string(),
      score: v.number(),
      reasons: v.array(v.string()),
    })),
    timestamp: v.number(),
  }).index("by_user", ["userId"]),

  // Chat sessions with CoachEdu
  chatSessions: defineTable({
    userId: v.id("users"),
    messages: v.array(v.object({
      role: v.string(), // "user" or "assistant"
      content: v.string(),
      timestamp: v.number(),
    })),
    lastUpdated: v.number(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
