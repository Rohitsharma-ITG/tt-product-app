-- CreateTable
CREATE TABLE "card_images" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "game_id" INTEGER DEFAULT 0,
    "group_token" VARCHAR(64),
    "card_side" VARCHAR(64),
    "tmp" VARCHAR(255),
    "domain" VARCHAR(255),
    "path" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "thumbnail" VARCHAR(255),
    "type" VARCHAR(100) NOT NULL,
    "sort_order" INTEGER DEFAULT 0,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "size" VARCHAR(255),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "card_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_likes" (
    "card_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_likes_pkey" PRIMARY KEY ("card_id","customer_id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "auth_key" VARCHAR(32) NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,
    "status" SMALLINT NOT NULL DEFAULT 0,
    "language" VARCHAR(10) DEFAULT 'en-US',
    "game_id" INTEGER NOT NULL,
    "customer_id" INTEGER,
    "character_name" VARCHAR(30) NOT NULL,
    "character_class" VARCHAR(30),
    "character_effect" VARCHAR(30),
    "custom_description" SMALLINT NOT NULL DEFAULT 0,
    "character_description" VARCHAR(2000),
    "character_image" VARCHAR(2000),
    "uploaded_image_url" VARCHAR(2000),
    "image_cropbox" VARCHAR(255),
    "character_display_name" VARCHAR(50),
    "card_image" VARCHAR(2000),
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "card_options" JSON,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country_taxes" (
    "id" SERIAL NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax_name" VARCHAR(255) NOT NULL,
    "is_eu" BOOLEAN NOT NULL DEFAULT false,
    "customs_limit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "country_taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency_rates" (
    "id" BIGSERIAL NOT NULL,
    "base_currency" VARCHAR(255) NOT NULL,
    "rates" TEXT NOT NULL,
    "currency_date" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "currency_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failed_jobs" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "connection" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "exception" TEXT NOT NULL,
    "failed_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "failed_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" INTEGER NOT NULL DEFAULT 0,
    "alias" VARCHAR(255),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "banner" VARCHAR(1500),
    "banner_link" VARCHAR(1500),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geoip2_location" (
    "geoname_id" INTEGER NOT NULL,
    "locale_code" TEXT NOT NULL,
    "continent_code" TEXT NOT NULL,
    "continent_name" TEXT NOT NULL,
    "country_iso_code" TEXT,
    "country_name" TEXT,
    "subdivision_1_iso_code" TEXT,
    "subdivision_1_name" TEXT,
    "subdivision_2_iso_code" TEXT,
    "subdivision_2_name" TEXT,
    "city_name" TEXT,
    "metro_code" INTEGER,
    "time_zone" TEXT,
    "is_in_european_union" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "geoip2_location_pkey" PRIMARY KEY ("geoname_id","locale_code")
);

-- CreateTable
CREATE TABLE "license_market" (
    "id" SERIAL NOT NULL,
    "license_id" INTEGER NOT NULL,
    "shopify_market_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "license_market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "old_id" INTEGER,
    "included_countries" JSON,
    "excluded_countries" JSON,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_catalog_markets" (
    "shopify_market_id" SERIAL NOT NULL,
    "shopify_market_catalog_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "market_catalog_markets_pkey" PRIMARY KEY ("shopify_market_id")
);

-- CreateTable
CREATE TABLE "market_catalogs" (
    "shopify_market_catalog_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "market_catalogs_pkey" PRIMARY KEY ("shopify_market_catalog_id")
);

-- CreateTable
CREATE TABLE "markets" (
    "shopify_market_id" SERIAL NOT NULL,
    "countries" JSON NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "markets_pkey" PRIMARY KEY ("shopify_market_id")
);

-- CreateTable
CREATE TABLE "product_license" (
    "id" SERIAL NOT NULL,
    "shopify_product_id" INTEGER NOT NULL,
    "license_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "product_license_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_custom_images" (
    "id" SERIAL NOT NULL,
    "shopify_product_id" INTEGER NOT NULL,
    "shopify_variant_id" INTEGER NOT NULL,
    "shopify_image_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "image_src" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "product_variant_custom_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication_products" (
    "id" SERIAL NOT NULL,
    "shopify_publication_id" INTEGER NOT NULL,
    "shopify_product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "publication_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publications" (
    "shopify_publication_id" SERIAL NOT NULL,
    "shopify_market_catalog_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("shopify_publication_id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" INTEGER,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT NOT NULL,
    "refreshTokenExpires" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "card_images_account_id_index" ON "card_images"("account_id");

-- CreateIndex
CREATE INDEX "card_images_created_at_index" ON "card_images"("created_at");

-- CreateIndex
CREATE INDEX "card_images_deleted_at_index" ON "card_images"("deleted_at");

-- CreateIndex
CREATE INDEX "card_images_domain_index" ON "card_images"("domain");

-- CreateIndex
CREATE INDEX "card_images_game_id_index" ON "card_images"("game_id");

-- CreateIndex
CREATE INDEX "card_images_name_index" ON "card_images"("name");

-- CreateIndex
CREATE INDEX "card_images_path_index" ON "card_images"("path");

-- CreateIndex
CREATE INDEX "card_images_status_index" ON "card_images"("status");

-- CreateIndex
CREATE INDEX "card_images_tmp_index" ON "card_images"("tmp");

-- CreateIndex
CREATE INDEX "card_images_type_index" ON "card_images"("type");

-- CreateIndex
CREATE INDEX "card_likes_card_id_index" ON "card_likes"("card_id");

-- CreateIndex
CREATE INDEX "card_likes_created_at_index" ON "card_likes"("created_at");

-- CreateIndex
CREATE INDEX "card_likes_customer_id_index" ON "card_likes"("customer_id");

-- CreateIndex
CREATE INDEX "cards_auth_key_index" ON "cards"("auth_key");

-- CreateIndex
CREATE INDEX "cards_customer_id_index" ON "cards"("customer_id");

-- CreateIndex
CREATE INDEX "cards_deleted_at_index" ON "cards"("deleted_at");

-- CreateIndex
CREATE INDEX "cards_game_id_index" ON "cards"("game_id");

-- CreateIndex
CREATE INDEX "cards_like_count_index" ON "cards"("like_count");

-- CreateIndex
CREATE INDEX "cards_status_index" ON "cards"("status");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_unique" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" ON "failed_jobs"("uuid");

-- CreateIndex
CREATE INDEX "games_account_id_index" ON "games"("account_id");

-- CreateIndex
CREATE INDEX "games_alias_index" ON "games"("alias");

-- CreateIndex
CREATE INDEX "games_created_at_index" ON "games"("created_at");

-- CreateIndex
CREATE INDEX "games_deleted_at_index" ON "games"("deleted_at");

-- CreateIndex
CREATE INDEX "games_status_index" ON "games"("status");

-- CreateIndex
CREATE UNIQUE INDEX "licenses_name_unique" ON "licenses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_license_shopify_product_id_unique" ON "product_license"("shopify_product_id");

-- CreateIndex
CREATE INDEX "product_license_shopify_product_id_license_id_index" ON "product_license"("shopify_product_id", "license_id");

-- CreateIndex
CREATE INDEX "product_variant_custom_images_shopify_product_id_index" ON "product_variant_custom_images"("shopify_product_id");

-- CreateIndex
CREATE INDEX "product_variant_custom_images_shopify_variant_id_index" ON "product_variant_custom_images"("shopify_variant_id");

-- AddForeignKey
ALTER TABLE "market_catalog_markets" ADD CONSTRAINT "market_catalog_markets_shopify_market_catalog_id_foreign" FOREIGN KEY ("shopify_market_catalog_id") REFERENCES "market_catalogs"("shopify_market_catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_license" ADD CONSTRAINT "product_license_license_id_foreign" FOREIGN KEY ("license_id") REFERENCES "licenses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publication_products" ADD CONSTRAINT "publication_products_shopify_publication_id_foreign" FOREIGN KEY ("shopify_publication_id") REFERENCES "publications"("shopify_publication_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_shopify_market_catalog_id_foreign" FOREIGN KEY ("shopify_market_catalog_id") REFERENCES "market_catalogs"("shopify_market_catalog_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
