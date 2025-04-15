// components/landing/HeroSection.tsx
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { authClient } from "@/lib/utils/auth-client";
import { getRouteApi, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { DeviconGoogleWordmark } from "@/components/icons/devicon-google-wordmark";

const HeroSection = () => {
  const { user } = getRouteApi("__root__").useRouteContext();

  return (
    <section
      className="w-full relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-grid-zinc-700/[0.3] dark:bg-grid-zinc-100/[0.1] py-8 sm:py-0"
      aria-label="Hero section"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-10 w-full max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center space-y-6 sm:space-y-8 text-center w-full"
        >
          <span
            className="inline-block rounded-full bg-primary/10 px-3 py-1 sm:px-4 sm:py-2 text-base sm:text-lg md:text-xl text-primary font-semibold tracking-wide shadow"
            aria-label="Section tagline"
          >
            Study Harder and Smarter
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
            Your Personal
            <br />
            <span className="text-primary">Syllabus Navigator</span>
          </h1>
          <p
            className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-2xl font-medium mt-2 sm:mt-4"
            aria-label="Hero description"
          >
            Turn your syllabus into a clear, actionable roadmap.
          </p>
          <nav
            aria-label="Primary actions"
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-3/4 sm:w-auto justify-center mt-6 sm:mt-8"
          >
            {!user ? (
              <Button
                size="lg"
                className="w-full sm:w-auto py-5 sm:py-7 px-8 sm:px-12 text-lg sm:text-xl font-bold shadow-lg flex items-center justify-center gap-3"
                aria-label="Log in with Google"
                onClick={async () => {
                  await authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/study",
                  });
                }}
              >
                <span className="flex items-center gap-2">
                  Log in with Google
                  {/* <DeviconGoogleWordmark className="w-full" /> */}
                </span>
              </Button>
            ) : (
              <Link
                to={"/study"}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full sm:w-auto py-5 sm:py-7 px-8 sm:px-12 text-lg sm:text-xl font-bold shadow-lg"
                )}
                aria-label="Get Started"
              >
                Study Now
                <ChevronRight
                  className="ml-2 sm:ml-3 h-5 sm:h-6 w-5 sm:w-6"
                  aria-hidden="true"
                />
              </Link>
            )}
          </nav>
        </motion.header>
      </div>
      <div
        className="absolute bottom-4 sm:bottom-8 w-full flex justify-center"
        aria-hidden="true"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="animate-bounce"
        >
          <ChevronRight
            size={28}
            className="transform rotate-90 text-muted-foreground"
            aria-label="Scroll down"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
