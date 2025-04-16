// components/landing/HeroSection.tsx
import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { authClient } from "@/lib/utils/auth-client";
import { getRouteApi, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const { user } = getRouteApi("__root__").useRouteContext();
  const [loading, setLoading] = useState(false);

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
            className="inline-block rounded-full bg-primary/10 px-3 py-1 sm:px-4 sm:py-2 text-base sm:text-lg md:text-xl text-primary font-semibold tracking-wide shadow-sm"
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
                variant="default"
                className={cn(
                  "w-full sm:w-auto py-5 sm:py-7 px-8 sm:px-12 text-lg sm:text-xl font-bold shadow-lg flex items-center justify-center gap-3 rounded-full"
                )}
                disabled={loading}
                aria-label="Log in with Google"
                onClick={async () => {
                  await authClient.signIn.social(
                    {
                      provider: "google",

                      callbackURL: "/study",
                    },

                    {
                      onRequest: (ctx) => {
                        setLoading(true);
                      },

                      onResponse: (ctx) => {
                        setLoading(false);
                      },
                    }
                  );
                }}
              >
                {/* {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : ( */}
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="0.98em"
                    height="1em"
                    viewBox="0 0 256 262"
                  >
                    <path
                      fill="#4285F4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    ></path>

                    <path
                      fill="#34A853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    ></path>

                    <path
                      fill="#FBBC05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                    ></path>

                    <path
                      fill="#EB4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    ></path>
                  </svg>
                  Sign in with Google
                </>
                {/* )} */}
              </Button>
            ) : (
              // <Button
              //   size="lg"
              //   // className="w-full sm:w-auto py-5 sm:py-7 px-8 sm:px-12 text-lg sm:text-xl font-bold shadow-lg flex items-center justify-center gap-3"
              //   className="flex items-center bg-white border border-button-border-light rounded-full p-0.5 pr-4 "
              //   aria-label="Log in with Google"
              //   onClick={async () => {
              //     await authClient.signIn.social({
              //       provider: "google",
              //       callbackURL: "/study",
              //     });
              //   }}
              // >
              //   <div className="flex items-center justify-center bg-white w-9 h-9 rounded-full">
              //     <svg
              //       xmlns="http://www.w3.org/2000/svg"
              //       viewBox="0 0 24 24"
              //       className="w-5 h-5"
              //     >
              //       <title>Sign in with Google</title>
              //       <desc>Google G Logo</desc>
              //       <path
              //         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              //         className="fill-google-logo-blue"
              //       ></path>
              //       <path
              //         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              //         className="fill-google-logo-green"
              //       ></path>
              //       <path
              //         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              //         className="fill-google-logo-yellow"
              //       ></path>
              //       <path
              //         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              //         className="fill-google-logo-red"
              //       ></path>
              //     </svg>
              //   </div>
              //   <span className="text-sm text-google-text-gray tracking-wider">
              //     Log in with Google
              //   </span>
              // </Button>
              <Link
                to={"/study"}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full sm:w-auto py-5 sm:py-7 px-8 sm:px-12 text-lg sm:text-xl font-bold shadow-lg rounded-full"
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
