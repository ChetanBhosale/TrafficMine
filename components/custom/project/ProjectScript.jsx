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
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
  
  export default function ProjectScript({ children, project }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Project Script</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="mb-4 text-gray-600">
                Use the script below to integrate tracking functionality into your project. 
                Paste it inside the <code>{`<head>`}</code> or <code>{`<body>`}</code> of your HTML file for proper setup.
              </span>
              <Textarea
                className="mt-4 bg-gray-100 text-sm rounded-md border-gray-300"
                value={`<script src="${process.env.NEXT_PUBLIC_BASE_URL}/tracker.js?projectId=${project.id}" async></script>`}
                rows={5}
                readOnly
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                navigator.clipboard.writeText(
                  `<script src="${process.env.NEXT_PUBLIC_BASE_URL}/tracker.js?projectId=${project.id}" async></script>`
                );
                toast.success("Copied to clipboard!");
              }}
            >
              Copy to Clipboard
            </AlertDialogAction>
          </AlertDialogFooter>
          <div className="mt-4 text-sm text-gray-500">
            <strong>Help : </strong> 
            If you encounter any issues:
            <ul className="list-disc pl-5">
              <li>
                Ensure the <code>{`projectId`}</code> matches your current project.
              </li>
              <li>
                Add the script to all pages you wish to track.
              </li>
              <li>
                Contact support if the tracker doesn't appear to function.
              </li>
            </ul>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  