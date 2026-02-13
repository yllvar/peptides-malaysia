-- CreateIndex
CREATE INDEX "products_is_published_sort_order_idx" ON "products"("is_published", "sort_order");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");
