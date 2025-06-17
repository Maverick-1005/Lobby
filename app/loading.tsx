import { Loader2 } from "lucide-react";

// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold"><Loader2 className="animate-spin h-14 w-14"/></h1>
    </div>
  );
}
