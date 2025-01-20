'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TimelineDropdown({ onSelectTimeline }) {
  const [selectedTimeline, setSelectedTimeline] = useState('Last 24 Hours');

  const handleTimelineChange = (timeline) => {
    setSelectedTimeline(timeline);
    onSelectTimeline(timeline);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-4">
          {selectedTimeline}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleTimelineChange('Last 24 Hours')}>
          Last 24 Hours
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTimelineChange('Last Week')}>
          Last Week
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTimelineChange('Last Month')}>
          Last Month
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}