import { ArrowRight, Code, Laptop2, TrendingUp, Globe, MoreHorizontal, Edit } from "lucide-react";

const EmpowerSection = () => {
  return (
    <section className="bg-black text-white flex flex-col items-center justify-center py-16 space-y-6">
      <div className="flex space-x-4">
        <div className="bg-pink-300 px-6 py-2 rounded-full flex items-center">
          <Globe className="text-black w-6 h-6" />
        </div>
        <div className="border border-white p-2 rounded-full">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div className="bg-yellow-400 p-2 rounded-lg border border-white">
          <Laptop2 className="w-6 h-6 text-black" />
        </div>
      </div>

      <h2 className="text-center text-3xl font-semibold">
        Empowering students <br /> from Tier 2 & Tier 3 <br /> Cities
      </h2>

      <div className="flex space-x-4">
        <div className="bg-green-500 p-3 rounded-full">
          <Edit className="w-6 h-6 text-black" />
        </div>
        <div className="bg-blue-500 p-3 rounded-full">
          <Code className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="bg-blue-300 px-6 py-2 rounded-full flex items-center">
          <MoreHorizontal className="text-black w-6 h-6" />
        </div>
        <button className="border border-white px-6 py-2 rounded-full flex items-center space-x-2">
          <span>→</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default EmpowerSection;
