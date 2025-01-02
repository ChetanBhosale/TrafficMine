import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { baseUrl } from '@/constants/server';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreateProject({ children, setOpen, open, onProjectCreated }) {
  const [formValues, setFormValues] = useState({
    projectName: '',
    webUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (formValues.projectName.trim().length < 3) {
      newErrors.projectName = 'Project name must be at least 3 characters long';
    }

    if (!formValues.webUrl.trim()) {
      newErrors.webUrl = 'Web URL is required';
    } else if (!/^(https?:\/\/)?([a-zA-Z0-9.-]+)(\.[a-zA-Z]{2,})(\/.*)?$/.test(formValues.webUrl)) {
      newErrors.webUrl = 'Please enter a valid URL (e.g., www.example.com)';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async () => {
    const toastLoader = toast.loading('Creating project...');
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const sanitizedFormValues = { ...formValues };

      // Ensure webUrl starts with https://
      // if (!sanitizedFormValues.webUrl.startsWith('https://') && sanitizedFormValues.webUrl.startsWith('www') && !sanitizedFormValues.webUrl.startsWith('http://')) {
      //   sanitizedFormValues.webUrl = `https://${sanitizedFormValues.webUrl}`;
      // }

      try {
        const response = await axios.post(`${baseUrl}/project`, sanitizedFormValues);

        if(response.status === 200){
          toast.success('Project created successfully!');
          setOpen(false);
          onProjectCreated();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        toast.error(message);
      }

    } else {
      console.log(errors);
    }
    setLoading(false);
    toast.dismiss(toastLoader);
  };

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md p-6 rounded-lg bg-white shadow-lg dark:bg-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Create New Project
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="flex flex-col gap-6 mt-4">
              <span>
                <Label className="text-gray-700 dark:text-gray-300">Project Name</Label>
                <Input
                  name="projectName"
                  value={formValues.projectName}
                  onChange={handleChange}
                  className="mt-2 w-full border rounded-md px-4 py-2 text-gray-700 dark:text-gray-200 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your project name"
                />
                {errors.projectName && (
                  <span className="mt-1 text-red-500 text-sm">{errors.projectName}</span>
                )}
              </span>
              <span>
                <Label className="text-gray-700 dark:text-gray-300">Web URL</Label>
                <Input
                  name="webUrl"
                  value={formValues.webUrl}
                  onChange={handleChange}
                  className="mt-2 w-full border rounded-md px-4 py-2 text-gray-700 dark:text-gray-200 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your web URL (e.g., www.example.com)"
                />
                {errors.webUrl && (
                  <span className="mt-1 text-red-500 text-sm">{errors.webUrl}</span>
                )}
              </span>
              <AlertDialogFooter className="flex justify-end gap-3 mt-6">
                <AlertDialogCancel asChild>
                  <Button disabled={loading} className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <Button disabled={loading} onClick={handleSubmit}>Create</Button>
              </AlertDialogFooter>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
