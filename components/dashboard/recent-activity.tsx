"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

interface ActivityItem {
  id: number;
  type: string;
  patient: string;
  staff: string;
  time: string;
  status: "completed" | "pending" | "overdue";
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <TrendingUp className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
          >
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {activity.type}
              </p>
              <p className="text-xs text-slate-600">{activity.patient}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500">
                  by {activity.staff}
                </span>
                <Badge
                  className={getStatusColor(activity.status)}
                  variant="secondary"
                >
                  {activity.status}
                </Badge>
              </div>
              <span className="text-xs text-slate-400">{activity.time}</span>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-4">
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}
