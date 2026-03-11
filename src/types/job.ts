export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  applyUrl: string;
  workMode?: string;
  description?: string;
  tags?: string[];
}

