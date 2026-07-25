-- Add nullable service_slug on projects for related work on service detail pages (#378)
ALTER TABLE projects ADD COLUMN service_slug TEXT;
CREATE INDEX idx_projects_service_slug ON projects(service_slug);
