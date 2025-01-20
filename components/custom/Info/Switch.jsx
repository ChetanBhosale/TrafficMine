import { Switch } from '@/components/ui/switch'; // Assuming you're using shadcn/ui

const [showUniqueVisitors, setShowUniqueVisitors] = useState(false);

const handleToggle = () => {
  setShowUniqueVisitors(!showUniqueVisitors);
};

<div className="mt-4 flex items-center">
  <Switch checked={showUniqueVisitors} onCheckedChange={handleToggle} />
  <span className="ml-2 text-sm text-gray-600">
    {showUniqueVisitors ? 'Showing Unique Visitors' : 'Showing All Visitors'}
  </span>
</div>