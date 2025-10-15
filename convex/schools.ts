import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getSchoolsByLocation = query({
  args: { location: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schools")
      .withIndex("by_location", (q) => q.eq("location", args.location))
      .collect();
  },
});

export const getSchoolsByRegion = query({
  args: { region: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schools")
      .withIndex("by_region", (q) => q.eq("region", args.region))
      .collect();
  },
});

export const searchSchoolsByCourse = query({
  args: { courseName: v.string(), location: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let schools = await ctx.db.query("schools").collect();
    
    // Filter by course offering
    schools = schools.filter(school => 
      school.courses.some(course => 
        course.toLowerCase().includes(args.courseName.toLowerCase())
      )
    );

    // Filter by location if provided
    if (args.location) {
      schools = schools.filter(school => 
        school.location.toLowerCase().includes(args.location!.toLowerCase()) ||
        school.region.toLowerCase().includes(args.location!.toLowerCase())
      );
    }

    return schools;
  },
});

export const initializeSchools = mutation({
  args: {},
  handler: async (ctx) => {
    const existingSchools = await ctx.db.query("schools").first();
    if (existingSchools) return;

    const sampleSchools = [
      // Universities in Metro Manila
      {
        name: "University of the Philippines Diliman",
        type: "university",
        location: "Quezon City",
        region: "Metro Manila",
        courses: ["Computer Science", "Information Technology", "Fine Arts", "Business Administration"],
        website: "https://upd.edu.ph",
        contactInfo: "+63 2 8981 8500",
        tuitionRange: "₱12,000 - ₱24,000/semester",
        accreditation: ["CHED", "PAASCU", "ISO 9001:2015"]
      },
      {
        name: "Ateneo de Manila University",
        type: "university",
        location: "Quezon City",
        region: "Metro Manila",
        courses: ["Computer Science", "Information Systems", "Management", "Fine Arts"],
        website: "https://ateneo.edu",
        contactInfo: "+63 2 8426 6001",
        tuitionRange: "₱80,000 - ₱120,000/semester",
        accreditation: ["CHED", "PAASCU", "WASC"]
      },
      {
        name: "De La Salle University",
        type: "university",
        location: "Manila",
        region: "Metro Manila",
        courses: ["Information Technology", "Computer Science", "Multimedia Arts", "Business"],
        website: "https://dlsu.edu.ph",
        contactInfo: "+63 2 8524 4611",
        tuitionRange: "₱70,000 - ₱110,000/semester",
        accreditation: ["CHED", "PAASCU", "WASC"]
      },
      // Schools in Baguio
      {
        name: "University of the Philippines Baguio",
        type: "university",
        location: "Baguio City",
        region: "Cordillera Administrative Region",
        courses: ["Computer Science", "Fine Arts", "Social Sciences"],
        website: "https://upb.edu.ph",
        contactInfo: "+63 74 442 3071",
        tuitionRange: "₱12,000 - ₱24,000/semester",
        accreditation: ["CHED", "AACCUP"]
      },
      {
        name: "University of the Cordilleras",
        type: "university",
        location: "Baguio City",
        region: "Cordillera Administrative Region",
        courses: ["Information Technology", "Computer Science", "Business Administration", "Multimedia Arts"],
        website: "https://uc-bcf.edu.ph",
        contactInfo: "+63 74 442 3316",
        tuitionRange: "₱35,000 - ₱55,000/semester",
        accreditation: ["CHED", "PAASCU"]
      },
      // TESDA Centers
      {
        name: "TESDA National Capital Region",
        type: "tesda",
        location: "Manila",
        region: "Metro Manila",
        courses: ["Computer Programming", "Graphic Design", "Culinary Arts", "Automotive Servicing"],
        website: "https://tesda.gov.ph",
        contactInfo: "+63 2 8887 7777",
        tuitionRange: "₱5,000 - ₱15,000/course",
        accreditation: ["TESDA"]
      },
      {
        name: "TESDA CAR Regional Office",
        type: "tesda",
        location: "Baguio City",
        region: "Cordillera Administrative Region",
        courses: ["Computer Programming", "Automotive Servicing", "Culinary Arts"],
        website: "https://tesda.gov.ph",
        contactInfo: "+63 74 444 7777",
        tuitionRange: "₱3,000 - ₱12,000/course",
        accreditation: ["TESDA"]
      },
      // Regional Universities
      {
        name: "University of San Carlos",
        type: "university",
        location: "Cebu City",
        region: "Central Visayas",
        courses: ["Computer Science", "Information Technology", "Business Administration"],
        website: "https://usc.edu.ph",
        contactInfo: "+63 32 253 1000",
        tuitionRange: "₱40,000 - ₱70,000/semester",
        accreditation: ["CHED", "PAASCU"]
      },
      {
        name: "Mindanao State University",
        type: "university",
        location: "Marawi City",
        region: "BARMM",
        courses: ["Computer Science", "Information Technology", "Engineering"],
        website: "https://msu.edu.ph",
        contactInfo: "+63 63 521 3040",
        tuitionRange: "₱8,000 - ₱18,000/semester",
        accreditation: ["CHED", "AACCUP"]
      }
    ];

    for (const school of sampleSchools) {
      await ctx.db.insert("schools", school);
    }
  },
});
