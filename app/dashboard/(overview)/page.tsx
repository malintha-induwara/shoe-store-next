import { Suspense } from "react";
import CardWrapper from "@/app/ui/dashboard/card-wrapper";
import { BestSellersSkeleton, CardsSkeleton, RevenueChartSkeleton } from "@/app/ui/dashboard/skeletons";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import BestSellers from "@/app/ui/dashboard/best-sellers";

export default function Page() {
  return (
    <div className="p-4 lg:p-7 bg-gray-50 h-screen-[calc(100vh-4rem)] overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid gap-6 mb-6">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm">
          <Suspense fallback={<RevenueChartSkeleton />}>
            <RevenueChart />
          </Suspense>
        </div>
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <Suspense fallback={<BestSellersSkeleton />}>
            <BestSellers />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
