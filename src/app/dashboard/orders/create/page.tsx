import { fetchCustomers } from '@/app/lib/data';
import Form from '@/app/ui/orders/create-form';
import Breadcrumbs from '@/app/ui/orders/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Order',
};

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/orders' },
          {
            label: 'Create Order',
            href: '/dashboard/orders/create',
            active: true,
          },
        ]}
      />
      <Form/>
    </main>
  );
}