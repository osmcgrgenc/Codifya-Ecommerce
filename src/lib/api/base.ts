import { z } from 'zod';

export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.message || 'Bir hata oluştu', response.status, error.code);
  }
  return response.json();
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function createApiClient<T extends BaseModel>(endpoint: string) {
  return {
    async getAll(params?: QueryParams): Promise<PaginatedResponse<T>> {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }
      const response = await fetch(`${API_BASE_URL}${endpoint}?${searchParams.toString()}`);
      return handleResponse(response);
    },

    async getById(id: string): Promise<T> {
      const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`);
      return handleResponse(response);
    },

    async create(data: Omit<T, keyof BaseModel>): Promise<T> {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    async update(id: string, data: Partial<Omit<T, keyof BaseModel>>): Promise<T> {
      const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    async delete(id: string): Promise<void> {
      const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
        method: 'DELETE',
      });
      return handleResponse(response);
    },
  };
}
