"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState({
    reminderType: "",
    notificationPreference: "",
    forgetfulness: "",
    hearAbout: "",
    name: "",
  });

  const slides = [
    {
      id: "welcome",
      title: "Welcome to the Notifoo Dojo! 🥋",
      subtitle: "Time to master the ancient art of remembering stuff",
      content: (
        <div className="space-y-6 text-center">
          <div className="text-6xl">🔔</div>
          <p className="text-lg text-muted-foreground">
            We're about to ask you a few questions to customize your reminder
            experience. Don't worry, this is way more fun than filling out tax
            forms!
          </p>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-left block">
              What should we call you, future Reminder Master?
            </Label>
            <Input
              id="name"
              placeholder="Enter your name (or superhero alias)"
              value={answers.name}
              onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
              className="text-center"
            />
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
                Both SMS and email - maximum reminder power!
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
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Handle completion - could redirect to dashboard or show success
      console.log("Onboarding complete!", answers);
    }
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
        return answers.name.trim().length > 0;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
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
            <h1 className="text-3xl font-bold mb-2 text-balance">
              {currentSlideData.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {currentSlideData.subtitle}
            </p>
          </div>

          <div className="mb-8">{currentSlideData.content}</div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex gap-2">
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
              className="flex items-center gap-2"
            >
              {currentSlide === slides.length - 1 ? (
                <>
                  Complete Setup
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
