import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export default function CallToAction() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="mt-4">
            Join thousands of students who are already using SophistAI to master
            their courses with ease.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/">
                <span>Get Started</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link to="/">
                <span>Book Demo</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
