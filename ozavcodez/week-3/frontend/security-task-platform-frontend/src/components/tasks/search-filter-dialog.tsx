"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SearchFilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSearch: (query: string) => void
  onFilter: (status: string) => void
}

export function SearchFilterDialog({ open, onOpenChange, onSearch, onFilter }: SearchFilterDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleFilter = () => {
    onFilter(filterStatus)
  }

  const handleReset = () => {
    setSearchQuery("")
    setFilterStatus("")
    onSearch("")
    onFilter("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle>Search & Filter Tasks</DialogTitle>
          <DialogDescription>Find tasks by keyword or filter by status</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="filter">Filter</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Query</Label>
              <Input
                id="search"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleReset}>
                Clear
              </Button>
              <Button onClick={handleSearch}>Apply Search</Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="filter" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleReset}>
                Clear
              </Button>
              <Button onClick={handleFilter}>Apply Filter</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
