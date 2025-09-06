"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ContactFormClient() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    urgency: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    try {
      setIsLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setError(
          "There was an error submitting the message. Please try again."
        );
        toast.error("Failed to submit contact form");
        return;
      }

      setSuccess(true);
      toast.success("Message submitted successfully");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        urgency: "",
      });
    } catch (error) {
      console.error("Error submitting contact form", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className=" rounded-lg flex items-center justify-center">
                <Image src={Logo} alt="Notifoo" width={100} height={100} />
              </div>
              <span className="text-xl font-bold text-[#3b82f6]">Notifoo</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-lg border-0 bg-white h-full md:h-[550px]">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Send Us a Message
              </CardTitle>
              <CardDescription>
                Drop us a line and we'll get back to you faster than you can
                forget where you put your keys!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Memory Warrior #1"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="warrior@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Bug Report, Feature Request, or Marriage Proposal"
                    className="placeholder:text-sm"
                    value={formData.subject}
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what's on your mind (or what you forgot was on your mind)..."
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    required
                  />
                </div>

                {!success ? (
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                    {isLoading && (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center justify-center">
                    <p className="text-green-600">
                      Message submitted successfully
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & FAQ */}
          <div className="space-y-6">
            {/* Fun FAQ */}
            <Card className="shadow-lg border-0 bg-white h-full md:h-[550px] py-8 md:py-0">
              <CardHeader className="border-b mb-4">
                <CardTitle className="text-xl text-gray-900">
                  Quick Answers
                </CardTitle>
                <CardDescription>
                  Before you ask, here are some answers to questions we get a
                  lot:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 h-[400px] flex flex-col justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Can Notifoo remind me to remember things?
                  </h4>
                  <p className="text-sm text-gray-600">
                    That's... literally what we do. You've come to the right
                    place, Memory Warrior!
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Do you offer refunds?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Yes! We're so confident you'll love Notifoo, we offer a
                    30-day money-back guarantee. No questions asked (but we
                    might ask anyway because we're curious).
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Is my data secure?
                  </h4>
                  <p className="text-sm text-gray-600">
                    We protect your reminders like they're state secrets. Your
                    grocery lists are safe with us.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Can I cancel anytime?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Yes, but we'll be sad to see you go. We might send you a
                    reminder to come back (just kidding... or are we?).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
