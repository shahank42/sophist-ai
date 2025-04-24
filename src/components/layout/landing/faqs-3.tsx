import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FAQsThree() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "file-text",
      question: "How do I input my syllabus?",
      answer:
        "Just copy and paste your syllabus in, simple as that! Don't worry about the formatting, our syllabus parser takes care of that. We have plans to support other types of syllabus input in the future.",
    },
    {
      id: "item-2",
      icon: "map",
      question: "How does the interactive knowledge map work?",
      answer:
        "Once your syllabus is uploaded, our AI analyzes its structure and generates a navigable tree of topics and subtopics. Click any node to explore, read custom articles, or mark progress—no extra prompts needed.",
    },
    {
      id: "item-3",
      icon: "layers",
      question: "Can I customize or expand my syllabus map?",
      answer:
        "Absolutely. You can click the '+' button to auto-generate new subtopics at any level—keeping your study plan both flexible and comprehensive.",
    },
    {
      id: "item-4",
      icon: "check-check",
      question: "How does progress tracking work?",
      answer:
        "Mark individual topics or subtopics as complete—finishing all children marks the parent done, and completing the parent checks off its descendants. It’s a seamless way to see what’s left and stay motivated.",
    },
    {
      id: "item-5",
      icon: "coins",
      question: "What are credits?",
      answer:
        "Credits are what you use to perform actions in SophistAI. Currently, users require 50 credits to generate a syllabus and 10 credits to generate subtopics.",
    },
    {
      id: "item-6",
      icon: "credit-card",
      question: "How do I obtain credits?",
      answer:
        "Every new account is given 500 credits by default. If you need more credits, you can buy our credit bundles.",
    },
    {
      id: "item-8",
      icon: "help-circle",
      question: "I still need more help, what now?",
      answer:
        "Reach out to us at team.sophistai@gmail.com, or find us on X as @sophist_ai",
    },
  ];

  return (
    <section className=" py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="mt-4 text-3xl text-center md:text-left font-bold">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground mt-4">
                Just in case you're wondering about the same things.
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-background shadow-xs rounded-lg border px-4 last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer md:cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon
                          name={item.icon}
                          className="m-auto size-4"
                        />
                      </div>
                      <span className="text-base">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
