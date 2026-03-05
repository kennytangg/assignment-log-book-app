export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "Create" | "On Process" | "Submitted";
  createdAt: string;
}