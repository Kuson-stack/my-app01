"use client";
import { fetchFilteredOrders } from "@/app/lib/actions";
import { Button } from "@/app/ui/ิีbutton";


export default function Page() {

  const handleOnGetSheetDataClick = async () => {
    const response = await fetchFilteredOrders();
    console.log(response)
  };

  return <Button onClick={handleOnGetSheetDataClick}>Get Sheet Data</Button>;
}