import { useState, useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function RecommendationsView() {
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const generateRecommendations = useAction(api.ai.generateRecommendations);
  
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("courses");

  useEffect(() => {
    if (userProfile && !recommendations) {
      loadRecommendations();
    }
  }, [userProfile]);

  const loadRecommendations = async () => {
    if (!userProfile) return;
    
    setIsLoading(true);
    try {
      const result = await generateRecommendations({
        skills: userProfile.skills,
        interests: userProfile.interests,
        location: userProfile.location,
        educationLevel: userProfile.educationLevel,
        preferredType: userProfile.preferredType,
      });
      setRecommendations(result);
    } catch (error) {
      toast.error("Failed to generate recommendations. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👤</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Your Profile First</h3>
        <p className="text-gray-600">
          Please set up your profile to get personalized recommendations.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Your Recommendations</h3>
        <p className="text-gray-600">
          CoachEdu is analyzing your profile to find the best matches...
        </p>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="text-center py-12">
        <button
          onClick={loadRecommendations}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Generate Recommendations
        </button>
      </div>
    );
  }

  const sections = [
    { id: "courses", name: "Recommended Courses", icon: "📚", count: recommendations.courses?.length || 0 },
    { id: "schools", name: "Nearby Schools", icon: "🏫", count: recommendations.schools?.length || 0 },
    { id: "scholarships", name: "Scholarships", icon: "💰", count: recommendations.scholarships?.length || 0 },
    { id: "insights", name: "AI Insights", icon: "🤖", count: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your Personalized Recommendations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`p-4 rounded-lg text-left transition-colors ${
                activeSection === section.id
                  ? "bg-blue-50 border-2 border-blue-200"
                  : "bg-gray-50 border-2 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{section.icon}</span>
                <span className="text-sm font-medium text-gray-500">{section.count}</span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm">{section.name}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === "courses" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📚 Recommended Courses</h3>
          <div className="space-y-4">
            {recommendations.courses?.map((course: any, index: number) => (
              <div key={course._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{course.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.type === "college" 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {course.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span> {course.duration}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Average Salary:</span> {course.averageSalary}
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-medium text-gray-700 text-sm">Career Paths:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {course.careerPaths.map((career: string, idx: number) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "schools" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🏫 Nearby Schools</h3>
          <div className="space-y-4">
            {recommendations.schools?.map((school: any) => (
              <div key={school._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{school.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    school.type === "university" 
                      ? "bg-purple-100 text-purple-700" 
                      : school.type === "tesda"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {school.type.toUpperCase()}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium text-gray-700">Location:</span> {school.location}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tuition:</span> {school.tuitionRange}
                  </div>
                </div>
                {school.contactInfo && (
                  <div className="text-sm mb-3">
                    <span className="font-medium text-gray-700">Contact:</span> {school.contactInfo}
                  </div>
                )}
                {school.website && (
                  <div className="text-sm mb-3">
                    <a 
                      href={school.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700 text-sm">Available Courses:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {school.courses.slice(0, 4).map((course: string, idx: number) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {course}
                      </span>
                    ))}
                    {school.courses.length > 4 && (
                      <span className="text-gray-500 text-xs">+{school.courses.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "scholarships" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">💰 Scholarship Opportunities</h3>
          <div className="space-y-4">
            {recommendations.scholarships?.map((scholarship: any) => (
              <div key={scholarship._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{scholarship.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    scholarship.type === "academic" 
                      ? "bg-blue-100 text-blue-700" 
                      : scholarship.type === "need-based"
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {scholarship.type.replace("-", " ").toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{scholarship.description}</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium text-gray-700">Amount:</span> {scholarship.amount}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Provider:</span> {scholarship.provider}
                  </div>
                </div>
                {scholarship.deadline && (
                  <div className="text-sm mb-3">
                    <span className="font-medium text-gray-700">Deadline:</span> {scholarship.deadline}
                  </div>
                )}
                <div className="mb-3">
                  <span className="font-medium text-gray-700 text-sm">Requirements:</span>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {scholarship.requirements.slice(0, 3).map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
                {scholarship.applicationLink && (
                  <a 
                    href={scholarship.applicationLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "insights" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🤖 CoachEdu's Insights</h3>
          <div className="prose prose-gray max-w-none">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">C</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">CoachEdu's Analysis</h4>
                  <div className="text-gray-700 whitespace-pre-line">
                    {recommendations.aiInsights}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadRecommendations}
          disabled={isLoading}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Refreshing..." : "Refresh Recommendations"}
        </button>
      </div>
    </div>
  );
}
