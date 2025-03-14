import { db } from '@/lib/db';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const contactService = {
  // İletişim mesajı oluştur
  async createContactMessage(data: ContactFormData) {
    return await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      },
    });
  },

  // Tüm iletişim mesajlarını getir
  async getAllContactMessages() {
    return await db.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Belirli bir iletişim mesajını getir
  async getContactMessageById(id: string) {
    return await db.contactMessage.findUnique({
      where: { id },
    });
  },

  // İletişim mesajını okundu olarak işaretle
  async markAsRead(id: string) {
    return await db.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  },

  // İletişim mesajını sil
  async deleteContactMessage(id: string) {
    return await db.contactMessage.delete({
      where: { id },
    });
  },
};
