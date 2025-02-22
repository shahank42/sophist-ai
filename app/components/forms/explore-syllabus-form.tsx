import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import ActionButton from "../ui/action-button";
import { useState } from "react";
import { createServerFn } from "@tanstack/start";
import { insertSubject } from "@/lib/server/queries/subjects";
import { fetchInitialStructure } from "@/lib/server/prompts/generateInitialTopics";
import { transformInitialStructure } from "@/lib/utils";
import { storeTreeFn } from "@/lib/server/rpc/nodes";

export const registerSubjectAndTreeFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        name: z.string(),
        syllabus: z.string(),
        userId: z.string(),
      })
      .parse(data)
  )
  .handler(async ({ data: { name, syllabus, userId } }) => {
    const registeredSubject = await insertSubject(name, syllabus, userId);
    if (!registeredSubject) {
      throw new Error("Failed to register subject");
    }

    const initialStructure = await fetchInitialStructure(
      registeredSubject.name,
      registeredSubject.rawSyllabus || ""
    );
    const rootNode = transformInitialStructure(initialStructure);

    await storeTreeFn({
      data: { subjectId: registeredSubject.id, rootNode },
    });

    return registeredSubject;
  });

const exploreSyllabusSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(100, "Subject must be 100 characters or less"),
  syllabus: z.string().min(1, "Syllabus is required"),
});

type ExploreSyllabusForm = z.infer<typeof exploreSyllabusSchema>;

export default function ExploreSyllabusForm({ userId }: { userId: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExploreSyllabusForm>({
    resolver: zodResolver(exploreSyllabusSchema),
  });
  // TODO: use rhf to enhance this submission state
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  // if (errors) {
  //   toast.error(`${errors.topic?.message}`);
  // }

  const onSubmit = async (data: ExploreSyllabusForm) => {
    setIsPending(true);
    const subject = await registerSubjectAndTreeFn({
      data: { name: data.subject, syllabus: data.syllabus, userId },
    });
    navigate({ to: `/app/${subject.id}` });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 sm:space-y-4 rounded-2xl border border-input p-4 sm:p-6 bg-secondary/10 text-card-foreground shadow-xl"
    >
      <div className="flex w-full flex-col items-start gap-1.5 sm:gap-2">
        <div className="relative w-full">
          <Input
            id="subject"
            placeholder="What are you studying?"
            {...register("subject")}
            className="w-full border-input bg-secondary/20 px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-border"
          />
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="relative">
          <Textarea
            id="syllabus"
            rows={8}
            placeholder="Paste your syllabus here (formatting doesn't matter)..."
            {...register("syllabus")}
            // className="w-full min-h-[200px] sm:min-h-[300px] border-transparent bg-muted shadow-none px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-border resize-y"
            className="w-full min-h-[200px] sm:min-h-[300px] border-input bg-secondary/20 px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-border resize-y"
          />
        </div>
      </div>

      <ActionButton
        isPending={isPending}
        type="submit"
        variant="secondary"
        className="w-full rounded-lg text-sm sm:text-base"
        size="lg"
      >
        Start Studying <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
      </ActionButton>
    </form>
  );
}
