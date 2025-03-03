import { db } from '@/lib/db';
import { Order, OrderStatus, OrderItem, Payment, PaymentStatus } from '@prisma/client';

export interface OrderWithRelations extends Omit<Order, 'payment'> {
  items: (OrderItem & {
    product: any;
  })[];
  payment: Payment | null;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export const orderService = {
  /**
   * Kullanıcının siparişlerini getirir
   */
  async getUserOrders(userId: string): Promise<OrderWithRelations[]> {
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
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Belirli bir siparişi ID'ye göre getirir
   */
  async getOrderById(id: string): Promise<OrderWithRelations | null> {
    return db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  /**
   * Tüm siparişleri getirir (admin için)
   */
  async getAllOrders(): Promise<OrderWithRelations[]> {
    return db.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
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
  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    data?: {
      trackingNumber?: string;
      estimatedDeliveryDate?: Date;
      canceledAt?: Date;
    }
  ): Promise<Order> {
    return db.order.update({
      where: { id },
      data: {
        status,
        ...data,
      },
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
    notes?: string;
    referenceCode?: string;
    items: {
      productId: string;
      quantity: number;
      price: number;
    }[];
  }): Promise<OrderWithRelations> {
    return db.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        notes: data.notes,
        referenceCode: data.referenceCode,
        status: OrderStatus.PENDING,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });
  },

  // Yeni eklenen metodlar
  async createPayment(data: {
    orderId: string;
    method: string;
    provider?: string;
    transactionId?: string;
    status?: string;
  }): Promise<Payment> {
    return db.payment.create({
      data,
    });
  },

  async updatePayment(
    orderId: string,
    data: {
      status: string;
      transactionId?: string;
    }
  ): Promise<Payment> {
    return db.payment.update({
      where: { orderId },
      data,
    });
  },

  async getOrdersByStatus(status: OrderStatus): Promise<OrderWithRelations[]> {
    return db.order.findMany({
      where: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
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

  async getOrdersByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<OrderWithRelations[]> {
    return db.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
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
};
