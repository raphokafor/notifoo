import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
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
  ];
}
