import React from 'react';
import Dashboard from './Dashboard';
import { getSalesRanking } from '@/app/api/salesservice/salesapi';

export default async function DashboardPage() {
  const rankingData = await getSalesRanking();
  const sortedSales = rankingData.products.sort((a, b) => b.saleQuantity - a.saleQuantity);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="w-full">
        <Dashboard initialSales={sortedSales} />
      </div>
    </div>
  );
}