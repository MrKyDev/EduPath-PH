import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").collect();
  },
});

export const getCoursesByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

export const searchCourses = query({
  args: { 
    skills: v.array(v.string()),
    interests: v.array(v.string()),
    type: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let courses = await ctx.db.query("courses").collect();
    
    if (args.type) {
      courses = courses.filter(course => course.type === args.type);
    }

    // Score courses based on skill and interest matches
    const scoredCourses = courses.map(course => {
      let score = 0;
      
      // Check skill matches
      args.skills.forEach(skill => {
        if (course.skills.some(courseSkill => 
          courseSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(courseSkill.toLowerCase())
        )) {
          score += 2;
        }
      });

      // Check interest matches (broader matching)
      args.interests.forEach(interest => {
        if (course.category.toLowerCase().includes(interest.toLowerCase()) ||
            course.name.toLowerCase().includes(interest.toLowerCase()) ||
            course.description.toLowerCase().includes(interest.toLowerCase())) {
          score += 1;
        }
      });

      return { ...course, matchScore: score };
    });

    return scoredCourses
      .filter(course => course.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  },
});

// Initialize sample courses
export const initializeCourses = mutation({
  args: {},
  handler: async (ctx) => {
    const existingCourses = await ctx.db.query("courses").first();
    if (existingCourses) return;

    const sampleCourses = [
      // College Courses
      {
        name: "Bachelor of Science in Information Technology (BSIT)",
        type: "college",
        category: "Technology",
        description: "Comprehensive program covering programming, database management, networking, and system analysis.",
        duration: "4 years",
        requirements: ["High School Diploma", "Math Proficiency", "English Proficiency"],
        careerPaths: ["Software Developer", "System Administrator", "IT Consultant", "Database Administrator"],
        skills: ["programming", "coding", "computer", "technology", "software"],
        averageSalary: "₱25,000 - ₱80,000/month"
      },
      {
        name: "Bachelor of Fine Arts in Multimedia Arts",
        type: "college",
        category: "Arts & Design",
        description: "Creative program focusing on digital art, animation, graphic design, and multimedia production.",
        duration: "4 years",
        requirements: ["High School Diploma", "Portfolio", "Creative Aptitude Test"],
        careerPaths: ["Graphic Designer", "Animator", "Web Designer", "Game Artist"],
        skills: ["drawing", "art", "design", "creative", "digital art", "animation"],
        averageSalary: "₱20,000 - ₱60,000/month"
      },
      {
        name: "Bachelor of Science in Computer Science (BSCS)",
        type: "college",
        category: "Technology",
        description: "Advanced program in algorithms, software engineering, artificial intelligence, and computer systems.",
        duration: "4 years",
        requirements: ["High School Diploma", "Strong Math Background", "Logic Skills"],
        careerPaths: ["Software Engineer", "AI Specialist", "Research Scientist", "Tech Lead"],
        skills: ["programming", "coding", "mathematics", "logic", "algorithms"],
        averageSalary: "₱30,000 - ₱120,000/month"
      },
      {
        name: "Bachelor of Science in Business Administration",
        type: "college",
        category: "Business",
        description: "Comprehensive business program covering management, marketing, finance, and entrepreneurship.",
        duration: "4 years",
        requirements: ["High School Diploma", "Communication Skills", "Leadership Potential"],
        careerPaths: ["Business Manager", "Marketing Specialist", "Entrepreneur", "Financial Analyst"],
        skills: ["leadership", "communication", "business", "management", "marketing"],
        averageSalary: "₱25,000 - ₱100,000/month"
      },
      // TESDA Courses
      {
        name: "Computer Programming NC III",
        type: "tesda",
        category: "Technology",
        description: "Practical programming course covering web development, mobile apps, and software creation.",
        duration: "6-12 months",
        requirements: ["High School Graduate", "Basic Computer Literacy"],
        careerPaths: ["Junior Developer", "Web Developer", "Mobile App Developer"],
        skills: ["programming", "coding", "web development", "mobile apps"],
        averageSalary: "₱18,000 - ₱45,000/month"
      },
      {
        name: "Graphic Design NC III",
        type: "tesda",
        category: "Arts & Design",
        description: "Hands-on training in digital design, branding, and visual communication.",
        duration: "3-6 months",
        requirements: ["High School Graduate", "Basic Computer Skills", "Creative Interest"],
        careerPaths: ["Graphic Designer", "Layout Artist", "Brand Designer"],
        skills: ["design", "art", "creative", "graphics", "visual design"],
        averageSalary: "₱15,000 - ₱40,000/month"
      },
      {
        name: "Culinary Arts NC II",
        type: "tesda",
        category: "Hospitality",
        description: "Professional cooking and food preparation training for restaurant and hotel industry.",
        duration: "6 months",
        requirements: ["High School Graduate", "Physical Fitness", "Food Safety Knowledge"],
        careerPaths: ["Chef", "Cook", "Food Service Manager", "Restaurant Owner"],
        skills: ["cooking", "food", "culinary", "hospitality", "service"],
        averageSalary: "₱15,000 - ₱50,000/month"
      },
      {
        name: "Automotive Servicing NC I & II",
        type: "tesda",
        category: "Technical",
        description: "Comprehensive automotive repair and maintenance training program.",
        duration: "6-12 months",
        requirements: ["High School Graduate", "Mechanical Aptitude", "Physical Fitness"],
        careerPaths: ["Auto Mechanic", "Service Technician", "Shop Owner"],
        skills: ["mechanical", "automotive", "repair", "technical", "hands-on"],
        averageSalary: "₱18,000 - ₱45,000/month"
      }
    ];

    for (const course of sampleCourses) {
      await ctx.db.insert("courses", course);
    }
  },
});
