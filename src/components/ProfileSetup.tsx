import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

const SKILLS_OPTIONS = [
  "Programming", "Coding", "Web Development", "Mobile Apps", "Drawing", "Art", "Design",
  "Creative", "Writing", "Communication", "Leadership", "Mathematics", "Science",
  "Business", "Marketing", "Sales", "Teaching", "Cooking", "Music", "Sports",
  "Mechanical", "Technical", "Problem Solving", "Critical Thinking", "Research"
];

const INTERESTS_OPTIONS = [
  "Technology", "Arts & Design", "Business", "Science", "Healthcare", "Education",
  "Engineering", "Hospitality", "Media", "Sports", "Music", "Literature",
  "Environment", "Social Work", "Psychology", "Law", "Finance", "Agriculture",
  "Architecture", "Fashion", "Gaming", "Animation", "Photography", "Culinary Arts"
];

const REGIONS = [
  "Metro Manila", "Cordillera Administrative Region", "Ilocos Region", "Cagayan Valley",
  "Central Luzon", "CALABARZON", "MIMAROPA", "Bicol Region", "Western Visayas",
  "Central Visayas", "Eastern Visayas", "Zamboanga Peninsula", "Northern Mindanao",
  "Davao Region", "SOCCSKSARGEN", "Caraga", "BARMM"
];

export function ProfileSetup() {
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const createOrUpdateProfile = useMutation(api.userProfiles.createOrUpdateProfile);

  const [formData, setFormData] = useState({
    skills: userProfile?.skills || [],
    interests: userProfile?.interests || [],
    location: userProfile?.location || "",
    educationLevel: userProfile?.educationLevel || "",
    preferredType: userProfile?.preferredType || "",
    budget: userProfile?.budget || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.skills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }
    
    if (formData.interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    if (!formData.location || !formData.educationLevel || !formData.preferredType) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrUpdateProfile(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tell Us About Yourself
          </h2>
          <p className="text-gray-600">
            Help us understand your skills, interests, and goals to provide personalized recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Skills Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What are your skills? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {SKILLS_OPTIONS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.skills.includes(skill)
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                      : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {formData.skills.length} skills
            </p>
          </div>

          {/* Interests Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What are your interests? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {INTERESTS_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.interests.includes(interest)
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {formData.interests.length} interests
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What region are you from? <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select your region</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Education Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your current education level? <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.educationLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, educationLevel: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select education level</option>
              <option value="high-school">High School Graduate</option>
              <option value="college">College Student</option>
              <option value="graduate">College Graduate</option>
            </select>
          </div>

          {/* Preferred Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What type of education are you interested in? <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.preferredType}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredType: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select preference</option>
              <option value="college">College/University Programs</option>
              <option value="tesda">TESDA/Technical Programs</option>
              <option value="both">Both College and TESDA</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your budget range? (Optional)
            </label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select budget range</option>
              <option value="low">₱0 - ₱50,000/year</option>
              <option value="medium">₱50,000 - ₱150,000/year</option>
              <option value="high">₱150,000+/year</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving Profile..." : "Save Profile & Get Recommendations"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
