import { getAllPosts } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NavHeader from "@/components/navigation/NavHeader";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import FooterComp from "@/components/landing/Footer";

export const metadata = {
  title: "Blog | Notifoo",
  description: "Latest insights, tips, and updates from the Notifoo team.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-2xl md:text-4xl font-black text-balance mb-6 text-zinc-600">
            <span className="text-[#3b82f6]">Thoughts</span> and{" "}
            <span className="text-[#3b82f6]">observations</span> we actually
            remembered to write down.
          </h1>
          <p className="text-sm md:text-base text-muted-foreground text-balance max-w-3xl mx-auto text-zinc-600">
            Get the inside scoop from our team of reformed forgetful humans
            who've somehow figured out how to remember things long enough to
            write them down. We share tips, tricks, and the occasional
            existential crisis about why we need apps to remember to drink
            water.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-zinc-600 mb-4">
                No posts yet
              </h2>
              <p className="text-zinc-500">
                Check back soon for our latest articles and insights.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card
                  key={post.slug}
                  className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {post.image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3 h-[200px]">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-[#3b82f6] transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.description}
                    </CardDescription>
                  </CardHeader>

                  {/* // chips and read more button */}
                  <CardContent className="pt-2 flex flex-col gap-4 justify-between h-[200px]">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button
                        variant="secondary"
                        className="w-full group-hover:bg-zinc-800 group-hover:text-white transition-colors"
                      >
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <FooterComp />
      </section>
    </div>
  );
}
