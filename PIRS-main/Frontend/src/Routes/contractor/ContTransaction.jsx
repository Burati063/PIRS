import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const apiKey = import.meta.env.VITE_API_URL

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'payment', headerName: 'Payment', width: 150 },
  { field: 'dateTime', headerName: 'Date Time', width: 150 },
  { field: 'reportId', headerName: 'Report ID', width: 150 },
  { field: 'companyId', headerName: 'Company ID', width: 150 },
  { field: 'contractorId', headerName: 'Contractor ID', width: 150 },
];

export default function contTransaction({ contractorId }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`${apiKey}/Transaction/GetAllByContractor/${localStorage.getItem('userId')}`)
      .then(response => response.json())
      .then(data => setTransactions(data));
      console.log(transactions);
  }, [contractorId]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={transactions}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
