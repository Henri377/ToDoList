import {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CheckCircledIcon,
    CircleIcon,
    CrossCircledIcon,
    QuestionMarkCircledIcon,
    StopwatchIcon,
  } from "@radix-ui/react-icons"
  
  export interface Task {
    id: string
    title: string
    status: string
    priority: string
    createdAt: string
    updatedAt: string
  }
  
  export const statuses = [
    {
      value: "BACKLOG",
      label: "Backlog",
      icon: QuestionMarkCircledIcon,
    },
    {
      value: "TODO",
      label: "Todo",
      icon: CircleIcon,
    },
    {
      value: "PROGRESS",
      label: "In Progress",
      icon: StopwatchIcon,
    },
    {
      value: "DONE",
      label: "Done",
      icon: CheckCircledIcon,
    },
    {
      value: "CANCELED",
      label: "Canceled",
      icon: CrossCircledIcon,
    },
  ]
  
  export const priorities = [
    {
      label: "Low",
      value: "LOW",
      icon: ArrowDownIcon,
    },
    {
      label: "Medium",
      value: "MEDIUM",
      icon: ArrowRightIcon,
    },
    {
      label: "High",
      value: "HIGH",
      icon: ArrowUpIcon,
    },
  ]