export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue";
  createdAt: string;
}