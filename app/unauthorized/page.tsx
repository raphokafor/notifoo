import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Access Denied</CardTitle>
          <p className="text-slate-600">You don't have permission to access this resource</p>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-slate-500 mb-6">
            Please contact your administrator if you believe this is an error.
          </p>
          <Link href="/dashboard">
            <Button className="w-full h-12">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
