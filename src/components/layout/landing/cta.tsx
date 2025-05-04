import { CTAButtons } from "./cta-buttons";

export default function CallToAction() {
  return (
    <section className="py-16 w-full md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Visualize Your Path to Academic Success. 
          </h2>
          <p className="mt-8 text-xl">
            Create Your Interactive Study Map Today.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {/* <Button asChild size="lg">
              <Link to="/">
                <span>Get Started</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link to="/">
                <span>Book Demo</span>
              </Link>
            </Button> */}
            <CTAButtons />
          </div>
        </div>
      </div>
    </section>
  );
}
