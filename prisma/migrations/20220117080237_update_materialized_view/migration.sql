DROP MATERIALIZED VIEW IF EXISTS fren_ranks;
CREATE MATERIALIZED VIEW fren_ranks AS SELECT *, RANK () OVER (ORDER BY followers DESC) AS ranking FROM "Fren" WHERE LOWER(name) like '%.eth%' AND ens IS NOT NULL;
CREATE UNIQUE INDEX on fren_ranks (id);