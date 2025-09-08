import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  image?: string;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  image?: string;
}

const articlesDirectory = path.join(process.cwd(), "articles");

export function getAllPosts(): BlogPostMeta[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);

        return {
          slug: matterResult.data.slug || slug,
          title: matterResult.data.title || "",
          description: matterResult.data.description || "",
          author: matterResult.data.author || "",
          date: matterResult.data.date || "",
          tags: matterResult.data.tags || [],
          image: matterResult.data.image || "",
        };
      });

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error("Error reading articles directory:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    let fullPath = path.join(articlesDirectory, `${slug}.md`);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      // Try to find by slug from frontmatter
      const fileNames = fs.readdirSync(articlesDirectory);
      let foundFile = null;

      for (const fileName of fileNames) {
        if (fileName.endsWith(".md")) {
          const filePath = path.join(articlesDirectory, fileName);
          const fileContents = fs.readFileSync(filePath, "utf8");
          const matterResult = matter(fileContents);

          if (matterResult.data.slug === slug) {
            foundFile = filePath;
            break;
          }
        }
      }

      if (!foundFile) {
        return null;
      }

      fullPath = foundFile;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      slug: matterResult.data.slug || slug,
      title: matterResult.data.title || "",
      description: matterResult.data.description || "",
      author: matterResult.data.author || "",
      date: matterResult.data.date || "",
      tags: matterResult.data.tags || [],
      image: matterResult.data.image || "",
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);

        // Use slug from frontmatter if available, otherwise use filename
        return matterResult.data.slug || fileName.replace(/\.md$/, "");
      });
  } catch (error) {
    console.error("Error reading articles directory:", error);
    return [];
  }
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.tags.some((postTag) =>
      postTag.toLowerCase().includes(tag.toLowerCase())
    )
  );
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tagSet = new Set<string>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}
