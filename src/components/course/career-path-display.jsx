import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { FileText, Link, Code, ExternalLink, Globe, Youtube, CheckCircle } from "lucide-react"

export default function CareerPathDisplay({ careerPath }) {
  return (
    <ScrollArea className="h-[70vh] pr-4">
      <Accordion type="single" collapsible className="w-full">
        {careerPath.map((stage, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-b border-gray-700 data-[state=open]:bg-black/30 rounded-lg mb-4 overflow-hidden"
          >
            <AccordionTrigger className="text-lg font-semibold px-4 py-3 hover:bg-[#4F46E5]/10 transition-colors duration-200">
              <div className="flex items-center text-white">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#4F46E5]/20 mr-3">
                  <FileText className="text-[#57FF31] w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-[#57FF31] font-medium">Stage {index + 1}</span>
                  <span className="text-base md:text-lg">{stage.title}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <p className="mb-6 text-gray-300 text-base leading-relaxed">{stage.description}</p>
              <StageSection title="Key Skills" icon={Link} items={stage.skills} color="text-[#57FF31]" />
              <StageSection title="Recommended Actions" icon={Code} items={stage.actions} color="text-[#4F46E5]" />
              <StageSection title="Milestones" icon={CheckCircle} items={stage.milestones} color="text-[#57FF31]" />
              <ResourcesSection resources={stage.resources} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  )
}

function StageSection({ title, icon: Icon, items, color }) {
  if (!items || items.length === 0) return null

  return (
    <div className="mb-6">
      <h3 className={`font-semibold mb-3 flex items-center ${color} text-base`}>
        <Icon className="mr-2 w-4 h-4" />
        {title}
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
        {items.map((item, index) => (
          <li key={index} className="text-gray-300 text-base flex items-start">
            <Badge variant="outline" className={`mr-2 ${color} border-current shrink-0 mt-0.5`}>
              {index + 1}
            </Badge>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ResourcesSection({ resources }) {
  if (!resources || resources.length === 0) return null

  return (
    <div className="mb-2">
      <h3 className="font-semibold mb-3 flex items-center text-[#4F46E5] text-base">
        <ExternalLink className="mr-2 w-4 h-4" />
        Resources
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start p-3 bg-black/30 rounded-lg hover:bg-[#4F46E5]/10 transition-colors group"
          >
            <div className="shrink-0 mr-3 mt-0.5">
              {resource.url.includes("youtube.com") ? (
                <Youtube className="w-5 h-5 text-red-500" />
              ) : (
                <Globe className="w-5 h-5 text-[#57FF31]" />
              )}
            </div>
            <div>
              <p className="text-white group-hover:text-[#57FF31] transition-colors font-medium text-sm">
                {resource.title}
              </p>
              <p className="text-xs text-gray-400 truncate mt-1 max-w-xs">{resource.url}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

