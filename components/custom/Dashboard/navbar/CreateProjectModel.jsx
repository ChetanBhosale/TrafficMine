'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import toast from "react-hot-toast"
import { FaSpinner } from "react-icons/fa"
import { useRouter } from "next/navigation"

const CreateProjectModel = ({ isOpen, setOpen }) => {
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const Router = useRouter()
  const [errors, setErrors] = useState({ title: "", link: "" })

  const validateForm = () => {
    let isValid = true
    const newErrors = { title: "", link: "" }

    if (!title.trim()) {
      newErrors.title = "Project title is required."
      isValid = false
    }

    if (!link.trim() || !link.startsWith("https://")) {
      newErrors.link = "Link must start with https://."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    let toastLoad = toast.loading('Creating project...')
    setLoading(true)
    if (validateForm()) {
      let createProject = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: title, webUrl: link })
      })

      if (createProject.status === 200) {
        toast.success("Project created successfully!")
        setOpen(false) 
        toast.dismiss(toastLoad)
        setLoading(false)
        Router.refresh()
        return
      }

      toast.error(createProject?.message || "Failed to create Project, please try again later!")
    } else {
      toast.error("Please fill all the fields")
    }
    setLoading(false)
    toast.dismiss(toastLoad)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Provide a project title and a valid link. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Title Field */}
          <div>
            <Label htmlFor="title" className="mb-2 block text-sm font-medium ">
              Project Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="w-full"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Link Field */}
          <div>
            <Label htmlFor="link" className="mb-2 block text-sm font-medium">
              Project Live Link
            </Label>
            <Input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter project link (e.g., https://example.com)"
              className="w-full"
            />
            {errors.link && (
              <p className="text-red-500 text-sm mt-1">{errors.link}</p>
            )}
          </div>
        </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full dark:text-white flex items-center justify-center"
          >
            {loading && <FaSpinner className="animate-spin" />}
            {loading ? 'Creating Project' : 'Save changes'}
          </Button>
      </DialogContent>
    </Dialog>
  )
}

export default CreateProjectModel
