// Eski import
// import { productService } from './product-service';

// Yeni modüler yapıdan import
import productService from './product/index';
import { variationService } from './variation-service';
import { brandService } from './brand-service';
import { categoryService } from './category-service';
import { orderService } from './order-service';
import { userService } from './user-service';
import { ImportService as importService } from './import-service';
// api-service'den doğrudan fonksiyonları import ediyorum
import * as apiService from './api-service';

export {
  productService,
  variationService,
  brandService,
  categoryService,
  orderService,
  userService,
  importService,
  apiService,
};
