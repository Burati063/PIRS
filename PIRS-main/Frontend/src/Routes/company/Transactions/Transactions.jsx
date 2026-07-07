import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
const apiKey = import.meta.env.VITE_API_URL
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'payment', headerName: 'Payment', width: 130 },
  { field: 'dateTime', headerName: 'Date Time', width: 130 },
  { field: 'reportId', headerName: 'Report ID', width: 130 },
  { field: 'companyId', headerName: 'Company ID', width: 130 },
  { field: 'contractorId', headerName: 'Contractor ID', width: 130 },
];

export default function Transactions({ companyId }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`${apiKey}/Transaction/GetAllByCompany/${companyId}`)
      .then(response => response.json())
      .then(data => setTransactions(data));
  }, [companyId]);

  return (
    <div style={{ height: 400, width: '80vw' }}>
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