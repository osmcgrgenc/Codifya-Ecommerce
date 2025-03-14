import { PrismaClient, BlogPost, BlogCategory } from '@prisma/client';
import { slugify } from '@/lib/utils';

const prisma = new PrismaClient();

export type BlogPostWithCategories = BlogPost & {
  categories: BlogCategory[];
  author: {
    name: string | null;
    image: string | null;
  };
};

export type BlogCategoryWithCount = BlogCategory & {
  _count: {
    blogPosts: number;
  };
};

export async function getAllBlogPosts(): Promise<BlogPostWithCategories[]> {
  return prisma.blogPost.findMany({
    include: {
      categories: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getPublishedBlogPosts(): Promise<BlogPostWithCategories[]> {
  return prisma.blogPost.findMany({
    where: {
      published: true,
    },
    include: {
      categories: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });
}

export async function getBlogPostById(id: string): Promise<BlogPostWithCategories | null> {
  return prisma.blogPost.findUnique({
    where: { id },
    include: {
      categories: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithCategories | null> {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      categories: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function createBlogPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  authorId: string;
  categoryIds?: string[];
}): Promise<BlogPost> {
  const { title, content, excerpt, coverImage, published, authorId, categoryIds } = data;

  // Slug oluştur
  let slug = slugify(title);

  // Slug'ın benzersiz olduğundan emin ol
  const existingPost = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (existingPost) {
    slug = `${slug}-${Date.now()}`;
  }

  return prisma.blogPost.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published: published || false,
      publishedAt: published ? new Date() : null,
      author: {
        connect: { id: authorId },
      },
      categories:
        categoryIds && categoryIds.length > 0
          ? {
              connect: categoryIds.map(id => ({ id })),
            }
          : undefined,
    },
  });
}

export async function updateBlogPost(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
    categoryIds?: string[];
  }
): Promise<BlogPost> {
  const { title, content, excerpt, coverImage, published, categoryIds } = data;

  // Eğer başlık değiştiyse yeni slug oluştur
  let slug;
  if (title) {
    slug = slugify(title);

    // Slug'ın benzersiz olduğundan emin ol (kendi ID'si hariç)
    const existingPost = await prisma.blogPost.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  // Mevcut kategorileri temizle
  await prisma.blogPost.update({
    where: { id },
    data: {
      categories: {
        set: [],
      },
    },
  });

  // Blog yazısını güncelle
  return prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published,
      publishedAt: published ? new Date() : null,
      categories:
        categoryIds && categoryIds.length > 0
          ? {
              connect: categoryIds.map(id => ({ id })),
            }
          : undefined,
    },
  });
}

export async function deleteBlogPost(id: string): Promise<BlogPost> {
  return prisma.blogPost.delete({
    where: { id },
  });
}

export async function publishBlogPost(id: string): Promise<BlogPost> {
  return prisma.blogPost.update({
    where: { id },
    data: {
      published: true,
      publishedAt: new Date(),
    },
  });
}

export async function unpublishBlogPost(id: string): Promise<BlogPost> {
  return prisma.blogPost.update({
    where: { id },
    data: {
      published: false,
      publishedAt: null,
    },
  });
}

// Blog kategorileri için fonksiyonlar
export async function getAllBlogCategories(): Promise<BlogCategoryWithCount[]> {
  return prisma.blogCategory.findMany({
    include: {
      _count: {
        select: {
          blogPosts: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getBlogCategoryById(id: string): Promise<BlogCategory | null> {
  return prisma.blogCategory.findUnique({
    where: { id },
  });
}

export async function createBlogCategory(data: { name: string }): Promise<BlogCategory> {
  const { name } = data;

  // Slug oluştur
  let slug = slugify(name);

  // Slug'ın benzersiz olduğundan emin ol
  const existingCategory = await prisma.blogCategory.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    slug = `${slug}-${Date.now()}`;
  }

  return prisma.blogCategory.create({
    data: {
      name,
      slug,
    },
  });
}

export async function updateBlogCategory(
  id: string,
  data: { name: string }
): Promise<BlogCategory> {
  const { name } = data;

  // Slug oluştur
  let slug = slugify(name);

  // Slug'ın benzersiz olduğundan emin ol (kendi ID'si hariç)
  const existingCategory = await prisma.blogCategory.findFirst({
    where: {
      slug,
      id: { not: id },
    },
  });

  if (existingCategory) {
    slug = `${slug}-${Date.now()}`;
  }

  return prisma.blogCategory.update({
    where: { id },
    data: {
      name,
      slug,
    },
  });
}

export async function deleteBlogCategory(id: string): Promise<BlogCategory> {
  return prisma.blogCategory.delete({
    where: { id },
  });
}
