-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "phone_no" VARCHAR(15),
    "email" VARCHAR(255),
    "address" TEXT,
    "password" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);
