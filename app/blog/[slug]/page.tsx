import { getPostBySlug, getAllPostSlugs, getAllPosts } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import NavHeader from "@/components/navigation/NavHeader";
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Function to process content and add Notifoo links
function processContentWithNotifooLinks(content: string): string {
  // Replace "Notifoo" with a link, but preserve case and avoid double-linking
  return content.replace(
    /(?<!href=["'][^"']*)\b(Notifoo|notifoo|NOTIFOO)\b(?![^<]*>)/gi,
    '<a href="/signup" class="notifoo-link font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300 decoration-2 underline-offset-4 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md">$1</a>'
  );
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Notifoo Blog",
    };
  }

  return {
    title: `${post.title} | Notifoo Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Process content to add Notifoo links
  const processedContent = processContentWithNotifooLinks(post.content);

  // Get related posts (same tags, excluding current post)
  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .filter((p) => p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <NavHeader />

      {/* Back to Blog */}
      <div className="px-6">
        <div className="container mx-auto max-w-5xl">
          <Link href="/blog">
            <Button
              variant="ghost"
              className="mb-6 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="px-6">
        <div className="container mx-auto max-w-5xl overflow-hidden">
          <div className="py-16">
            {/* Featured Image */}
            {post.image && (
              <div className="relative h-80 md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            {/* Article Meta */}
            <div className="mb-12">
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">
                    {Math.ceil(processedContent.split(" ").length / 200)} min
                    read
                  </span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-8 leading-tight tracking-tight">
                {post.title}
              </h1>

              <p className="text-2xl text-gray-600 mb-10 leading-relaxed font-light tracking-wide">
                {post.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-12">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-300 rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="mb-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Article Content */}
            <div
              className="prose prose-xl prose-zinc max-w-none
                     /* Beautiful paragraph spacing and typography */
                     prose-p:text-zinc-700 prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-[18px] prose-p:font-light
                     prose-p:tracking-wide prose-p:first-letter:text-4xl prose-p:first-letter:font-bold prose-p:first-letter:float-left
                     prose-p:first-letter:mr-3 prose-p:first-letter:mt-1 prose-p:first-letter:leading-none prose-p:first-letter:text-blue-600
                     
                     /* Headings with beautiful spacing */
                     prose-headings:text-zinc-800 prose-headings:font-bold prose-headings:tracking-tight
                     prose-h1:text-4xl prose-h1:mb-10 prose-h1:mt-16 prose-h1:leading-tight
                     prose-h2:text-3xl prose-h2:mb-8 prose-h2:mt-14 prose-h2:leading-snug prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-4
                     prose-h3:text-2xl prose-h3:mb-6 prose-h3:mt-12 prose-h3:leading-snug prose-h3:text-blue-700
                     prose-h4:text-xl prose-h4:mb-5 prose-h4:mt-10 prose-h4:leading-snug
                     
                     /* Links styling */
                     prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:transition-all prose-a:duration-300
                     prose-a:decoration-2 prose-a:underline-offset-4 prose-a:hover:decoration-4
                     
                     /* Text enhancements */
                     prose-strong:text-zinc-800 prose-strong:font-bold prose-strong:bg-yellow-100 prose-strong:px-1 prose-strong:rounded
                     prose-em:text-zinc-600 prose-em:font-medium prose-em:italic
                     
                     /* Lists with beautiful spacing */
                     prose-ul:mb-8 prose-ul:space-y-3 prose-ul:text-zinc-700
                     prose-ol:mb-8 prose-ol:space-y-3 prose-ol:text-zinc-700
                     prose-li:leading-[1.8] prose-li:text-[17px] prose-li:font-light
                     prose-li:marker:text-blue-500 prose-li:marker:font-bold
                     
                     /* Blockquotes with stunning design */
                     prose-blockquote:border-l-8 prose-blockquote:border-gradient-to-b prose-blockquote:from-blue-400 prose-blockquote:to-blue-600
                     prose-blockquote:bg-gradient-to-r prose-blockquote:from-blue-50 prose-blockquote:to-blue-100
                     prose-blockquote:text-zinc-700 prose-blockquote:font-medium prose-blockquote:italic
                     prose-blockquote:p-8 prose-blockquote:my-12 prose-blockquote:rounded-r-xl prose-blockquote:shadow-lg
                     prose-blockquote:text-lg prose-blockquote:leading-relaxed
                     
                     /* Code styling */
                     prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-3 prose-code:py-1 
                     prose-code:rounded-lg prose-code:text-sm prose-code:font-mono prose-code:border
                     prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl 
                     prose-pre:my-10 prose-pre:shadow-2xl prose-pre:border prose-pre:border-gray-700
                     
                     /* Images with beautiful presentation */
                     prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-12 prose-img:border prose-img:border-gray-200
                     prose-img:hover:shadow-3xl prose-img:transition-shadow prose-img:duration-300
                     
                     /* Tables */
                     prose-table:my-10 prose-table:shadow-lg prose-table:rounded-lg prose-table:overflow-hidden
                     prose-th:bg-blue-600 prose-th:text-white prose-th:font-bold prose-th:p-4
                     prose-td:p-4 prose-td:border-b prose-td:border-gray-200
                     
                     /* Special styling for Notifoo links */
                     [&_.notifoo-link]:no-underline [&_.notifoo-link]:font-bold [&_.notifoo-link]:shadow-sm [&_.notifoo-link]:hover:shadow-md
                     
                     /* Enhanced paragraph spacing for better readability */
                     [&>*]:mb-6 [&>p]:mb-8 [&>h1]:mb-10 [&>h2]:mb-8 [&>h3]:mb-6 [&>h4]:mb-5
                     [&>ul]:mb-8 [&>ol]:mb-8 [&>blockquote]:mb-12 [&>pre]:mb-10
                     /* Ensure line breaks create proper spacing */
                     [&>br]:block [&>br]:mb-4"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-slate-50">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-16 text-center tracking-tight">
              Related Articles
            </h2>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Card
                  key={relatedPost.slug}
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white rounded-2xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
                  <CardHeader className="pb-6 pt-8 px-8">
                    <div className="text-sm text-blue-600 mb-4 font-medium bg-blue-50 px-3 py-1 rounded-full w-fit">
                      {new Date(relatedPost.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug font-bold tracking-tight">
                      {relatedPost.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-base leading-relaxed text-gray-600 mt-3">
                      {relatedPost.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 px-8 pb-8">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 rounded-xl font-medium"
                      >
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="py-16 px-6 ">
        <div className="container mx-auto max-w-5xl">
          <div className="w-[80%] mx-auto mb-12">
            <p className="text-gray-600 text-center text-sm font-light">
              Tired of your brain treating important information like it's
              optional? Join thousands of reformed forgetful humans who've
              discovered the ancient art of Actually Remembering Stuff
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Sign up for Notifoo
                <ArrowRight className="ml-3 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
