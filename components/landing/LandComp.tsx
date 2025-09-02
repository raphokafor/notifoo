"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Clock,
  Mail,
  MessageSquare,
  Smartphone,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function LandComp() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Notifoo</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Reviews
            </a>
            {session?.user ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Master the Art of Remembering
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-balance mb-6 text-zinc-600">
            Never Forget Again with{" "}
            <span className="text-primary">Notifoo!</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto text-zinc-600">
            Channel your inner reminder ninja! Set it, forget it, then get
            notified exactly when you need it. SMS, email, or carrier pigeon* -
            we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {!session?.user && (
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Your Free Trial
                </Button>
              </Link>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-zinc-600">
            *Carrier pigeon service coming soon. Maybe.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-zinc-600">
              Why Notifoo is the Real MVP
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-zinc-600">
              We've mastered the ancient art of "not forgetting stuff" so you
              don't have to.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">SMS Kung Fu</CardTitle>
                <CardDescription>
                  Get text messages that pack a punch. Your phone will buzz with
                  the power of a thousand reminders.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Mail className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">Email Mastery</CardTitle>
                <CardDescription>
                  Inbox notifications so smooth, they'll make your other emails
                  jealous. Delivered faster than you can say "Notifoo!"
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">Time Bending</CardTitle>
                <CardDescription>
                  Set reminders for any time, any day. We'll remember so you
                  don't have to strain your brain muscles.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">Mobile Mojo</CardTitle>
                <CardDescription>
                  Works on all devices because forgetting stuff is a universal
                  human experience. We're here for everyone.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">Lightning Setup</CardTitle>
                <CardDescription>
                  Get started faster than you can forget why you opened the app.
                  Seriously, it's that quick.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-zinc-600">Team Reminders</CardTitle>
                <CardDescription>
                  Share the reminder love with your team. Because forgetting
                  together is better than forgetting alone.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-zinc-600">
              How the Magic Happens
            </h2>
            <p className="text-xl text-muted-foreground text-zinc-600">
              Three simple steps to reminder enlightenment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-600">
                Sign Up & Set
              </h3>
              <p className="text-muted-foreground text-zinc-600">
                Create your account and set your first reminder. Choose your
                notification style: SMS or email.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Relax & Forget</h3>
              <p className="text-muted-foreground text-zinc-600">
                Go about your day with peace of mind. We've got your back (and
                your memory).
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Notified</h3>
              <p className="text-muted-foreground text-zinc-600">
                Receive your reminder exactly when you need it. Feel like a
                productivity superhero!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-zinc-600">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground text-zinc-600">
              Real people, real reminders, real results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                      fill="yellow"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 text-zinc-600">
                  "I used to forget my anniversary every year. Now my wife
                  thinks I'm the most thoughtful husband ever. Thanks Notifoo!"
                </p>
                <div className="font-semibold">- Mike, Saved Marriage</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 text-zinc-600">
                  "My plants are finally alive! Notifoo reminds me to water
                  them. It's like having a green thumb, but digital."
                </p>
                <div className="font-semibold">- Sarah, Plant Parent</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 text-zinc-600">
                  "I set a reminder to cancel my free trial of another app.
                  Ironically, I forgot to cancel Notifoo because I love it!"
                </p>
                <div className="font-semibold">- Alex, Happy Customer</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-4 text-zinc-600">
            Ready to Master Your Memory?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-zinc-600">
            Join thousands of people who've already achieved reminder
            enlightenment. Your future self will thank you (and we'll remind you
            to thank yourself).
          </p>
          {!session?.user && (
            <Link href="/signup">
              <Button size="lg" className="text-lg px-12 py-6">
                <Bell className="mr-2 h-5 w-5" />
                Start Your Free Trial Now
              </Button>
            </Link>
          )}
          <p className="text-sm text-muted-foreground mt-4 text-zinc-600    ">
            No credit card required. Cancel anytime. But you probably won't want
            to.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bell className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Notifoo</span>
              </div>
              <p className="text-muted-foreground text-zinc-600">
                The reminder app that actually remembers so you don't have to.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground text-zinc-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground text-zinc-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Notifoo. All rights reserved.
              We'll remind you to check back later.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
