'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { Activity, CheckCircle, FolderGit2 } from 'lucide-react'

export function CreateNewCard() {
  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Create New</p>
            <Button 
            //   onClick={onCreateClick}
              className="mt-2 bg-white/10 hover:bg-white/20 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
            <Plus className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export function StatsCard({ iconName, label, value, gradient }) {
  const IconComponent = {
    'FolderGit2': FolderGit2,
    'Activity': Activity,
    'CheckCircle': CheckCircle
  }[iconName] || FolderGit2;

  return (
    <Card className={`relative overflow-hidden ${gradient}`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      </div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">{label}</p>
            <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
          </div>
          <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
            <IconComponent className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </Card>
  )
}
