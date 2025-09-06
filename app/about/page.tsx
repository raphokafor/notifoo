import NavHeader from "@/components/navigation/NavHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  Brain,
  Calendar,
  Clock,
  Coffee,
  Globe,
  Heart,
  Lightbulb,
  Mail,
  MessageSquare,
  Repeat,
  Shield,
  Smartphone,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Feature Deep Dive
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black text-balance mb-6 text-zinc-600">
            Why <span className="text-[#3b82f6]">Notifoo</span> is the Real MVP
          </h1>
          <p className="text-2xl text-muted-foreground text-balance max-w-3xl mx-auto text-zinc-600">
            Ever thought to yourself, this reminder app on my phone sucks?
          </p>
          <p className="text-sm text-muted-foreground text-balance mb-8 max-w-3xl mx-auto text-zinc-600">
            We've mastered the ancient art of "not forgetting stuff" so you
            don't have to.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-zinc-600">
              Core Superpowers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-zinc-600">
              The foundation of your newfound remembering abilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">SMS Kung Fu</CardTitle>
                <CardDescription>
                  Get text messages that pack a punch. Your phone will buzz with
                  the power of a thousand reminders. No more "I'll just remember
                  that" lies to yourself.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
              <CardHeader>
                <Mail className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">Email Mastery</CardTitle>
                <CardDescription>
                  Inbox notifications so smooth, they'll make your other emails
                  jealous. Delivered faster than you can say "Notifoo!" and with
                  subject lines that actually matter.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">Phone Reaching</CardTitle>
                <CardDescription>
                  We will literally call you to remind you! When SMS and email
                  fail to penetrate your fortress of forgetfulness, we deploy
                  the nuclear option: an actual phone call. Our Memory Warriors
                  will dial your digits and personally ensure your brain
                  receives the memo. It's like having a very persistent friend,
                  but one you actually pay for.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">Time Bending</CardTitle>
                <CardDescription>
                  Set reminders for any time, any day, any year (within reason).
                  We'll remember so you don't have to strain your already
                  overworked brain muscles.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">Lightning Setup</CardTitle>
                <CardDescription>
                  Get started faster than you can forget why you opened the app.
                  Seriously, it's that quick. No PhD in reminder science
                  required.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">Team Reminders</CardTitle>
                <CardDescription>
                  Share the reminder love with your team. Because forgetting
                  together is better than forgetting alone. Group accountability
                  meets digital nagging. (coming soon?)
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-zinc-600">
              Reportedly Advanced Brain Enhancers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-zinc-600">
              For when basic remembering isn't enough
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Repeat className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">
                  Recurring Reminders
                </CardTitle>
                <CardDescription>
                  Set it once, forget about setting it again. Perfect for those
                  "Oh, it's Monday already?" moments. Daily, weekly, monthly, or
                  whenever Mercury is in retrograde.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">
                  Global Time Zones
                </CardTitle>
                <CardDescription>
                  Jet lag can't defeat our reminders. Whether you're in Tokyo or
                  Timbuktu, we'll find you and remind you (in the least creepy
                  way possible).
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">
                  Multi-Channel Notifications
                </CardTitle>
                <CardDescription>
                  If your phone dies, we'll email you. If your email crashes,
                  we'll text you. We're like that friend who won't let you
                  forget... anything.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Quirky Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-zinc-600">
              The Fun Stuff To come
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-zinc-600">
              Because life's too short for boring reminders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Coffee className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">
                  Snooze Protection
                </CardTitle>
                <CardDescription>
                  We know you'll hit snooze. That's why we'll remind you about
                  hitting snooze. It's like inception, but for procrastination.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">
                  Motivational Messages
                </CardTitle>
                <CardDescription>
                  Random encouragement sprinkled into your reminders. "Don't
                  forget to file your taxes... You've got this, champion!"
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Lightbulb className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">Context Clues</CardTitle>
                <CardDescription>
                  "Remember when you set this reminder? You were wearing that
                  blue shirt and feeling optimistic." Okay, we don't actually
                  track your clothes, but we do remember the important stuff.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It All Works Together */}
      {/* <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-zinc-600">
              The Symphony of Remembering
            </h2>
            <p className="text-xl text-muted-foreground text-zinc-600">
              How all these features work together to save your sanity
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-600">
                    Set Your Reminder
                  </h3>
                  <p className="text-muted-foreground text-zinc-600">
                    Tell us what, when, and how urgently you need to remember
                    it. Our smart system immediately starts plotting your
                    success.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-600">
                    AI Processing Magic
                  </h3>
                  <p className="text-muted-foreground text-zinc-600">
                    Our algorithms analyze your patterns, optimize timing, and
                    prepare the perfect notification that'll actually get your
                    attention.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-600">
                    Multi-Channel Delivery
                  </h3>
                  <p className="text-muted-foreground text-zinc-600">
                    We hit you with the reminder via your preferred method(s).
                    SMS, email, or both – because redundancy is your friend.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-600">
                    Smart Follow-up
                  </h3>
                  <p className="text-muted-foreground text-zinc-600">
                    If you don't acknowledge the reminder, we'll try again
                    (because we care). But not so much that we become
                    annoying... we hope.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-600">
                    Learning & Adapting
                  </h3>
                  <p className="text-muted-foreground text-zinc-600">
                    We learn from your behavior and get better at reminding you.
                    It's like having a personal assistant who actually pays
                    attention.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  6
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-zinc-600">
                    Mission Accomplished
                  </h3>
                  <p className="text-muted-foreground text-zinc-600">
                    You remember the thing! Victory dance optional but
                    encouraged. Your productivity levels officially reach
                    superhero status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-4 text-zinc-600">
            Ready to Upgrade Your Memory?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-zinc-600">
            Stop living in fear of forgetting important stuff. Join the
            thousands of people who've already achieved reminder enlightenment.
            Your future self will send you a thank-you card (and we'll remind
            you to read it).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-[#3b82f6] hover:bg-[#3b82f6]/90"
              >
                <Bell className="mr-2 h-5 w-5" />
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Pricing
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-4 text-zinc-600">
            No credit card required. Cancel anytime. But you probably won't want
            to. (We'll remind you if you try to cancel... just kidding!)
          </p>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
