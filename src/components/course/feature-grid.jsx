import { Card, CardContent } from "@/components/ui/card"
import { Zap, Brain, Rocket, BookOpen, Target, Compass } from "lucide-react"

export default function FeatureGrid() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Guidance",
      description: "Get personalized career advice using advanced AI technology",
      color: "text-[#57FF31]",
      bgGradient: "from-[#57FF31]/10 to-transparent",
    },
    {
      icon: Target,
      title: "Targeted Learning Paths",
      description: "Discover the exact skills you need for your dream career",
      color: "text-[#4F46E5]",
      bgGradient: "from-[#4F46E5]/10 to-transparent",
    },
    {
      icon: BookOpen,
      title: "Course Recommendations",
      description: "Find the best free and paid courses for your career goals",
      color: "text-[#57FF31]",
      bgGradient: "from-[#57FF31]/10 to-transparent",
    },
    {
      icon: Brain,
      title: "Skills Analysis",
      description: "Visualize your skill gaps and strengths with interactive charts",
      color: "text-[#4F46E5]",
      bgGradient: "from-[#4F46E5]/10 to-transparent",
    },
    {
      icon: Compass,
      title: "Career Roadmap",
      description: "Follow a clear timeline from beginner to expert in your field",
      color: "text-[#57FF31]",
      bgGradient: "from-[#57FF31]/10 to-transparent",
    },
    {
      icon: Rocket,
      title: "Accelerated Growth",
      description: "Fast-track your professional development with AI insights",
      color: "text-[#4F46E5]",
      bgGradient: "from-[#4F46E5]/10 to-transparent",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {features.map((feature, index) => (
        <Card
          key={index}
          className="bg-black/80 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border border-gray-800 hover:border-[#4F46E5]/50 transition-all duration-300 group"
        >
          <CardContent className="p-6">
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white group-hover:text-[#57FF31] transition-colors duration-300">
              {feature.title}
            </h2>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

