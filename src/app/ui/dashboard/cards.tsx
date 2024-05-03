import {
  HandThumbUpIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  CalendarIcon,    
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import {  getCardSheetValues } from '@/app/lib/actions';
import { json } from 'stream/consumers';
  
const iconMap = {
  completed: HandThumbUpIcon,
  order_day: ClockIcon,
  pending: WrenchScrewdriverIcon,
  order_week: CalendarIcon,
};

export default async function CardWrapper() {    
  
  const cardValue = await getCardSheetValues(); 

  return (
    <>
     
      <Card 
          title="Completed" 
          value= "todayCompleted"
          type="completed" 
      />      
      
      <Card 
          title="Pending" 
          value= 'todayPending' 
          type="pending" 
      />

      
      <Card 
          title="Total Orders of day" 
          value= 'todayOrder' 
          type="order_day" 
      />     

          <Card
          title="Total Order of month"
          value= 'monthCompleted' 
          type="order_week"
        />
        
      </>
    );
  }
  
  export async function Card({
    title,
    value,
    type,
  }: {
    title: string;
    value: 'todayCompleted' | 'todayPending' | 'todayOrder' | 'monthCompleted';
    type: 'order_week' | 'order_day' | 'pending' | 'completed';
  }) {
    const Icon = iconMap[type];
    const data = await getCardSheetValues(); 
    const cardData = {
        todayCompleted: 0,
        todayPending: 0,
        todayOrder: 0,
        monthCompleted: 0,
    };

    const [{ 
      todayCompleted: completedCount,
      todayPending: pendingCount,
      todayOrder: todayCount,
      monthCompleted: completedMonthCount,
  }] = data;

    
    //const dataValue = itemCard[value];
    
    //const itemCard = cardData[value];
    //const itemCard = data[0].map((item) => item);    
    //console.log(itemCard);
    // Assign the values to cardData properties
    cardData.todayCompleted = completedCount;
    cardData.todayPending = pendingCount;
    cardData.todayOrder = todayCount;
    cardData.monthCompleted = completedMonthCount;
    //console.log(cardData);
    const dataValue = cardData[value];

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
          {dataValue ? dataValue : null}
        </p>
        
      </div>
      
    );
  }