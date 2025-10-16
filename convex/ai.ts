import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
// import OpenAI from "openai"; // Disabled because no API key available

// Placeholder AI handler (returns dummy responses instead of calling OpenAI)
function mockAIResponse(prompt: string, type: "recommendations" | "chat") {
  if (type === "recommendations") {
    return `
CoachEdu's Insights (Offline Mode):

1. Based on your skills and interests, consider focusing on practical short courses to build experience.
2. Research local schools in your area — many offer affordable programs.
3. Explore TESDA or CHED-accredited programs for quality education.
4. Apply for government scholarships (CHED, DOST, or LGU-based).
5. Stay consistent with your learning journey — you're on the right track!
`;
  }

  return `
CoachEdu (Offline Mode): Thank you for your message!
I'm currently offline and can't process AI chat right now, but keep pursuing your goals with confidence.
Check back soon for personalized advice.`;
}

export const generateRecommendations = action({
  args: {
    skills: v.array(v.string()),
    interests: v.array(v.string()),
    location: v.string(),
    educationLevel: v.string(),
    preferredType: v.string(),
  },
  handler: async (ctx, args) => {
    // Get courses based on skills and interests
    const courses: any[] = await ctx.runQuery(api.courses.searchCourses, {
      skills: args.skills,
      interests: args.interests,
      type: args.preferredType === "both" ? undefined : args.preferredType,
    });

    // Get schools in the user's location
    const schools: any[] = await ctx.runQuery(api.schools.getSchoolsByRegion, {
      region: args.location,
    });

    // Get relevant scholarships
    const scholarships: any[] = await ctx.runQuery(api.scholarships.searchScholarships, {
      courses: courses.slice(0, 3).map((c: any) => c.name),
      userProfile: {
        educationLevel: args.educationLevel,
        location: args.location,
      },
    });

    // Since OpenAI is disabled, return mock AI output
    const aiInsights = mockAIResponse("recommendations", "recommendations");

    return {
      courses: courses.slice(0, 5),
      schools: schools.slice(0, 5),
      scholarships: scholarships.slice(0, 5),
      aiInsights,
    };
  },
});

export const chatWithCoachEdu = action({
  args: {
    message: v.string(),
    context: v.optional(
      v.object({
        skills: v.array(v.string()),
        interests: v.array(v.string()),
        location: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Offline fallback chat mode
    return mockAIResponse(args.message, "chat");
  },
});
  