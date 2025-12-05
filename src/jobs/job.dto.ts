export interface JobQueryDto {
  department?: string;
  location?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface JobDto {
  id: string;
  title: string;
  location: string;
  description: string;
  department: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type JobListResponse = JobDto[];

export interface CreateJobDto {
  title: string;
  location: string;
  description: string;
  department: string;
  isActive?: boolean;
}

export type UpdateJobDto = Partial<CreateJobDto>;

