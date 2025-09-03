import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  FileText,
  Users,
  CreditCard,
  AlertTriangle,
  Scale,
} from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Bell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Notifoo</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground text-balance">
            The rules of the Notifoo dojo. Don't worry, they're pretty
            reasonable (and we tried to make them fun to read).
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: December 2024
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Welcome to the Notifoo Family
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By using Notifoo, you're agreeing to these terms. Think of it as
                joining our reminder dojo - we're all here to help each other
                remember important stuff and not forget the little things that
                matter.
              </p>
              <p>
                If you don't agree with these terms, that's okay! But you won't
                be able to use our service. No hard feelings - we'll still be
                here if you change your mind.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                What Notifoo Does (Our Promise)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We provide a reminder service that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sends you SMS and email reminders when you ask us to</li>
                <li>Stores your reminders securely in the cloud</li>
                <li>Works across multiple devices and platforms</li>
                <li>Helps you stay organized and on top of your tasks</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We'll do our best to deliver every reminder on time, but we're
                not responsible if your phone is off, your email is full, or if
                aliens intercept our messages.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Your Responsibilities (The Good Citizen Rules)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>As a member of the Notifoo community, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide accurate contact information (we can't remind you if
                  we can't reach you)
                </li>
                <li>
                  Keep your account secure and don't share your login details
                </li>
                <li>Use the service for legitimate reminder purposes only</li>
                <li>Not spam yourself or others with excessive reminders</li>
                <li>
                  Be respectful in any communications with our support team
                </li>
                <li>Not try to hack, break, or reverse-engineer our service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Billing & Subscriptions (The Money Talk)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Here's how our billing works:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free tier includes basic reminder features</li>
                <li>Paid plans unlock premium features and higher limits</li>
                <li>Subscriptions renew automatically unless you cancel</li>
                <li>You can cancel anytime from your account settings</li>
                <li>Refunds are handled on a case-by-case basis</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We'll always remind you before your subscription renews. It's
                what we do best, after all!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Service Availability (The Reality Check)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We work hard to keep Notifoo running 24/7, but sometimes things
                happen:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Scheduled maintenance (we'll give you advance notice)</li>
                <li>
                  Unexpected technical issues (we'll fix them as fast as
                  possible)
                </li>
                <li>
                  Third-party service outages (SMS/email providers having bad
                  days)
                </li>
                <li>
                  Acts of nature, aliens, or other forces beyond our control
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                While we can't guarantee 100% uptime, we can guarantee we'll
                always work to get things back up and running quickly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                You can delete your account anytime. We can also suspend or
                terminate accounts that violate these terms, but we'll always
                try to work things out first.
              </p>
              <p>
                If your account is terminated, you'll lose access to your
                reminders and data. Make sure to export anything important
                before closing your account!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to These Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may update these terms occasionally to reflect changes in our
                service or legal requirements. When we do, we'll:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Notify you via email or in-app notification</li>
                <li>Give you time to review the changes</li>
                <li>Update the "Last updated" date at the top</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Continued use of Notifoo after changes means you accept the new
                terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions or Concerns?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                If you have questions about these terms or need clarification on
                anything, don't hesitate to reach out. We're here to help!
              </p>
              <div className="mt-4">
                <Button asChild>
                  <Link href="/contact">Contact Our Team</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
