'use client';

//import { OrderField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  BuildingOffice2Icon,
  DocumentCheckIcon,  
  UserIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ิีbutton';
import { createOrder } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function Form() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createOrder, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Order By */}
        <div className="mb-4">
          <label htmlFor="orderBy" className="mb-2 block text-sm font-medium">
            Order by
          </label>
          <div className="relative">
          <input
                id="orderBy"
                name="orderBy"                                
                placeholder="Enter your name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="order-error"
              />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          
          <div id="orderBy-error" aria-live="polite" aria-atomic="true">
            {state.errors?.orderBy &&
              state.errors.orderBy.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
          
        </div>
        
        {/* Order Description */}
        <div className="mb-4">
          <label htmlFor="orderDes" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="orderDes"
                name="orderDes"                
                placeholder="Enter order description"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="description-error"
              />
              <DocumentCheckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
           
          <div id="orderDes-error" aria-live="polite" aria-atomic="true">
            {state.errors?.orderDes &&
              state.errors.orderDes.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
          
        </div>

        {/* Order Area */}
        <div className="mb-4">
          <label htmlFor="orderArea" className="mb-2 block text-sm font-medium">
            Area
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="orderArea"
                name="orderArea"                
                placeholder="Enter order location"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="area-error"
              />
              <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
           
          <div id="orderArea-error" aria-live="polite" aria-atomic="true">
            {state.errors?.orderArea &&
              state.errors.orderArea.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
          
        </div>     
        
        
        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
         
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/orders"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Order</Button>
      </div>
    </form>
  );
}