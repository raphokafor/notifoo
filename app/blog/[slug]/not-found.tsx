import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NavHeader from "@/components/navigation/NavHeader";
import { ArrowLeft, FileX } from "lucide-react";
import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <div className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <Card className="p-8">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <FileX className="h-16 w-16 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold text-zinc-800">
                Article Not Found
              </CardTitle>
              <CardDescription className="text-lg">
                Sorry, we couldn't find the blog post you're looking for. It may
                have been moved or doesn't exist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/blog">
                  <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Go Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
