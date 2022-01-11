-- AlterTable
ALTER TABLE "Fren" ADD COLUMN "textSearch" TSVECTOR
  GENERATED ALWAYS AS
    (setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(ens, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(handle, '')), 'C'))
  STORED;

-- CreateIndex
CREATE INDEX "Fren.textSearch_index" ON "Fren" USING GIN ("textSearch");
