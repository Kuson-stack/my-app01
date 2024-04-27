
"use client";
import { getCountCompletedSheet } from "@/app/lib/actions";
import { Button } from "@/app/ui/ิีbutton";


export default function Page() {

  const handleOnGetSheetDataClick = async () => {
    const response = await getCountCompletedSheet();
    console.log(response)
  };

  return <Button onClick={handleOnGetSheetDataClick}>Get Sheet Data</Button>;
}