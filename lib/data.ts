import { Assignment } from "@/types/assignment";

export let assignments: Assignment[] = [
  {
    id: "1",
    title: "Math Homework",
    subject: "Mathematics",
    description: "Complete chapter 5 exercises",
    dueDate: "2026-03-10",
    status: "pending",
    createdAt: "2026-03-01",
  },
  {
    id: "2",
    title: "Science Report",
    subject: "Science",
    description: "Write a report about photosynthesis",
    dueDate: "2026-03-15",
    status: "completed",
    createdAt: "2026-03-01",
  },
  {
    id: "3",
    title: "History Essay",
    subject: "History",
    description: "Essay on World War II causes",
    dueDate: "2026-03-08",
    status: "overdue",
    createdAt: "2026-03-01",
  },
];