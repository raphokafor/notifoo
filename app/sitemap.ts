import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const staticRoutes = [
    {
      url: "https://www.Notifoo.com/",
      lastModified: new Date(),
    },
    {
      url: "https://www.Notifoo.com/about",
      lastModified: new Date(),
    },
    {
      url: "https://www.Notifoo.com/contact",
      lastModified: new Date(),
    },
    {
      url: "https://www.Notifoo.com/pricing",
      lastModified: new Date(),
    },
    {
      url: "https://www.Notifoo.com/sign-in",
      lastModified: new Date(),
    },
    {
      url: "https://www.Notifoo.com/sign-up",
      lastModified: new Date(),
    },
    {
      url: "https://www.Notifoo.com/privacy",
      lastModified: new Date(),
    },
    {
      url: "https://www.Notifoo.com/terms",
      lastModified: new Date(),
    },
    {
      url: "https://www.Notifoo.com/blog",
      lastModified: new Date(),
    },
  ];

  const blogRoutes = posts.map((post) => ({
    url: `https://www.Notifoo.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...blogRoutes];
}
