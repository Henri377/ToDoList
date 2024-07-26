"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "./button";
import { Input } from "./input";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

import { Label } from "./label";
import { SetStateAction, useState } from "react";
import { parseCookies } from 'nookies';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [title, setTitle] = useState("Title");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTitleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setTitle(event.target.value);
  };

  const handleStatusChange = (value: SetStateAction<string>) => {
    setStatus(value);
  };

  const handlePriorityChange = (value: SetStateAction<string>) => {
    setPriority(value);
  };


async function getUserId(token: string): Promise<string | null | undefined> {
  if (!token) {
    console.error("Token is empty");
    return null;
  }  

  const res = await fetch("http://localhost:3000/api/user", {
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cookie': `access_token=${token}`
        },
  });
  if (res.ok) {
    const user = await res.json();
    return user.id;
  }

  return undefined;
}

  const handleSaveChanges = async () => {
    const cookies = parseCookies();
    const token = cookies['access_token'];
    const userid = await getUserId(token);
    const data = {
      title,
      status,
      priority,
      userId: userid
    };
  
    try {
      
      const response = await fetch('http://localhost:3000/api/todo', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cookie': `access_token=${token}`
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
    <div className="flex items-center justify-between flex-wrap">
      <div className="flex flex-1 items-center space-x-2 sm:w-auto w-full">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <Select 
          onValueChange={(value) =>
            table.getColumn("status")?.setFilterValue(value)
          }
        >
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
        </Select >

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">Add Task</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
              <DialogDescription>
                Add a task to the table. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" defaultValue="Title" className="col-span-3" value={title} onChange={handleTitleChange} />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>

                <Select onValueChange={handleStatusChange}>
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
                <Select onValueChange={handlePriorityChange}>
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
              <Button onClick={handleSaveChanges} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
