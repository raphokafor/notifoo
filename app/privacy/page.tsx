import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Lock, Mail, MessageSquare, Shield } from "lucide-react";
import NavHeader from "@/components/navigation/NavHeader";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NavHeader />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground text-balance">
            We protect your data like a ninja protects their secret techniques.
            Seriously though, your privacy matters to us.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: December 2024
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                What We Collect (The Good Stuff)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We only collect what we need to make Notifoo work its reminder
                magic:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Information:</strong> Your email address and
                  password (encrypted tighter than a ninja's grip)
                </li>
                <li>
                  <strong>Contact Details:</strong> Phone number for SMS
                  reminders (we won't spam you, promise)
                </li>
                <li>
                  <strong>Reminder Data:</strong> The actual reminders you set
                  (we need to know what to remind you about!)
                </li>
                <li>
                  <strong>Usage Analytics:</strong> How you use the app (to make
                  it even more awesome)
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                How We Protect Your Data (Fort Knox Style)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Your data security is our dojo discipline:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Encryption:</strong> All data is encrypted in transit
                  and at rest
                </li>
                <li>
                  <strong>Secure Servers:</strong> Hosted on industry-leading
                  cloud infrastructure
                </li>
                <li>
                  <strong>Access Controls:</strong> Only authorized team members
                  can access systems
                </li>
                <li>
                  <strong>Regular Audits:</strong> We regularly review and
                  update our security practices
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Send you the reminders you've set up (that's literally our
                  job)
                </li>
                <li>Improve our service and add new features</li>
                <li>Provide customer support when you need help</li>
                <li>Send important account and service updates</li>
                <li>
                  Comply with legal requirements (the boring but necessary
                  stuff)
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We will NEVER sell your personal information to third parties.
                That's not cool, and we're all about being cool.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We work with trusted partners to deliver our services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>SMS Providers:</strong> To send your text message
                  reminders
                </li>
                <li>
                  <strong>Email Services:</strong> To deliver email
                  notifications
                </li>
                <li>
                  <strong>Analytics Tools:</strong> To understand how to improve
                  Notifoo
                </li>
                <li>
                  <strong>Payment Processors:</strong> To handle subscriptions
                  securely
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                All our partners are required to maintain the same high
                standards of data protection that we do.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights (You're in Control)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                To exercise any of these rights, just contact us. We'll handle
                it faster than you can say "Notifoo!"
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Questions about this privacy policy? We're here to help!</p>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
