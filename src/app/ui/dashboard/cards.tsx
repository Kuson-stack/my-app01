import {
    HandThumbUpIcon,
    WrenchScrewdriverIcon,
    ClockIcon,
    CalendarIcon,    
  } from '@heroicons/react/24/outline';
  import { lusitana } from '@/app/ui/fonts';
  import { getCountCompletedSheet } from '@/app/lib/actions';
  //import { useEffect, useState } from 'react';
  //import { fetchCardData } from '@/app/lib/data';
  
  const iconMap = {
    completed: HandThumbUpIcon,
    order_day: ClockIcon,
    pending: WrenchScrewdriverIcon,
    order_week: CalendarIcon,
  };
  
  export default async function CardWrapper() {    
   /**  
    const completedCount = await getCountCompletedSheet();**/

    const completedCount = 100;    
    const pendingCount = 100;
    const todayCount = 100;
    const completedMonthCount = 100;
  
    return (
      <>
        <Card 
            title="Completed" 
            value={completedCount}
            type="completed" 
        />
        <Card 
            title="Pending" 
            value={pendingCount} 
            type="pending" 
        />
        <Card 
            title="Total Orders of day" 
            value={todayCount} 
            type="order_day" 
        />
        <Card
          title="Total Order of month"
          value={completedMonthCount}
          type="order_week"
        />
      </>
    );
  }
  
  export function Card({
    title,
    value,
    type,
  }: {
    title: string;
    value: number | string;
    type: 'order_week' | 'order_day' | 'pending' | 'completed';
  }) {
    const Icon = iconMap[type];
  
    return (
      <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
        <div className="flex p-4">
          {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
          <h3 className="ml-2 text-sm font-medium">{title}</h3>
        </div>
        <p
          className={`${lusitana.className}
            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          {value}
        </p>
      </div>
    );
  }