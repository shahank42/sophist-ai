import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchInitialStructure } from "@/lib/server/prompts/generateInitialTopics";
import { insertSubject } from "@/lib/server/queries/subjects";
import { storeTreeFn } from "@/lib/server/rpc/nodes";
import { queryUserSubjectsOptions } from "@/lib/server/rpc/subjects";
import { transformInitialStructure } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

const FREE_TIER_MAX_SUBJECTS = 2;

export default function ExploreSyllabusForm() {
  const rootContext = getRouteApi("__root__").useRouteContext();
  const user = rootContext.user!;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExploreSyllabusForm>({
    resolver: zodResolver(exploreSyllabusSchema),
  });
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const { data: userSubjects } = useQuery(queryUserSubjectsOptions(user.id));

  const validateSubjectCreation = (): boolean => {
    const subjectCount = userSubjects?.length || 0;

    if (!user.isPro && subjectCount >= FREE_TIER_MAX_SUBJECTS) {
      toast.info(
        `Free users can create up to ${FREE_TIER_MAX_SUBJECTS} subjects. Upgrade to Pro for unlimited subjects!`
      );
      return false;
    }

    return true;
  };

  const onSubmit = async (data: ExploreSyllabusForm) => {
    if (!validateSubjectCreation()) {
      return;
    }

    setIsPending(true);
    try {
      const subject = await registerSubjectAndTreeFn({
        data: { name: data.subject, syllabus: data.syllabus, userId: user.id },
      });
      navigate({ to: `/study/${subject.id}` });
    } catch (error) {
      toast.error("Failed to create subject. Please try again.");
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="w-full max-w-3xl mx-auto md:p-6 rounded-2xl shadow-xs">
        <div className="mb-8 text-center">
          <span className="flex justify-center items-center gap-4 text-3xl md:text-4xl text-foreground">
            {/* <span className="">
              What do you want to
            </span>
            <WordRotate
              className="font-bold"
              words={["study", "cram", "learn"]}
            />
            <span className="">?</span> */}
            What do you want to study?
          </span>
          {/* <p className="mt-2 text-sm text-muted-foreground">
            Enter your subject and syllabus to begin
          </p> */}
        </div>

        <div className="space-y-6">
          <div>
            <Input
              id="subject"
              placeholder="Enter subject name"
              {...register("subject")}
              className="w-full text-base md:text-md lg:text-lg border-input focus:border-ring focus:ring-ring rounded-lg bg-background text-foreground placeholder-muted-foreground "
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-destructive">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <Textarea
              id="syllabus"
              placeholder="Paste your syllabus here (formatting doesn't matter)..."
              {...register("syllabus")}
              className="w-full h-52 text-base md:text-md lg:text-lg border-input focus:border-ring focus:ring-ring rounded-lg bg-background text-foreground placeholder-muted-foreground "
            />
            {errors.syllabus && (
              <p className="mt-1 text-sm text-destructive">
                {errors.syllabus.message}
              </p>
            )}
          </div>

          <Button
            disabled={isPending}
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="w-full flex items-center justify-center gap-2 bg-primary/90 hover:bg-primary text-primary-foreground rounded-lg py-5 font-medium transition-all"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-primary-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <span>Start Exploring</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
