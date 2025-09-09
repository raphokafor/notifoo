import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const staticRoutes = [
    {
      url: "https://www.notifoo.io/",
      lastModified: new Date(),
    },
    {
      url: "https://www.notifoo.io/about",
      lastModified: new Date(),
    },
    {
      url: "https://www.notifoo.io/contact",
      lastModified: new Date(),
    },
    {
      url: "https://www.notifoo.io/pricing",
      lastModified: new Date(),
    },
    {
      url: "https://www.notifoo.io/sign-in",
      lastModified: new Date(),
    },
    {
      url: "https://www.notifoo.io/sign-up",
      lastModified: new Date(),
    },
    {
      url: "https://www.notifoo.io/privacy",
      lastModified: new Date(),
    },
    {
      url: "https://www.notifoo.io/terms",
      lastModified: new Date(),
    },
    {
      url: "https://www.notifoo.io/blog",
      lastModified: new Date(),
    },
  ];

  const blogRoutes = posts.map((post) => ({
    url: `https://www.notifoo.io/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...blogRoutes];
}
