import {
  Bell,
  Calendar,
  Heart,
  Briefcase,
  Users,
  DollarSign,
  GraduationCap,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NavHeader from "@/components/navigation/NavHeader";
import Image from "next/image";
import Logo from "@/public/logo.png";

export default function UseCasesPage() {
  const useCases = [
    {
      icon: Calendar,
      title: "Personal Life Mastery",
      subtitle: "For the Everyday Memory Champion",
      examples: [
        "Doctor appointments (because WebMD isn't a substitute for actual healthcare)",
        "Medication reminders (your liver will thank you for consistency)",
        "Birthday calls to your mom (avoid the guilt trip, embrace the love)",
        "Car maintenance (before your engine starts speaking in tongues)",
        "Gym sessions (your New Year's resolution deserves a fighting chance)",
      ],
      testimonial:
        "I went from forgetting my own birthday to remembering everyone else's. My social credit score has never been higher!",
    },
    {
      icon: Briefcase,
      title: "Professional Productivity Dojo",
      subtitle: "For the Corporate Memory Wizard",
      examples: [
        "Meeting prep (show up knowing what you're supposed to discuss)",
        "Follow-up emails (because 'I'll get back to you' shouldn't be famous last words)",
        "Deadline tracking (panic is not a project management strategy)",
        "Client check-ins (relationship maintenance without the awkward silence)",
        "Performance review prep (document your wins before you forget them)",
      ],
      testimonial:
        "My boss thinks I've developed superhuman organizational skills. Little does she know I just outsourced my memory to Notifoo.",
    },
    {
      icon: Heart,
      title: "Health & Wellness Sensei",
      subtitle: "For the Self-Care Samurai",
      examples: [
        "Water intake reminders (your kidneys are not camels)",
        "Workout schedules (consistency beats intensity, grasshopper)",
        "Mental health check-ins (your brain needs maintenance too)",
        "Supplement schedules (expensive urine is not the goal)",
        "Sleep routine reminders (your phone should sleep before you do)",
      ],
      testimonial:
        "Notifoo helped me remember to take care of myself. Turns out, I'm worth remembering!",
    },
    {
      icon: Users,
      title: "Social Connection Master",
      subtitle: "For the Relationship Guru",
      examples: [
        "Anniversary reminders (flowers are cheaper than couples therapy)",
        "Friend check-ins (because 'we should hang out soon' needs a deadline)",
        "Thank you notes (gratitude with a timestamp)",
        "Social event prep (show up with the right gift, not empty-handed confusion)",
        "Family calls (maintain your favorite child status)",
      ],
      testimonial:
        "My friends think I've become incredibly thoughtful. Really, I just got better at remembering to be human.",
    },
    {
      icon: DollarSign,
      title: "Financial Discipline Dojo",
      subtitle: "For the Money Management Champion",
      examples: [
        "Bill payment reminders (late fees are not a budgeting strategy)",
        "Investment reviews (your portfolio needs attention, not neglect)",
        "Subscription audits (that streaming service you forgot about is still charging you)",
        "Budget check-ins (awareness is the first step to financial enlightenment)",
        "Tax document gathering (April 15th waits for no one)",
      ],
      testimonial:
        "I saved more money in late fees than I spend on Notifoo. My accountant is impressed, my wallet is grateful.",
    },
    {
      icon: GraduationCap,
      title: "Learning & Growth Sensei",
      subtitle: "For the Knowledge Acquisition Wizard",
      examples: [
        "Study session reminders (cramming is not a learning strategy)",
        "Course deadlines (procrastination is not a time management technique)",
        "Skill practice schedules (mastery requires consistency, not miracles)",
        "Reading goals (those books won't read themselves)",
        "Language practice (fluency comes from repetition, not wishful thinking)",
      ],
      testimonial:
        "I finally finished that online course I started three years ago. My certificate of completion is basically a trophy for remembering.",
    },
    {
      icon: Home,
      title: "Household Management Master",
      subtitle: "For the Domestic Duty Champion",
      examples: [
        "Cleaning schedules (dust bunnies are not pets)",
        "Plant watering (your green friends deserve to live)",
        "Appliance maintenance (preventive care beats emergency repairs)",
        "Grocery shopping (meal planning requires actual planning)",
        "Home security checks (peace of mind has a checklist)",
      ],
      testimonial:
        "My house went from 'lived-in' to 'actually livable.' My plants are no longer in witness protection.",
    },
  ];

  return (
    <div className="min-h-screen  text-zinc-600">
      {/* Header */}
      <NavHeader />

      {/* Use Cases Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-600 mb-4">
              Many different paths to enlightment
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Whether you're a deadline-dodging professional, a goldfish-memory
              domestic deity, or a scattered student whose brain has mastered
              the art of selective amnesia, there's a Notifoo use case tailored
              to your particular brand of beautiful chaos.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <useCase.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {useCase.title}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {useCase.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Perfect for reminding you about:
                  </h4>
                  <ul className="space-y-2">
                    {useCase.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-gray-700 italic">
                    "{useCase.testimonial}"
                  </p>
                  <p className="text-blue-600 font-medium mt-2">
                    - Reformed Forgetful Human
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Stop Being Your Own Worst Enemy?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of reformed forgetfuls who've discovered the ancient
            art of Actually Remembering Stuff. Your future self will thank you
            (and maybe remember to buy you pizza).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Link href="/onboarding">Start Your Memory Transformation</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/contact">Talk to a Memory Sensei</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src={Logo} alt="Notifoo" width={32} height={32} />
                <span className="text-xl font-bold">Notifoo</span>
              </div>
              <p className="text-gray-400">
                The reminder app that you will love to use.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/use-cases"
                    className="hover:text-white transition-colors"
                  >
                    Use Cases
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Notifoo. All rights reserved. No
              memories were harmed in the making of this app.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
