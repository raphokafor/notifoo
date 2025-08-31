import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import HeaderComponent from "@/components/header";

// Sample data based on the screenshot
const callboxActivities = [
  {
    id: 1,
    propertyName: "willowest",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "08/02/2023",
  },
  {
    id: 2,
    propertyName: "Willowest",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "04/30/2023",
  },
  {
    id: 3,
    propertyName: "Willowest",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "04/30/2023",
  },
  {
    id: 4,
    propertyName: "Willowest",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "04/29/2023",
  },
  {
    id: 5,
    propertyName: "Willowest",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "04/29/2023",
  },
  {
    id: 6,
    propertyName: "Willowest",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "04/29/2023",
  },
  {
    id: 7,
    propertyName: "Willowest",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "04/28/2023",
  },
  {
    id: 8,
    propertyName: "Willowest",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "04/17/2023",
  },
  {
    id: 9,
    propertyName: "Willowest",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "03/25/2023",
  },
  {
    id: 10,
    propertyName: "Willowest",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "03/24/2023",
  },
  {
    id: 11,
    propertyName: "Oakwood Manor",
    actionBy: "MANUAL",
    action: "Callbox Closed",
    dateTime: "03/20/2023",
  },
  {
    id: 12,
    propertyName: "Pine Ridge",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "03/15/2023",
  },
  {
    id: 13,
    propertyName: "Sunset Villa",
    actionBy: "MANUAL",
    action: "Access Granted",
    dateTime: "03/10/2023",
  },
  {
    id: 14,
    propertyName: "Maple Heights",
    actionBy: "AUTO",
    action: "Callbox Opened",
    dateTime: "03/05/2023",
  },
  {
    id: 15,
    propertyName: "Cedar Park",
    actionBy: "MANUAL",
    action: "Access Denied",
    dateTime: "02/28/2023",
  },
];

export default function CustomerHistoryClient() {
  return (
    <div>
      <HeaderComponent
        title="Your Property Callbox Activities"
        description="View all your property callbox activities"
      />
      <div className="container mx-auto p-6 space-y-6">
        <Card className="w-full h-[calc(100vh-200px)] flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
            <div className="overflow-hidden flex-1 flex flex-col">
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-slate-600 hover:bg-slate-600">
                    <TableHead className="text-white font-semibold py-4 px-6">
                      Property Name
                    </TableHead>
                    <TableHead className="text-white font-semibold py-4 px-6">
                      Action By
                    </TableHead>
                    <TableHead className="text-white font-semibold py-4 px-6">
                      Call Box Action
                    </TableHead>
                    <TableHead className="text-white font-semibold py-4 px-6 text-right">
                      Date/Time
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <div className="flex-1 overflow-y-auto">
                <Table>
                  <TableBody>
                    {callboxActivities.map((activity, index) => (
                      <TableRow
                        key={activity.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <TableCell className="font-medium py-4 px-6">
                          {activity.propertyName}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge
                            variant={
                              activity.actionBy === "AUTO"
                                ? "secondary"
                                : "outline"
                            }
                            className="font-semibold"
                          >
                            {activity.actionBy}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span
                            className={`font-medium ${
                              activity.action === "Callbox Opened"
                                ? "text-green-700"
                                : activity.action === "Callbox Closed"
                                ? "text-red-700"
                                : activity.action === "Access Granted"
                                ? "text-blue-700"
                                : activity.action === "Access Denied"
                                ? "text-red-700"
                                : "text-gray-700"
                            }`}
                          >
                            {activity.action}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right font-medium">
                          {activity.dateTime}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 mt-4">
          Showing {callboxActivities.length} activities
        </div>
      </div>
    </div>
  );
}
