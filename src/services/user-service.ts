import { db } from '@/lib/db';
import { User, UserRole, Order, Review, ProductSeller } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface UserWithRelations extends User {
  orders: Order[];
  reviews: Review[];
  ProductSeller: ProductSeller[];
}

export const userService = {
  /**
   * Tüm kullanıcıları getirir (admin için)
   */
  async getAllUsers(): Promise<UserWithRelations[]> {
    return db.user.findMany({
      include: {
        orders: true,
        reviews: true,
        ProductSeller: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Belirli bir kullanıcıyı ID'ye göre getirir
   */
  async getUserById(id: string): Promise<UserWithRelations | null> {
    return db.user.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        reviews: true,
        ProductSeller: true,
      },
    });
  },

  /**
   * Belirli bir kullanıcıyı e-posta adresine göre getirir
   */
  async getUserByEmail(email: string): Promise<UserWithRelations | null> {
    return db.user.findUnique({
      where: { email },
      include: {
        orders: true,
        reviews: true,
        ProductSeller: true,
      },
    });
  },

  /**
   * Kullanıcıları arama terimlerine göre getirir
   */
  async searchUsers(query: string): Promise<UserWithRelations[]> {
    return db.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            phone: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        orders: true,
        reviews: true,
        ProductSeller: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Kullanıcı oluşturur
   */
  async createUser(data: {
    name?: string;
    email: string;
    password: string;
    role?: UserRole;
    image?: string;
    phone?: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return db.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || UserRole.CUSTOMER,
      },
    });
  },

  /**
   * Kullanıcı bilgilerini günceller
   */
  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
      image?: string;
      phone?: string;
      emailVerified?: Date;
    }
  ): Promise<User> {
    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return db.user.update({
      where: { id },
      data: updateData,
    });
  },

  /**
   * Kullanıcı siler
   */
  async deleteUser(id: string): Promise<User> {
    return db.user.delete({
      where: { id },
    });
  },

  /**
   * Kullanıcı şifresini kontrol eder
   */
  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return false;
    }

    return bcrypt.compare(password, user.password);
  },

  // Yeni eklenen metodlar
  async getUserReviews(userId: string): Promise<Review[]> {
    return db.review.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });
  },

  async getUserProducts(userId: string): Promise<ProductSeller[]> {
    return db.productSeller.findMany({
      where: {
        sellerId: userId,
      },
      include: {
        product: true,
      },
    });
  },

  async verifyEmail(userId: string): Promise<User> {
    return db.user.update({
      where: { id: userId },
      data: {
        emailVerified: new Date(),
      },
    });
  },
};
