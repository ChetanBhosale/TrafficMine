import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

export default function ProjectScript({ children, project }) {
  const [framework, setFramework] = useState("html");

  const scriptContent = {
    html: `<script src="${process.env.NEXT_PUBLIC_BASE_URL}/tracker.js?projectId=${project.id}" async></script>`,
    react: `import { useEffect } from 'react';

function Analytics() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "${process.env.NEXT_PUBLIC_BASE_URL}/tracker.js?projectId=${project.id}";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}

// Add to your App.js or main layout component
export default function App() {
  return (
    <>
      <Analytics />
      {/* Your app content */}
    </>
  );
}`,
    nextjs: `import Script from 'next/script'

// Add to your _app.js/tsx or layout.js/tsx
export default function RootLayout({ children }) {
  return (
    <>
      <Script
        src="${process.env.NEXT_PUBLIC_BASE_URL}/tracker.js?projectId=${project.id}"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}`
  };

  const helpContent = {
    html: [
      "Add the script tag in the <head> or at the end of the <body> tag",
      "Make sure to add it to all pages you want to track",
      "The script will automatically start tracking once loaded"
    ],
    react: [
      "Copy the Analytics component to a new file (e.g., components/Analytics.js)",
      "Import and add the Analytics component to your root App component",
      "The script will handle cleanup on component unmount"
    ],
    nextjs: [
      "Add the Script component to your root layout or _app file",
      "The 'afterInteractive' strategy ensures proper loading",
      "Works automatically with Next.js client-side navigation"
    ]
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Project Script</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="mb-4">
              <label className="text-sm font-medium">Select Framework:</label>
              <Select
                value={framework}
                onValueChange={setFramework}
              >
                <SelectTrigger className="w-[200px] mt-2">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="nextjs">Next.js</SelectItem>
                </SelectContent>
              </Select>
            </span>
            <span className="mb-4 block text-gray-600">
              Integration code for {framework.toUpperCase()}:
            </span>
            <Textarea
              className="mt-4 bg-gray-100 text-sm font-mono rounded-md border-gray-300"
              value={scriptContent[framework]}
              rows={framework === 'html' ? 3 : 12}
              readOnly
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              navigator.clipboard.writeText(scriptContent[framework]);
              toast.success("Copied to clipboard!");
            }}
          >
            Copy to Clipboard
          </AlertDialogAction>
        </AlertDialogFooter>
        <div className="mt-4 text-sm text-gray-500">
          <strong>Installation Steps:</strong>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {helpContent[framework].map((help, index) => (
              <li key={index}>{help}</li>
            ))}
          </ul>
          <div className="mt-4">
            <strong>Troubleshooting:</strong>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Verify that your projectId ({project.id}) is correct</li>
              <li>Check the browser console for any error messages</li>
              <li>Ensure your website can make requests to our tracking endpoint</li>
              <li>Allow a few minutes for data to appear in your dashboard</li>
            </ul>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}