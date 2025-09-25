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
import { useSession } from "@/lib/auth-client";

import Link from "next/link";
import Logo from "@/public/logo.png";
import Image from "next/image";
import NavHeader from "../navigation/NavHeader";
export default function LandComp() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <NavHeader />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            We get Remembering stuff
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-balance mb-6 text-zinc-600">
            Just getting that reminder alert 4 days later?
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto text-zinc-600">
            We get it. It's annoying. That's why we're here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {!session?.user && (
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-[#3b82f6] hover:bg-[#3b82f6]/90"
                >
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
      <section
        id="features"
        className="py-20 px-4 bg-gradient-to-br from-blue-50/50 via-background to-purple-50/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl py-2 font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Why Notifoo is the Real MVP
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've mastered the ancient art of "not forgetting stuff" so you
              don't have to.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-blue-500/25">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  SMS Superpowers
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Get text messages that pack a punch. Your phone will buzz with
                  the power of a thousand reminders.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-blue-500/25">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Inbox Champion
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Inbox notifications so smooth, they'll make your other emails
                  jealous. Delivered faster than you can say "Notifoo!"
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-purple-500/25">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  The Nuclear Option
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  We will literally call you - when your brain treats text
                  messages like spam and emails like suggestions, we bring out
                  the big guns: that ancient technology called 'talking on the
                  phone.'
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-green-500/25">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Time Bending
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Set reminders for any time, any day. We'll remember so you
                  don't have to strain your brain muscles.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-yellow-500/25">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Lightning Setup
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Get started faster than you can forget why you opened the app.
                  Seriously, it's that quick.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-indigo-500/25">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Team Reminders
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
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
              <Button
                size="lg"
                className="text-lg px-12 py-6 bg-[#3b82f6] hover:bg-[#3b82f6]/90"
              >
                <Bell className="mr-2 h-5 w-5" />
                Start Your Free Trial Now
              </Button>
            </Link>
          )}
          <p className="text-sm text-muted-foreground mt-4 text-zinc-600    ">
            Cancel anytime. But you probably won't want to.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src={Logo} alt="Notifoo" width={100} height={100} />
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
                    href="/pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/use-cases"
                    className="hover:text-foreground transition-colors"
                  >
                    Use Cases
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground text-zinc-600">
                <li>
                  <a
                    href="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
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
                    href="/faq"
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
