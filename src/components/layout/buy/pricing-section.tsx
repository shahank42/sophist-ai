import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Repeat,
  Wallet,
  Zap,
} from "lucide-react";
import { useState } from "react";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function PricingSection() {
  const [oneTimeDuration, setOneTimeDuration] = useState(false);

  return (
    <section className="relative w-full py-12 md:py-20 lg:py-24 overflow-hidden">
      {/* Background effects */}
      <div
        className="absolute inset-0 -z-20 bg-grid-zinc-700/[0.3] dark:bg-grid-zinc-100/[0.1]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]"
        aria-hidden="true"
      />

      <MaxWidthWrapper className="p-6 md:px-32 lg:px-64">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.1,
                },
              },
            },
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <TextEffect
              as="h2"
              preset="fade-in-blur"
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              Choose Your Plan
            </TextEffect>
            <TextEffect
              as="p"
              preset="fade-in-blur"
              className="max-w-[700px] text-base text-muted-foreground md:text-lg"
            >
              Select the perfect plan for your needs with flexible payment
              options
            </TextEffect>
          </div>

          {/* Free Tier - Horizontal Banner */}
          <motion.div
            className="mb-12 relative"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background px-3 z-10">
              <span className="text-sm font-medium text-muted-foreground">
                START FOR FREE
              </span>
            </div>
            <Card className="border-dashed hover:border-primary/50 transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 md:p-8">
                <div className="flex items-center mb-6 md:mb-0">
                  <div className="mr-6 p-4 rounded-full bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl md:text-2xl font-bold mb-1">
                      Free Plan
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Basic access with limited features
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Core features</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Limited storage</span>
                    </li>
                  </ul>
                  <div className="flex items-center gap-2 md:ml-4">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-sm text-muted-foreground">
                      forever
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="default"
                    className="w-full md:w-auto"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* One-Time Purchases Section */}
            <motion.div
              className="space-y-4"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">
                  One-Time Purchase
                </h3>
              </div>

              <Card className="relative overflow-hidden border-zinc-200 dark:border-zinc-800 h-full flex flex-col transition-colors hover:border-primary/50 duration-300">
                <div className="absolute top-0 right-0 bg-primary/10 px-3 py-1 text-xs font-medium rounded-bl-md text-primary">
                  Pay Once
                </div>

                <CardHeader className="pt-8 px-6">
                  <CardTitle className="flex justify-between items-center gap-4">
                    <span className="text-xl md:text-2xl">Pro Access</span>
                    <span className="text-3xl md:text-4xl font-bold">
                      {oneTimeDuration ? "$29" : "$9"}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base mt-1">
                    Full access for {oneTimeDuration ? "one month" : "one week"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 flex-1 px-6">
                  <div className="flex items-center justify-center space-x-3">
                    <Label
                      htmlFor="duration-toggle"
                      className={`flex items-center text-sm font-medium ${
                        !oneTimeDuration
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Clock className="mr-1.5 h-4 w-4" />
                      Weekly
                    </Label>
                    <Switch
                      id="duration-toggle"
                      checked={oneTimeDuration}
                      onCheckedChange={setOneTimeDuration}
                    />
                    <Label
                      htmlFor="duration-toggle"
                      className={`flex items-center text-sm font-medium ${
                        oneTimeDuration
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <CalendarDays className="mr-1.5 h-4 w-4" />
                      Monthly
                    </Label>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-base md:text-lg">
                      What's included:
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <Check className="mr-2.5 h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>All Pro features with no restrictions</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2.5 h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Unlimited storage and bandwidth</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2.5 h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Priority support via email and chat</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2.5 h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Advanced analytics and reporting</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="flex items-center py-1 px-2.5 text-xs"
                    >
                      <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                      Credit/Debit
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center py-1 px-2.5 text-xs"
                    >
                      <Wallet className="mr-1.5 h-3.5 w-3.5" />
                      UPI
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-6">
                  <Button className="w-full text-sm h-10" size="default">
                    Buy {oneTimeDuration ? "Monthly" : "Weekly"} Access
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Subscription Section */}
            <motion.div
              className="space-y-4"
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-full bg-primary/10">
                  <Repeat className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Subscription</h3>
              </div>

              <Card className="relative overflow-hidden border-zinc-200 dark:border-zinc-800 h-full flex flex-col transition-colors hover:border-primary/50 duration-300">
                <div className="absolute top-0 right-0 bg-primary/10 px-3 py-1 text-xs font-medium rounded-bl-md text-primary">
                  Best Value
                </div>

                <CardHeader className="pt-8 px-6">
                  <CardTitle className="flex justify-between items-center gap-4">
                    <span className="text-xl md:text-2xl">
                      Pro Subscription
                    </span>
                    <div className="text-right">
                      <span className="text-3xl md:text-4xl font-bold">
                        $19
                      </span>
                      <span className="text-sm md:text-base text-muted-foreground ml-1.5">
                        /month
                      </span>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base mt-1">
                    Continuous access with auto-renewal
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 flex-1 px-6">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="py-0.5 px-2 text-xs">
                        Save 34%
                      </Badge>
                      <span className="text-xs md:text-sm text-muted-foreground">
                        compared to monthly purchases
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-base md:text-lg">
                      What's included:
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <Check className="mr-2.5 h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>All Pro features with no restrictions</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2.5 h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Unlimited storage and bandwidth</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2.5 h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Priority support via email and chat</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2.5 h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Advanced analytics and reporting</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2.5 h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Early access to new features</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="mr-2.5 h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Cancel anytime</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="flex items-center py-1 px-2.5 text-xs"
                    >
                      <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                      Credit/Debit
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-6">
                  <Button className="w-full text-sm h-10" size="default">
                    Subscribe Now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </AnimatedGroup>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-sm md:text-base text-muted-foreground">
            All paid plans include a 3-day money-back guarantee. No questions
            asked.
          </p>
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
}
