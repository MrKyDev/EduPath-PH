import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ProfileSetup } from "./ProfileSetup";
import { RecommendationsView } from "./RecommendationsView";
import { CoachEduChat } from "./CoachEduChat";
import { toast } from "sonner";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const initializeData = useMutation(api.init.initializeData);

  useEffect(() => {
    // Initialize sample data on first load
    initializeData().catch(console.error);
  }, [initializeData]);

  useEffect(() => {
    if (userProfile) {
      setActiveTab("recommendations");
    }
  }, [userProfile]);

  const tabs = [
    { id: "profile", name: "Profile Setup", icon: "👤" },
    { id: "recommendations", name: "Recommendations", icon: "🎯" },
    { id: "chat", name: "CoachEdu", icon: "🤖" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to EduPath PH
        </h1>
        <p className="text-gray-600">
          Your personalized AI-guided roadmap to educational and career success in the Philippines.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[60vh]">
        {activeTab === "profile" && <ProfileSetup />}
        {activeTab === "recommendations" && <RecommendationsView />}
        {activeTab === "chat" && <CoachEduChat />}
      </div>
    </div>
  );
}
