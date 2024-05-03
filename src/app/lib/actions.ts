'use server';

import { google } from 'googleapis';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Authenticate with Google API
const glAuth = google.auth.getClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
      "type": "service_account",
      "project_id": process.env.GOOGLE_PROJECT_ID,
      "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
      "private_key": process.env.GOOGLE_CLIENT_SECRET,
      "client_email": process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      "universe_domain": "googleapis.com"
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});



export async function getSheetValues() {
    // Authenticate with Google API
    const glAuth = await google.auth.getClient({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
          "type": "service_account",
          "project_id": process.env.GOOGLE_PROJECT_ID,
          "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
          "private_key": process.env.GOOGLE_CLIENT_SECRET,
          "client_email": process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          "universe_domain": "googleapis.com"
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  
    // Set up authenticated client
    const glSheets = google.sheets({ version: "v4", auth: glAuth });
  
    try {
      // Fetch values from Google Sheet
      const data = await glSheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:Z', // Example range
      });
  
      //return { data: data.data.values };
      const rows = data.data.values;
      return rows;     
      
    } catch (error) {
      console.error('Error fetching Google Sheet values:', error);
      throw error;
    }
  }

export async function getCardSheetValues() {

    // Get today's date in YYYY-MM-DD format
    const todayString = new Date().toISOString().split('T')[0];
    //console.log ('Today:', todayString);
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JavaScript months are zero-based
    const currentYear = today.getFullYear();

     // Authenticate with Google API
     const glAuth = await google.auth.getClient({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
          "type": "service_account",
          "project_id": process.env.GOOGLE_PROJECT_ID,
          "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
          "private_key": process.env.GOOGLE_CLIENT_SECRET,
          "client_email": process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          "universe_domain": "googleapis.com"
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

    // Set up authenticated client
    const glSheets = google.sheets({ version: "v4", auth: glAuth });
  
    try {
      // Fetch values from Google Sheet
      const data = await glSheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:Z', // Example range
      });
  
      //return { data: data.data.values };
      const rows = data.data.values;
      //return rows;

      if (!rows || rows.length === 0) {
        console.log('No data found.');
        return [];
      }
  
      // Count occurrences where column B equals "completed" for today
      const completedCount = rows.reduce((count, row) => {
      // Assuming column B is index 0 (zero-based index)
        if (row[7] === 'completed' && row[1] === todayString) { // Assuming today's date is in column A (index 1)
          count++;
        }
        return count;
      }, 0);

      // Count occurrences where column B equals "completed" for today
      const pendingCount = rows.reduce((count, row) => {
        // Assuming column B is index 0 (zero-based index)
          if (row[7] === 'pending' && row[1] === todayString) { // Assuming today's date is in column A (index 1)
            count++;
          }
          return count;
      }, 0);

      // Count occurrences where column B equals "completed" for today
      const todayCount = rows.reduce((count, row) => {
        // Assuming column B is index 0 (zero-based index)
          if (row[1] === todayString) { // Assuming today's date is in column A (index 1)
            count++;
          }
          return count;
      }, 0);

      // Count occurrences where column B equals "completed" for this month
    const completedMonthCount = rows.reduce((count, row) => {
      // Assuming column B is index 0 (zero-based index)
      if (row[7] === 'completed') {
        // Extract date from the row, assuming it's in the format 'YYYY-MM-DD'
        const rowDate = new Date(row[1]);
        const rowMonth = rowDate.getMonth() + 1; // JavaScript months are zero-based
        const rowYear = rowDate.getFullYear();
        
        // Check if the row's date matches the current month and year
        if (rowMonth === currentMonth && rowYear === currentYear) {
          count++;
        }
      }
      return count;
    }, 0);
  
      const dataValue =[{
        todayCompleted: completedCount,
        todayPending: pendingCount,
        todayOrder: todayCount,
        monthCompleted: completedMonthCount,
      }];     
      
      return dataValue;
    } catch (error) {
      console.error('Error fetching Google Sheet values:', error);
      throw error;
    }
}


const FormSchema = z.object({
  
  orderBy: z.string({
    invalid_type_error: 'Please enter your name.',
  }),
  orderDes: z.string({
    invalid_type_error: 'Please enter order description.',
  }),
  orderArea: z.string({
    invalid_type_error: 'Please enter location of work.',
  }),
  
});


//const CreateOrder = FormSchema.omit({ id: true, date: true});
//const UpdateOrder = FormSchema.omit({ date: true, id: true });

// This is temporary
export type State = {
  errors?: {
    orderBy?: string[];
    orderDes?: string[];
    orderArea?: string[];
  };
  message?: string | null;
};

export async function createOrder(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = FormSchema.safeParse({
    orderBy: formData.get('orderBy'),
    orderDes: formData.get('orderDes'),
    orderArea: formData.get('orderArea'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { orderBy, orderDes, orderArea } = validatedFields.data;
  //const amountInCents = amount * 100;
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const timeStr = date.toTimeString().slice(0,8);  

  // Authenticate with Google API
  const glAuth = await google.auth.getClient({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
        "type": "service_account",
        "project_id": process.env.GOOGLE_PROJECT_ID,
        "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
        "private_key": process.env.GOOGLE_CLIENT_SECRET,
        "client_email": process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        "universe_domain": "googleapis.com"
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  // Set up authenticated client
  const glSheets = google.sheets({ version: "v4", auth: glAuth });

  // Insert data into the database
  try {
      // Fetch values from Google Sheet
       await glSheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:Z', // Example range
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [dateStr, timeStr, orderDes, orderArea, orderBy]

          ]
        }  // takes the array created in the lines earlier
      });
    //return data;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/orders');
  redirect('/dashboard/orders');
}

export async function updateOrder(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = FormSchema.safeParse({
    orderBy: formData.get('orderBy'),
    orderDes: formData.get('orderDes'),
    orderArea: formData.get('orderArea'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Order.',
    };
  }

  const { orderBy, orderDes, orderArea } = validatedFields.data;
  
  try {
    
  } catch (error) {
    return { message: 'Database Error: Failed to Update Order.' };
  }

  revalidatePath('/dashboard/orders');
  redirect('/dashboard/orders');
}

export async function deleteOrder(id: string) {
  // throw new Error('Failed to Delete Invoice');

  try {
    
    revalidatePath('/dashboard/orders');
    return { message: 'Deleted Order' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Order.' };
  }
}

export async function fetchFilteredOrders() {
  // Authenticate with Google API
  const glAuth = await google.auth.getClient({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
        "type": "service_account",
        "project_id": process.env.GOOGLE_PROJECT_ID,
        "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
        "private_key": process.env.GOOGLE_CLIENT_SECRET,
        "client_email": process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        "universe_domain": "googleapis.com"
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

  // Set up authenticated client
  const glSheets = google.sheets({ version: "v4", auth: glAuth });

  try {
    // Fetch values from Google Sheet
    const data = await glSheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:Z', // Example range
    });

    //return { data: data.data.values };
    const rows = data.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return [];
    }

    let orderData = [];

    for(var i=1; i<rows.length; i++){
      orderData.push({
        id: rows[i][0],
        date: rows[i][1],
        time: rows[i][2],
        order: rows[i][3],
        area: rows[i][4],
        by: rows[i][5],
        status: rows[i][7],

      })
    }
    
    return orderData;  
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
  