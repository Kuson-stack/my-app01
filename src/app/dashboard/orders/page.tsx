

//import { getCardSheetValues } from "@/app/lib/actions";
//import { Button } from "@/app/ui/ิีbutton";
import { Metadata } from 'next';
import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { CreateOrder } from '@/app/ui/orders/buttons';
import Table from '@/app/ui/orders/table';


export const metadata: Metadata = {
  title: 'Orders',
};

export default async function Page() {
 
 

  return (
    <>
     <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Orders</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search orders..." />
        <CreateOrder/>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        
        <Table/>
      </div>
     
    </div>
      
    </>
  ) 
}