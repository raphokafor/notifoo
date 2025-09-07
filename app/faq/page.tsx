import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, Bell, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import NavHeader from "@/components/navigation/NavHeader";

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <NavHeader />

      <div className="container mx-auto px-4 pb-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
              Help Center
            </h1>
          </div>
          <p className="text-xl text-gray-600 text-balance">
            All your burning questions about not forgetting stuff, answered with
            our signature blend of helpfulness and mild sarcasm
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Getting Started
              </CardTitle>
              <CardDescription>
                The basics of joining the ranks of the organizationally
                enlightened
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is-notifoo">
                  <AccordionTrigger>
                    What exactly is Notifoo, and why should I trust you with my
                    memory?
                  </AccordionTrigger>
                  <AccordionContent>
                    Notifoo is a reminder application that actually works –
                    shocking, we know. We're like that reliable friend who
                    remembers your birthday, except we won't judge you for
                    forgetting theirs. We send reminders via SMS, email, and
                    phone calls because your brain clearly needs backup systems.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="how-it-works">
                  <AccordionTrigger>
                    How does this magical memory enhancement work?
                  </AccordionTrigger>
                  <AccordionContent>
                    It's surprisingly simple: You tell us what to remind you
                    about and when. We store that information with the
                    dedication of a digital elephant. When the time comes, we
                    unleash our notification arsenal (SMS, email, or phone
                    calls) to ensure your brain gets the memo. Think of us as
                    your personal memory backup drive, but with more
                    personality.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="getting-started">
                  <AccordionTrigger>
                    I'm ready to stop being a forgetful mess. Where do I start?
                  </AccordionTrigger>
                  <AccordionContent>
                    First, congratulations on acknowledging you need help –
                    that's the first step to memory recovery. Simply{" "}
                    <span className="text-blue-500 font-bold">
                      <Link href="/signup">SIGN UP</Link>, &nbsp;
                    </span>
                    then go through our delightfully entertaining onboarding
                    process, and start setting reminders. We'll guide you
                    through everything, including how to stop your phone from
                    treating our notifications like spam.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Features & Functionality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Features & Functionality (The Good Stuff)
              </CardTitle>
              <CardDescription>
                What makes us different from that reminder app you've been
                ignoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="notification-types">
                  <AccordionTrigger>
                    What types of notifications do you send? Please tell me
                    you're more persistent than my current app.
                  </AccordionTrigger>
                  <AccordionContent>
                    We offer the holy trinity of notifications: SMS (for when
                    you're pretending to work), email (for when you're actually
                    working), and phone calls (for scenarios when you've
                    potentiallyignored the first two). Our premium-pro(coming
                    soon) users even get the "human caller" option – yes, a real
                    person will call to remind you, because sometimes you need
                    that level of intervention.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reminder-types">
                  <AccordionTrigger>
                    What kinds of things can I set reminders for?
                  </AccordionTrigger>
                  <AccordionContent>
                    Literally anything your forgetful heart desires.
                    Appointments, medications, birthdays, watering plants,
                    calling your mom, paying bills, links to any website or that
                    weird recurring dream about becoming a professional yodeler.
                    We don't judge – we just remind. Our system handles one-time
                    reminders and recurring reminders for when you need to
                    remember something at a specific time.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="customization">
                  <AccordionTrigger>
                    Can I customize how and when I get reminded?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can set custom notification preferences. You can choose
                    between SMS, email, or even a phone call, all with the
                    ability to make it recurring.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Pricing & Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-blue-600">💰</span>
                Pricing & Plans (The Money Talk)
              </CardTitle>
              <CardDescription>
                Because even memory enhancement has a price tag
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="free-plan">
                  <AccordionTrigger>
                    Is there a free plan, or do I have to pay to remember
                    things?
                  </AccordionTrigger>
                  <AccordionContent>
                    We offer a way for you to use notifoo at full functionality
                    for free for 7 days. No commitments and you can cancel
                    anytime.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="paid-plans">
                  <AccordionTrigger>
                    After the Free Trial period, what happens?
                  </AccordionTrigger>
                  <AccordionContent>
                    Your subscription will automatically renew at the end of the
                    free trial period. You can cancel anytime before the renewal
                    date or after the free trial period.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cancel-anytime">
                  <AccordionTrigger>
                    Can I cancel anytime, or are you going to make it harder
                    than canceling a gym membership?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can cancel anytime with just a few clicks – no phone
                    calls, no guilt trips, no "are you sure you want to return
                    to your forgetful ways?" We believe in making it as easy to
                    leave as it is to stay. Though we'll miss you and your
                    delightfully chaotic reminder schedule.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Technical & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-blue-600">🔧</span>
                Technical & Support (When Things Go Wrong)
              </CardTitle>
              <CardDescription>
                Because even the best memory apps occasionally have senior
                moments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="reliability">
                  <AccordionTrigger>
                    How reliable are your reminders? I can't afford to miss my
                    dentist appointment again.
                  </AccordionTrigger>
                  <AccordionContent>
                    Our reminder service is more reliable than your memory, your
                    phone's battery, and most of your friends' promises to call
                    you back. We use multiple backup systems and redundancies
                    because we take your forgetfulness seriously. If we somehow
                    fail to remind you, we'll probably send you an apology
                    reminder about missing your original reminder.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="support">
                  <AccordionTrigger>
                    What if I need help? Please don't make me talk to a chatbot
                    named Chad.
                  </AccordionTrigger>
                  <AccordionContent>
                    Our support team consists of actual humans who understand
                    the struggle of forgetting where you put your keys while
                    holding them. You can reach us via email or our contact
                    form. We promise no chatbots named Chad, though we can't
                    guarantee our team members don't have equally questionable
                    names.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="data-security">
                  <AccordionTrigger className="text-left">
                    Is my data secure? I don't want my reminder about buying
                    embarrassing products to end up on the internet.
                  </AccordionTrigger>
                  <AccordionContent>
                    Your data is encrypted, secured, and treated with the same
                    confidentiality as a therapist's notes. We don't sell your
                    information, judge your reminder choices, or share your
                    embarrassing shopping lists with anyone. Your secret shame
                    about forgetting to buy toilet paper is safe with us.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6 text-balance">
              Our support team is standing by, ready to answer your questions
              with the perfect blend of helpfulness and gentle mockery of your
              forgetful ways.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Support
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg">
                  Start Your Memory Journey
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
