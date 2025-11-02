//Uncomment this if you want AI to be offline and comment the code under this code

/*
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
  */

// If you want that the AI will work uncomment this part and comment the above Code

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

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

    // Generate AI-powered insights
    const prompt = `
    As CoachEdu, an AI career guidance counselor for Filipino students, analyze this student profile and provide personalized recommendations:

    Student Profile:
    - Skills: ${args.skills.join(", ")}
    - Interests: ${args.interests.join(", ")}
    - Location: ${args.location}
    - Education Level: ${args.educationLevel}
    - Preferred Type: ${args.preferredType}

    Top Course Matches:
    ${courses.slice(0, 3).map((c: any) => `- ${c.name} (${c.type}): ${c.description}`).join("\n")}

    Available Schools:
    ${schools.slice(0, 3).map((s: any) => `- ${s.name} (${s.location})`).join("\n")}

    Scholarship Opportunities:
    ${scholarships.slice(0, 3).map((s: any) => `- ${s.name}: ${s.amount}`).join("\n")}

    Provide a comprehensive analysis including:
    1. Why these courses match the student's profile
    2. Career outlook and salary expectations
    3. Recommended learning path
    4. Tips for scholarship applications
    5. Next steps to take

    Keep the response encouraging, practical, and specific to the Philippine education system.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: "You are CoachEdu, a friendly and knowledgeable AI career guidance counselor specializing in the Philippine education system. You help students make informed decisions about their academic and career paths."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
    });

    return {
      courses: courses.slice(0, 5),
      schools: schools.slice(0, 5),
      scholarships: scholarships.slice(0, 5),
      aiInsights: response.choices[0].message.content || "Unable to generate insights at this time.",
    };
  },
});

export const chatWithCoachEdu = action({
  args: {
    message: v.string(),
    context: v.optional(v.object({
      skills: v.array(v.string()),
      interests: v.array(v.string()),
      location: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const systemPrompt = `You are CoachEdu, a friendly AI career guidance counselor for Filipino students. You help with:
    - Course and career recommendations
    - School selection advice
    - Scholarship guidance
    - Study tips and motivation
    - Philippine education system information
    
    Keep responses helpful, encouraging, and specific to the Philippine context.
    ${args.context ? `
    Student context:
    - Skills: ${args.context.skills.join(", ")}
    - Interests: ${args.context.interests.join(", ")}
    - Location: ${args.context.location}
    ` : ""}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: args.message
        }
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your message right now. Please try again.";
  },
});