import { db } from '@/lib/db';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const userService = {
  /**
   * Tüm kullanıcıları getirir (admin için)
   */
  async getAllUsers(): Promise<User[]> {
    return db.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Belirli bir kullanıcıyı ID'ye göre getirir
   */
  async getUserById(id: string): Promise<User | null> {
    return db.user.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  },

  /**
   * Belirli bir kullanıcıyı e-posta adresine göre getirir
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
      where: { email },
    });
  },

  /**
   * Kullanıcıları arama terimlerine göre getirir
   */
  async searchUsers(query: string): Promise<User[]> {
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
        ],
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
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return db.user.create({
      data: {
        name: data.name,
        email: data.email,
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
};
