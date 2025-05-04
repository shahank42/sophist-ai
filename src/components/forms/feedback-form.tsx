import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/utils/auth-client";
import { auth } from "@/lib/server/auth";
import { toast } from "sonner";

const feedbackFormSchema = z.object({
  body: z.string().min(1, "Some feedback is required!")
})

type FeedbackForm = z.infer<typeof feedbackFormSchema>

export default function FeedbackForm({
  setOpenFeedbackDialog
}: {
  setOpenFeedbackDialog: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackFormSchema),
  });

  const [isPending, setIsPending] = useState(false);


  const onSubmit = async (data: FeedbackForm) => {
    setIsPending(true);

    try {
      await authClient.feedback.submit({ text: data.body });
      toast.success("Got it! Thanks for helping us improve SophistAI.");
      setOpenFeedbackDialog(false);
    } catch (error) {
      toast.error("Oops! Couldn't send feedback. Please try again shortly.");
    }

    setIsPending(false);
  }

  return (
    <form className="space-y-5 py-3 md:py-1">
      <Textarea
        {...register("body")}
        id="feedback"
        placeholder="Enter your feedback here (suggestions, bugs, ideas...)"
        aria-label="Send feedback"
        className="text-sm md:text-md"
        rows={6}
      />

      {errors.body && (
        <p className="mt-1 text-sm text-destructive">
          {errors.body.message}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-end">
        <Button type="button" disabled={isPending} onClick={handleSubmit(onSubmit)}>
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
              Submit feedback
            </>
          )}
        </Button>
      </div>
    </form>
  )
}