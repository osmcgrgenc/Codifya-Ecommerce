import { db } from '@/lib/db';
import { Order, OrderStatus } from '@prisma/client';

export const orderService = {
  /**
   * Kullanıcının siparişlerini getirir
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    return db.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Belirli bir siparişi ID'ye göre getirir
   */
  async getOrderById(id: string) {
    return db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  /**
   * Tüm siparişleri getirir (admin için)
   */
  async getAllOrders(): Promise<Order[]> {
    return db.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Sipariş durumunu günceller
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return db.order.update({
      where: { id },
      data: { status },
    });
  },

  /**
   * Sipariş oluşturur
   */
  async createOrder(data: {
    userId?: string;
    totalAmount: number;
    shippingAddress?: string;
    billingAddress?: string;
    paymentMethod?: string;
    items: {
      productId: string;
      quantity: number;
      price: number;
    }[];
  }) {
    return db.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        paymentMethod: data.paymentMethod,
        status: OrderStatus.PENDING,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },
};
