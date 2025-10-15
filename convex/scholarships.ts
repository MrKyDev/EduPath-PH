import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllScholarships = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("scholarships").collect();
  },
});

export const getScholarshipsByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scholarships")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

export const searchScholarships = query({
  args: { 
    courses: v.array(v.string()),
    userProfile: v.optional(v.object({
      educationLevel: v.string(),
      location: v.string(),
    }))
  },
  handler: async (ctx, args) => {
    const scholarships = await ctx.db.query("scholarships").collect();
    
    return scholarships.filter(scholarship => {
      // Check if any of the user's interested courses match
      const courseMatch = args.courses.some(course =>
        scholarship.eligibleCourses.some(eligibleCourse =>
          eligibleCourse.toLowerCase().includes(course.toLowerCase()) ||
          course.toLowerCase().includes(eligibleCourse.toLowerCase())
        ) || scholarship.eligibleCourses.includes("All Courses")
      );
      
      return courseMatch;
    });
  },
});

export const initializeScholarships = mutation({
  args: {},
  handler: async (ctx) => {
    const existingScholarships = await ctx.db.query("scholarships").first();
    if (existingScholarships) return;

    const sampleScholarships = [
      {
        name: "DOST Science and Technology Scholarship",
        provider: "Department of Science and Technology",
        type: "academic",
        amount: "Full tuition + ₱7,000/month allowance",
        requirements: [
          "Filipino citizen",
          "High school graduate with 85% average",
          "Must take STEM courses",
          "Pass DOST exam"
        ],
        eligibleCourses: ["Computer Science", "Information Technology", "Engineering"],
        deadline: "October 2024",
        applicationLink: "https://sei.dost.gov.ph",
        description: "Merit-based scholarship for students pursuing science and technology courses."
      },
      {
        name: "CHED Scholarship Program",
        provider: "Commission on Higher Education",
        type: "need-based",
        amount: "₱60,000/year",
        requirements: [
          "Filipino citizen",
          "Family income below ₱300,000/year",
          "High school graduate",
          "Good moral character"
        ],
        eligibleCourses: ["All Courses"],
        deadline: "June 2024",
        applicationLink: "https://ched.gov.ph",
        description: "Need-based scholarship for deserving students from low-income families."
      },
      {
        name: "SM Foundation College Scholarship",
        provider: "SM Foundation",
        type: "need-based",
        amount: "₱15,000 - ₱40,000/semester",
        requirements: [
          "Filipino citizen",
          "High school graduate with 83% average",
          "Family income below ₱250,000/year",
          "Community involvement"
        ],
        eligibleCourses: ["Business Administration", "Information Technology", "Education"],
        deadline: "March 2024",
        applicationLink: "https://smfoundation.sm",
        description: "Scholarship program supporting students in business and technology fields."
      },
      {
        name: "Jollibee Group Foundation Scholarship",
        provider: "Jollibee Group Foundation",
        type: "need-based",
        amount: "₱25,000/semester",
        requirements: [
          "Filipino citizen",
          "High school graduate with 85% average",
          "Family income below ₱200,000/year",
          "Leadership potential"
        ],
        eligibleCourses: ["Business Administration", "Culinary Arts", "Hospitality Management"],
        deadline: "April 2024",
        applicationLink: "https://jollibeegroup.com/foundation",
        description: "Supporting students in business and hospitality industries."
      },
      {
        name: "TESDA Training for Work Scholarship Program",
        provider: "Technical Education and Skills Development Authority",
        type: "need-based",
        amount: "Full course fee + ₱3,000/month allowance",
        requirements: [
          "Filipino citizen",
          "High school graduate or equivalent",
          "Family income below ₱200,000/year",
          "Willing to work after training"
        ],
        eligibleCourses: ["Computer Programming", "Graphic Design", "Culinary Arts", "Automotive Servicing"],
        deadline: "Ongoing",
        applicationLink: "https://tesda.gov.ph",
        description: "Skills training scholarship with job placement assistance."
      },
      {
        name: "Ayala Foundation Scholarship",
        provider: "Ayala Foundation",
        type: "academic",
        amount: "₱50,000/year",
        requirements: [
          "Filipino citizen",
          "High school graduate with 90% average",
          "Leadership experience",
          "Community service involvement"
        ],
        eligibleCourses: ["Engineering", "Computer Science", "Business Administration"],
        deadline: "February 2024",
        applicationLink: "https://ayalafoundation.org",
        description: "Merit-based scholarship for exceptional students with leadership potential."
      },
      {
        name: "Gokongwei Brothers Foundation Scholarship",
        provider: "Gokongwei Brothers Foundation",
        type: "academic",
        amount: "Full tuition + ₱5,000/month allowance",
        requirements: [
          "Filipino citizen",
          "High school graduate with 88% average",
          "Must pursue engineering or business",
          "Pass entrance exam"
        ],
        eligibleCourses: ["Engineering", "Computer Science", "Business Administration"],
        deadline: "January 2024",
        applicationLink: "https://gbf.org.ph",
        description: "Comprehensive scholarship for future engineers and business leaders."
      },
      {
        name: "Megaworld Foundation Scholarship",
        provider: "Megaworld Foundation",
        type: "need-based",
        amount: "₱30,000/semester",
        requirements: [
          "Filipino citizen",
          "High school graduate with 85% average",
          "Family income below ₱300,000/year",
          "From partner communities"
        ],
        eligibleCourses: ["Architecture", "Engineering", "Information Technology"],
        deadline: "May 2024",
        applicationLink: "https://megaworldfoundation.com",
        description: "Supporting students in architecture, engineering, and technology fields."
      }
    ];

    for (const scholarship of sampleScholarships) {
      await ctx.db.insert("scholarships", scholarship);
    }
  },
});
