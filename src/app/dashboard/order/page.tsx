
"use client";
import { getCardSheetValues } from "@/app/lib/actions";
import { Button } from "@/app/ui/ิีbutton";



export default function Page() {
  
  const handleOnGetSheetDataClick = async () => {
    const response = await getCardSheetValues();
    console.log(response)
  };

  return (
    <>
      <Button onClick={handleOnGetSheetDataClick}>Get Sheet Data</Button>;
    </>
  ) 
}