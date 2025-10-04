"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  EditIcon,
  EllipsisIcon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ContactForm = {
  id: string
  full_name: string
  email: string
  phone: string
  status: "pending" | "completed"
  message: string
  created_at: string
}

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<ContactForm> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.full_name} ${row.original.message}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

const statusFilterFn: FilterFn<ContactForm> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}

const createColumns = (
  data: ContactForm[], 
  setData: React.Dispatch<React.SetStateAction<ContactForm[]>>
): ColumnDef<ContactForm>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Full Name",
    accessorKey: "full_name",
    cell: ({ row }) => (
      <div className="font-medium text-white">{row.getValue("full_name")}</div>
    ),
    size: 180,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Date & Time",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return (
        <div className="text-sm">
          <div className="text-primary">{date.toLocaleDateString()}</div>
          <div className="text-muted-foreground">{date.toLocaleTimeString()}</div>
        </div>
      )
    },
    size: 150,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.getValue("status") === "pending" 
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            : "bg-green-100 text-green-800 hover:bg-green-200"
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
    size: 120,
    filterFn: statusFilterFn,
  },
  {
    header: "Message",
    accessorKey: "message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string
      const truncated = message.length > 15 ? `${message.substring(0, 15)}...` : message
      return (
        <div className="max-w-[150px] text-white" title={message}>
          <span className="text-sm">{truncated}</span>
        </div>
      )
    },
    size: 180,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} data={data} setData={setData} />,
    size: 60,
    enableHiding: false,
  },
]

export default function FormTable() {
  const id = useId()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const inputRef = useRef<HTMLInputElement>(null)

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "created_at",
      desc: true,
    },
  ])

  const [data, setData] = useState<ContactForm[]>([])
  useEffect(() => {
    async function fetchContactForms() {
      try {
        console.log('Fetching contact forms from API...')
        const res = await fetch('/api/contact-forms')
        console.log('API response status:', res.status)
        const data = await res.json()
        console.log('API response data:', data)
        setData(data)
        console.log('Data set to state:', data)
      } catch (error) {
        console.error('Error fetching contact forms:', error)
      }
    }
    fetchContactForms()
  }, [])

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const updatedData = data.filter(
      (item) => !selectedRows.some((row) => row.original.id === item.id)
    )
    setData(updatedData)
    table.resetRowSelection()
  }

  const columns = useMemo(() => createColumns(data, setData), [data, setData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  })

  // Get unique status values
  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("status")

    if (!statusColumn) return []

    const values = Array.from(statusColumn.getFacetedUniqueValues().keys())

    return values.sort()
  }, [table.getColumn("status")?.getFacetedUniqueValues()])

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("status")
    if (!statusColumn) return new Map()
    return statusColumn.getFacetedUniqueValues()
  }, [table.getColumn("status")?.getFacetedUniqueValues()])

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[]
    return filterValue ?? []
  }, [table.getColumn("status")?.getFilterValue()])

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[]
    const newFilterValue = filterValue ? [...filterValue] : []

    if (checked) {
      newFilterValue.push(value)
    } else {
      const index = newFilterValue.indexOf(value)
      if (index > -1) {
        newFilterValue.splice(index, 1)
      }
    }

    table
      .getColumn("status")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="space-y-3">
        {/* Search bar - always full width */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            {/* Filter by name or email */}
            <div className="relative">
              <Input
                id={`${id}-input`}
                ref={inputRef}
                className={cn(
                  "peer w-full ps-9 text-white",
                  Boolean(table.getColumn("full_name")?.getFilterValue()) && "pe-9"
                )}
                value={
                  (table.getColumn("full_name")?.getFilterValue() ?? "") as string
                }
                onChange={(e) =>
                  table.getColumn("full_name")?.setFilterValue(e.target.value)
                }
                placeholder="Filter by name or message..."
                type="text"
                aria-label="Filter by name or message"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <ListFilterIcon size={16} aria-hidden="true" />
              </div>
              {Boolean(table.getColumn("full_name")?.getFilterValue()) && (
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear filter"
                  onClick={() => {
                    table.getColumn("full_name")?.setFilterValue("")
                    if (inputRef.current) {
                      inputRef.current.focus()
                    }
                  }}
                >
                  <CircleXIcon size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          {/* Delete button - keep on same line on desktop */}
          <div className="hidden md:flex items-center gap-3">
            {table.getSelectedRowModel().rows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="ml-auto" variant="destructive">
                    <TrashIcon
                      className="-ms-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the selected items.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRows}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        
        {/* Controls row - filters and view options */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Filter by status */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="default">
                  <FilterIcon
                    className="-ms-1"
                    size={16}
                    aria-hidden="true"
                  />
                  Status
                  {selectedStatuses.length > 0 && (
                    <span className="bg-white text-primary -me-1 inline-flex h-5 max-h-full items-center rounded px-1 font-[inherit] text-[0.625rem] font-bold">
                      {selectedStatuses.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto min-w-36 p-3 bg-white" align="start">
                <div className="space-y-3">
                  <div className="text-muted-foreground text-xs font-medium">
                    Filters
                  </div>
                  <div className="space-y-3">
                    {uniqueStatusValues.map((value, i) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`${id}-${i}`}
                          checked={selectedStatuses.includes(value)}
                          onCheckedChange={(checked: boolean) =>
                            handleStatusChange(checked, value)
                          }
                        />
                        <Label
                          htmlFor={`${id}-${i}`}
                          className="flex grow justify-between gap-2 font-normal"
                        >
                          {value}{" "}
                          <span className="text-muted-foreground ms-2 text-xs">
                            {statusCounts.get(value)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {/* Toggle columns visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default">
                  <Columns3Icon
                    className="-ms-1"
                    size={16}
                    aria-hidden="true"
                  />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        onSelect={(event) => event.preventDefault()}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile delete button and additional controls */}
          <div className="flex md:hidden items-center gap-3 w-full justify-end">
            {table.getSelectedRowModel().rows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="ml-auto" variant="destructive">
                    <TrashIcon
                      className="-ms-1 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Delete
                    <span className="bg-white text-black -me-1 inline-flex h-5 max-h-full items-center rounded px-1 font-[inherit] text-[0.625rem] font-bold">
                      {table.getSelectedRowModel().rows.length}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                      aria-hidden="true"
                    >
                      <CircleAlertIcon className="opacity-80" size={16} />
                    </div>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete{" "}
                        {table.getSelectedRowModel().rows.length} selected{" "}
                        {table.getSelectedRowModel().rows.length === 1
                          ? "row"
                          : "rows"}
                        .
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRows}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault()
                              header.column.getToggleSortingHandler()?.(e)
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-amber-400"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="default"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50 border-primary text-white"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50 border-primary text-white"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="default"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

function RowActions({ 
  row, 
  data, 
  setData 
}: { 
  row: Row<ContactForm>
  data: ContactForm[]
  setData: React.Dispatch<React.SetStateAction<ContactForm[]>>
}) {
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState(row.original.full_name)
  const [email, setEmail] = useState(row.original.email)
  const [phone, setPhone] = useState(row.original.phone)
  const [message, setMessage] = useState(row.original.message)
  const [status, setStatus] = useState(row.original.status)

  const handleStatusChange = async () => {
    const newStatus = status === "pending" ? "completed" : "pending"
    console.log('Attempting to change status from', status, 'to', newStatus, 'for ID:', row.original.id)
    setStatus(newStatus)
    
    try {
      // Update in database
      const response = await fetch(`/api/contact-forms/${row.original.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      console.log('API response status:', response.status)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('API response data:', responseData)
        
        // Update local data state
        const updatedData = data.map(item => 
          item.id === row.original.id 
            ? { ...item, status: newStatus as "pending" | "completed" }
            : item
        )
        setData(updatedData)
        console.log(`Status successfully changed to ${newStatus} for ${fullName}`)
        console.log('Updated data:', updatedData)
      } else {
        const errorData = await response.json()
        console.error('Failed to update status in database:', errorData)
        // Revert local status if API call failed
        setStatus(row.original.status)
      }
    } catch (error) {
      console.error('Error updating status:', error)
      // Revert local status if API call failed
      setStatus(row.original.status)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/contact-forms/${row.original.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local data state
        const updatedData = data.filter(item => item.id !== row.original.id)
        setData(updatedData)
        console.log(`Contact form successfully deleted for ${fullName}`)
      } else {
        console.error('Failed to delete contact form from database')
      }
    } catch (error) {
      console.error('Error deleting contact form:', error)
    }
    setOpen(false)
  }

  const handleReply = () => {
    // Create Spark email link with recipient and subject
    const recipient = row.original.email
    const subject = "Coaching Inquiry"
    const sparkUrl = `readdle-spark://compose?to=${encodeURIComponent(recipient)}&subject=${encodeURIComponent(subject)}`
    
    // Open the Spark email link
    window.location.href = sparkUrl
    console.log(`Opening Spark email to ${recipient} with subject: ${subject}`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="default"
            className="shadow-none"
            aria-label="Edit item"
          >
            <EditIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Contact Form Details</DialogTitle>
          <DialogDescription>
            View and manage this contact form submission.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
              rows={4}
            />
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Label>Current Status</Label>
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  status === "pending" 
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                )}
              >
                {status}
              </Badge>
            </div>
          </div>

          {/* Created Date */}
          <div className="space-y-2">
            <Label>Submitted On</Label>
            <div className="text-sm text-muted-foreground">
              {new Date(row.original.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleReply} variant="outline">
              Reply
            </Button>
            <Button onClick={handleStatusChange} variant="secondary">
              Mark as {status === "pending" ? "Completed" : "Pending"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this contact form submission. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
