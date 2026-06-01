-- AlterTable
ALTER TABLE "OrientationSession" ADD COLUMN     "autonomyScore" INTEGER,
ADD COLUMN     "clarityScore" INTEGER,
ADD COLUMN     "doNotDo" TEXT[],
ADD COLUMN     "immediateRisks" TEXT[],
ADD COLUMN     "remainingQuestions" TEXT[],
ADD COLUMN     "urgencyScore" INTEGER;

-- AlterTable
ALTER TABLE "YoungProfile" ADD COLUMN     "appetences" TEXT[],
ADD COLUMN     "charges" TEXT,
ADD COLUMN     "hasLicense" BOOLEAN,
ADD COLUMN     "mobility" TEXT,
ADD COLUMN     "motivations" TEXT[];
