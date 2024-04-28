'use server';

import { google } from 'googleapis';

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
        if (row[6] === 'completed' && row[0] === todayString) { // Assuming today's date is in column A (index 1)
          count++;
        }
        return count;
      }, 0);

      // Count occurrences where column B equals "completed" for today
      const pendingCount = rows.reduce((count, row) => {
        // Assuming column B is index 0 (zero-based index)
          if (row[6] === 'pending' && row[0] === todayString) { // Assuming today's date is in column A (index 1)
            count++;
          }
          return count;
      }, 0);

      // Count occurrences where column B equals "completed" for today
      const todayCount = rows.reduce((count, row) => {
        // Assuming column B is index 0 (zero-based index)
          if (row[0] === todayString) { // Assuming today's date is in column A (index 1)
            count++;
          }
          return count;
      }, 0);

      // Count occurrences where column B equals "completed" for this month
    const completedMonthCount = rows.reduce((count, row) => {
      // Assuming column B is index 0 (zero-based index)
      if (row[6] === 'completed') {
        // Extract date from the row, assuming it's in the format 'YYYY-MM-DD'
        const rowDate = new Date(row[0]);
        const rowMonth = rowDate.getMonth() + 1; // JavaScript months are zero-based
        const rowYear = rowDate.getFullYear();
        
        // Check if the row's date matches the current month and year
        if (rowMonth === currentMonth && rowYear === currentYear) {
          count++;
        }
      }
      return count;
    }, 0);
  
      return {
        completedCount,
        pendingCount,
        todayCount,
        completedMonthCount,
      };
      
    } catch (error) {
      console.error('Error fetching Google Sheet values:', error);
      throw error;
    }
}

export async function CountCompletedToday() {

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

    // Get today's date in YYYY-MM-DD format
    const todayString = new Date().toISOString().split('T')[0];

    // Count occurrences where column B equals "completed" for today
    const completedCount = rows.reduce((count, row) => {
    // Assuming column B is index 0 (zero-based index)
      if (row[6] === 'completed' && row[0] === todayString) { // Assuming today's date is in column A (index 1)
        count++;
      }
      return count;
    }, 0);    

    return completedCount;
    
  } catch (error) {
    console.error('Error fetching Google Sheet values:', error);
    throw error;
  }
}

export async function CountPendingToday() {

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

    // Get today's date in YYYY-MM-DD format
    const todayString = new Date().toISOString().split('T')[0];

    // Count occurrences where column B equals "completed" for today
    const pendingCount = rows.reduce((count, row) => {
    // Assuming column B is index 0 (zero-based index)
      if (row[6] === 'pending' && row[0] === todayString) { // Assuming today's date is in column A (index 1)
        count++;
      }
      return count;
    }, 0);    

    return pendingCount;
    
  } catch (error) {
    console.error('Error fetching Google Sheet values:', error);
    throw error;
  }
}

export async function CountOrderToday() {

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

    // Get today's date in YYYY-MM-DD format
    const todayString = new Date().toISOString().split('T')[0];

    // Count occurrences where column B equals "completed" for today
    const orderCount = rows.reduce((count, row) => {
    // Assuming column B is index 0 (zero-based index)
      if (row[0] === todayString) { // Assuming today's date is in column A (index 1)
        count++;
      }
      return count;
    }, 0);    

    return orderCount;
    
  } catch (error) {
    console.error('Error fetching Google Sheet values:', error);
    throw error;
  }
}

export async function CountCompletedMonth() {

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

    // Get today's date in YYYY-MM-DD format
    //const todayString = new Date().toISOString().split('T')[0];
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JavaScript months are zero-based
    const currentYear = today.getFullYear();


    // Count occurrences where column B equals "completed" for today
    const monthCount = rows.reduce((count, row) => {
    // Assuming column B is index 0 (zero-based index)
    if (row[6] === 'completed') {
      // Extract date from the row, assuming it's in the format 'YYYY-MM-DD'
      const rowDate = new Date(row[0]);
      const rowMonth = rowDate.getMonth() + 1; // JavaScript months are zero-based
      const rowYear = rowDate.getFullYear();
      
      // Check if the row's date matches the current month and year
      if (rowMonth === currentMonth && rowYear === currentYear) {
        count++;
      }
    }
    return count;
  }, 0);

    return monthCount;
    
  } catch (error) {
    console.error('Error fetching Google Sheet values:', error);
    throw error;
  }
}
  
  