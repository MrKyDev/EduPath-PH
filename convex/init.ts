import { mutation } from "./_generated/server";
import { api } from "./_generated/api";

export const initializeData = mutation({
  args: {},
  handler: async (ctx) => {
    // Initialize all sample data
    await ctx.runMutation(api.courses.initializeCourses, {});
    await ctx.runMutation(api.schools.initializeSchools, {});
    await ctx.runMutation(api.scholarships.initializeScholarships, {});
  },
});
