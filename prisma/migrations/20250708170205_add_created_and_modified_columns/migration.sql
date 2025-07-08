-- AlterTable
ALTER TABLE "Addresses" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedBy" TEXT,
ADD COLUMN     "modifiedDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Employees" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedBy" TEXT,
ADD COLUMN     "modifiedDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Employments" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedBy" TEXT,
ADD COLUMN     "modifiedDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modifiedBy" TEXT,
ADD COLUMN     "modifiedDate" TIMESTAMP(3);
