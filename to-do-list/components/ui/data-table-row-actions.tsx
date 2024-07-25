"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { SetStateAction, useState } from "react";

import { Label } from "./label";
import { statuses, priorities } from "../../data/data";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Input } from "./input";
import { Task } from "@/data/schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {

const [title, setTitle] = useState<Task['title']>(row.getValue('title'));
const [status, setStatus] = useState<Task['status']>(row.getValue('status'));
const [priority, setPriority] = useState<Task['priority']>(row.getValue('priority'))

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleStatusChange = (value: "BACKLOG" | "TODO" | "PROGRESS" | "DONE" | "CANCELED") => {
    setStatus(value);
  };

  const handlePriorityChange = (value:"HIGH" | "LOW" | "MEDIUM") => {
    setPriority(value);
  };


  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleFinish = async () => {
    const id = row.getValue('id');

    try{
      const response = await fetch(`http://localhost:3000/api/todo/${id}/done`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        });
        
      window.location.reload()
      
    } 
    catch(error) {
      console.error('Error:', error);
    }
  }

  const handleEditSave = async () => {
    const data = {
      title,
      status,
      priority,
    };

  
    const id = row.getValue('id');
  
    try {
      const response = await fetch(`http://localhost:3000/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),  
  
      });
  
      if (response.ok) {
        setIsDialogOpen(false);
        window.location.reload()
      }

      } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => handleFinish()}>Finish</DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Edit the task details below.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" defaultValue={row.getValue('title')} value={title} onChange={handleTitleChange} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>

              <Select defaultValue={row.getValue('status')} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select defaultValue={row.getValue('priority')} onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Priority</SelectLabel>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={() => handleEditSave()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
