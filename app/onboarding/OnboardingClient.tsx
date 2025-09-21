"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Loader2Icon,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { User } from "@prisma/client";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  sendPhoneVerification,
  verifyPhoneNumber,
} from "../actions/user-actions";
import { track } from "@vercel/analytics/react";
import { trackEvent } from "@/lib/analytics";

export default function OnboardingClient({
  user,
  currentStep,
}: {
  user: User;
  currentStep: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(currentStep);
  const [isMonthly, setIsMonthly] = useState(true);
  const [verifionError, setVerifionError] = useState("");
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [answers, setAnswers] = useState({
    reminderType: "",
    notificationPreference: "",
    forgetfulness: "",
    hearAbout: "",
    phoneNumber: "",
  });

  const handleVerification = async (value: string) => {
    try {
      setIsLoading(true);
      const result = await verifyPhoneNumber({
        code: value,
        phoneNumber: answers.phoneNumber,
      });
      if (result.success) {
        track("phone_number_verified", {
          location: "onboarding_client",
          email: user.email,
        });
        trackEvent("phone_verification_completed", {
          userId: user.id,
          location: "onboarding_client",
        });
        toast.success("Phone number verified!");
        setVerified(true);
        setVerificationCode("");
        setVerificationSent(false);
        setAnswers({
          ...answers,
          phoneNumber: answers.phoneNumber,
        });
      } else {
        track("phone_number_verification_error", {
          location: "onboarding_client",
          email: user.email,
          error: result?.error || "Invalid verification code",
        });
        setVerifionError(result?.error || "Invalid verification code");
        toast.error(result?.error || "Invalid verification code");
      }
    } catch (error) {
      track("phone_number_verification_error_error", {
        location: "onboarding_client",
        email: user.email,
        error: error as string,
      });
      setVerifionError("Invalid verification code");
      toast.error("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPhoneVerification = async (phoneNumber: string) => {
    setIsLoading(true);
    trackEvent("phone_number_verification_started", {
      userId: user.id,
      location: "onboarding_client",
    });
    try {
      const result = await sendPhoneVerification({ phoneNumber });
      if (result.success) {
        toast.success("Verification code sent!");
        setVerificationSent(true);
      } else {
        setVerifionError(result?.error || "Failed to send verification code");
        toast.error(result?.error || "Failed to send verification code");
      }
    } catch (error) {
      setVerifionError("Failed to send verification code");
      toast.error("Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const slides = [
    {
      id: "welcome",
      title: "Welcome to the Notifoo Dojo!",
      subtitle: "Time to master the ancient art of remembering stuff",
      content: (
        <div className="space-y-6 text-center">
          {answers.phoneNumber.length < 7 && (
            <div className="text-6xl flex justify-center items-center">
              <PhoneCall className="w-12 h-12" />
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            We're about to ask you a few questions to customize your reminder
            experience. Don't worry, this is way more fun than filling out tax
            forms!
          </p>
          <div className="space-y-4">
            <div className="space-y-4">
              <Label htmlFor="phoneNumber" className="text-center block">
                What is the best phone number to reach you?{" "}
                <span className="text-xs text-muted-foreground">
                  (U.S. phone numbers only please)
                </span>
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                disabled={verified}
                placeholder="i.e. 4041231234"
                value={answers.phoneNumber}
                onChange={(e) => {
                  // Only allow numeric characters
                  const numericValue = e.target.value.replace(/\D/g, "");
                  setAnswers({
                    ...answers,
                    phoneNumber: numericValue?.toString(),
                  });
                  // Reset verification state when phone number changes
                  setVerified(false);
                  setVerificationCode("");
                  setVerifionError("");
                }}
                className="text-center md:w-[250px] mx-auto placeholder:text-zinc-300"
              />
              {answers.phoneNumber.length === 10 && !verified && (
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isLoading}
                    onClick={() =>
                      handleSendPhoneVerification(answers.phoneNumber)
                    }
                    className=""
                  >
                    Send Verification Code
                    {isLoading && (
                      <Loader2Icon className="w-4 h-4 ml-2 animate-spin" />
                    )}
                  </Button>

                  {verificationSent && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="verificationCode"
                        className="text-center block text-sm"
                      >
                        Enter 6-digit verification code
                      </Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={verificationCode}
                          onChange={(value) => {
                            setVerificationCode(value);
                            if (value.length === 6) {
                              handleVerification(value);
                            }
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      {verifionError && (
                        <p className="text-sm text-red-500 text-center">
                          {verifionError}
                        </p>
                      )}
                      {verified && (
                        <p className="text-sm text-green-500 bg-green-500/10 p-2 rounded-md text-center">
                          ✓ Phone number verified!
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    {verifionError && (
                      <p className="text-sm text-red-500 bg-red-400/10 p-2 rounded-md text-center">
                        {verifionError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "reminder-type",
      title: "What kind of stuff do you forget? 🤔",
      subtitle: "We promise not to judge your life choices",
      content: (
        <RadioGroup
          value={answers.reminderType}
          onValueChange={(value) =>
            setAnswers({ ...answers, reminderType: value })
          }
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="work" id="work" />
            <Label htmlFor="work" className="flex-1 cursor-pointer">
              <div className="font-medium">Work stuff 💼</div>
              <div className="text-sm text-muted-foreground">
                Meetings, deadlines, pretending to look busy
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="personal" id="personal" />
            <Label htmlFor="personal" className="flex-1 cursor-pointer">
              <div className="font-medium">Personal life 🏠</div>
              <div className="text-sm text-muted-foreground">
                Birthdays, appointments, watering that dying plant
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="habits" id="habits" />
            <Label htmlFor="habits" className="flex-1 cursor-pointer">
              <div className="font-medium">Daily habits 🎯</div>
              <div className="text-sm text-muted-foreground">
                Exercise, meditation, remembering to eat vegetables
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="everything" id="everything" />
            <Label htmlFor="everything" className="flex-1 cursor-pointer">
              <div className="font-medium">Literally everything 🤯</div>
              <div className="text-sm text-muted-foreground">
                My brain is basically a sieve at this point
              </div>
            </Label>
          </div>
        </RadioGroup>
      ),
    },
    {
      id: "notification-preference",
      title: "How should we poke you? 📱",
      subtitle: "Choose your notification fighting style",
      content: (
        <RadioGroup
          value={answers.notificationPreference}
          onValueChange={(value) =>
            setAnswers({ ...answers, notificationPreference: value })
          }
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="sms" id="sms" />
            <Label htmlFor="sms" className="flex-1 cursor-pointer">
              <div className="font-medium">SMS Kung Fu 📱</div>
              <div className="text-sm text-muted-foreground">
                Text messages that cut through the noise
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email" className="flex-1 cursor-pointer">
              <div className="font-medium">Email Aikido 📧</div>
              <div className="text-sm text-muted-foreground">
                Gentle inbox nudges with style
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both" className="flex-1 cursor-pointer">
              <div className="font-medium">Double Dragon Style 🐉</div>
              <div className="text-sm text-muted-foreground">
                All of them! SMS, email, and calls - maximum reminder power!
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="surprise" id="surprise" />
            <Label htmlFor="surprise" className="flex-1 cursor-pointer">
              <div className="font-medium">Surprise me! 🎲</div>
              <div className="text-sm text-muted-foreground">
                Keep me on my toes with random delivery methods
              </div>
            </Label>
          </div>
        </RadioGroup>
      ),
    },
    {
      id: "forgetfulness",
      title: "On a scale of goldfish to elephant... 🐠🐘",
      subtitle: "How's your memory game?",
      content: (
        <RadioGroup
          value={answers.forgetfulness}
          onValueChange={(value) =>
            setAnswers({ ...answers, forgetfulness: value })
          }
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="elephant" id="elephant" />
            <Label htmlFor="elephant" className="flex-1 cursor-pointer">
              <div className="font-medium">Elephant level 🐘</div>
              <div className="text-sm text-muted-foreground">
                I remember everything... maybe too much
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="human" id="human" />
            <Label htmlFor="human" className="flex-1 cursor-pointer">
              <div className="font-medium">Normal human 🧠</div>
              <div className="text-sm text-muted-foreground">
                I forget some things, remember others
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="squirrel" id="squirrel" />
            <Label htmlFor="squirrel" className="flex-1 cursor-pointer">
              <div className="font-medium">Squirrel brain 🐿️</div>
              <div className="text-sm text-muted-foreground">
                Ooh, shiny! Wait, what were we talking about?
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="goldfish" id="goldfish" />
            <Label htmlFor="goldfish" className="flex-1 cursor-pointer">
              <div className="font-medium">Goldfish status 🐠</div>
              <div className="text-sm text-muted-foreground">
                I forget things while I'm still doing them
              </div>
            </Label>
          </div>
        </RadioGroup>
      ),
    },
    {
      id: "source",
      title: "How did you find us? 🕵️",
      subtitle: "Help us thank whoever sent you our way!",
      content: (
        <RadioGroup
          value={answers.hearAbout}
          onValueChange={(value) =>
            setAnswers({ ...answers, hearAbout: value })
          }
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="google" id="google" />
            <Label htmlFor="google" className="flex-1 cursor-pointer">
              <div className="font-medium">Google search 🔍</div>
              <div className="text-sm text-muted-foreground">
                The all-knowing algorithm led me here
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="social" id="social" />
            <Label htmlFor="social" className="flex-1 cursor-pointer">
              <div className="font-medium">Social media 📱</div>
              <div className="text-sm text-muted-foreground">
                Saw it on the socials while procrastinating
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="friend" id="friend" />
            <Label htmlFor="friend" className="flex-1 cursor-pointer">
              <div className="font-medium">Friend recommendation 👥</div>
              <div className="text-sm text-muted-foreground">
                A wise friend shared the Notifoo wisdom
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="ad" id="ad" />
            <Label htmlFor="ad" className="flex-1 cursor-pointer">
              <div className="font-medium">Advertisement 📺</div>
              <div className="text-sm text-muted-foreground">
                Your ad actually worked on me
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other" className="flex-1 cursor-pointer">
              <div className="font-medium">Other/Magic ✨</div>
              <div className="text-sm text-muted-foreground">
                It's complicated or I honestly can't remember
              </div>
            </Label>
          </div>
        </RadioGroup>
      ),
    },
    {
      id: "free-trial",
      title: "Try Us for Free!",
      subtitle: "Here's exactly how your 7-day free trial works",
      content: (
        <div className="space-y-4">
          {/* Compact Timeline */}
          <div className="relative max-w-lg mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-orange-500"></div>

            <div className="space-y-2">
              {/* Today - Signup */}
              <div className="flex items-center gap-3">
                <div className="relative z-10 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow">
                  0
                </div>
                <div className="flex-1 flex justify-between items-center bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded border border-green-200 dark:border-green-800">
                  <div>
                    <div className="font-medium text-sm text-green-700 dark:text-green-400">
                      Today - Start Your Free Trial!
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Start immediately
                    </div>
                  </div>
                  <div className="text-sm font-bold text-green-600">FREE</div>
                </div>
              </div>

              {/* Days 1-6 */}
              {[1, 2, 3, 4, 5, 6].map((day) => (
                <div key={day} className="flex items-center gap-3">
                  <div className="relative z-10 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow">
                    {day}
                  </div>
                  <div className="flex-1 flex justify-between items-center bg-blue-50 dark:bg-blue-950/20 px-3 py-2 rounded border border-blue-200 dark:border-blue-800">
                    <div>
                      <div className="font-medium text-sm text-blue-700 dark:text-blue-400">
                        Day {day}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Full access
                      </div>
                    </div>
                    <div className="text-sm font-bold text-blue-600">FREE</div>
                  </div>
                </div>
              ))}

              {/* Day 7 - Payment */}
              <div className="flex items-center gap-3">
                <div className="relative z-10 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow">
                  7
                </div>
                <div className="flex-1 flex justify-between items-center bg-orange-50 dark:bg-orange-950/20 px-3 py-2 rounded border-2 border-orange-400">
                  <div>
                    <div className="font-medium text-sm text-orange-700 dark:text-orange-400">
                      Day 7 - Billing Starts
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Subscription begins
                    </div>
                  </div>
                  <div className="text-sm font-bold text-orange-600">
                    $9.99{isMonthly ? "/mo" : "/yr"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Summary */}
          <div className="text-center py-2 px-4 bg-accent/30 rounded text-sm">
            <span className="font-medium">✨ 7 days free</span> •{" "}
            <span className="text-muted-foreground">Cancel anytime</span>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    track("onboarding_next_slide", {
      location: "onboarding_client",
      email: user.email,
      currentSlide: currentSlide,
    });
    if (currentSlide === slides.length - 1) {
      onConnectStripe();
    }

    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }

    return;
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const canProceed = () => {
    const slide = slides[currentSlide];
    switch (slide.id) {
      case "welcome":
        return answers.phoneNumber.trim().length > 0 && verified;
      case "reminder-type":
        return answers.reminderType !== "";
      case "notification-preference":
        return answers.notificationPreference !== "";
      case "forgetfulness":
        return answers.forgetfulness !== "";
      case "source":
        return answers.hearAbout !== "";
      default:
        return true;
    }
  };

  const currentSlideData = slides[currentSlide];

  const onConnectStripe = async () => {
    try {
      trackEvent("user_onboarded", {
        userId: user.id,
        location: "onboarding_client",
      });
      const res = await fetch("/api/stripe/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: answers.phoneNumber,
          reminderType: answers.reminderType,
          notificationPreference: answers.notificationPreference,
          forgetfulness: answers.forgetfulness,
          hearAbout: answers.hearAbout,
          isMonthly: isMonthly,
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await res.json();
      if (data.url) {
        track("onboarding_connect_stripe_success", {
          location: "onboarding_client",
          email: user.email,
        });
        window.location.href = data.url;
      } else {
        track("onboarding_connect_stripe_error", {
          location: "onboarding_client",
          email: user.email,
          error: "Onboarding Stripe failed. Please try again later.",
        });
        toast.error("Onboarding Stripe failed. Please try again later.");
        setError("Onboarding Stripe failed. Please try again later.");
      }
    } catch (error) {
      track("onboarding_connect_stripe_error_error", {
        location: "onboarding_client",
        email: user.email,
        error: error as string,
      });
      console.error("Onboarding Stripe error:", error);
      toast.error("Onboarding Stripe failed. Please try again later.");
      setError("Onboarding Stripe failed. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col justify-between p-8 h-full min-h-[680px] md:h-[750px]">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Step {currentSlide + 1} of {slides.length}
              </span>
              <span>
                {Math.round(((currentSlide + 1) / slides.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-accent rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${((currentSlide + 1) / slides.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Slide content */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-balance text-zinc-600">
              {currentSlideData.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {currentSlideData.subtitle}
            </p>
          </div>

          <div className="mb-8">{currentSlideData.content}</div>

          {/* Navigation */}
          <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
            <div className="flex gap-2 md:hidden">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-primary" : "bg-accent"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 bg-transparent w-[250px]"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="md:flex gap-2 hidden">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-primary" : "bg-accent"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              disabled={!canProceed()}
              className="flex items-center gap-2 w-[250px]"
            >
              {currentSlide === slides.length - 1 ? (
                <>
                  Start Free Trial
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="text-red-500 text-center p-2 rounded-md bg-red-500/10">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
