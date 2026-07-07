
import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
const apiKey = import.meta.env.VITE_API_URL

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'userName', headerName: 'Username', width: 130 },
  { field: 'email', headerName: 'Email', width: 130 },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 130 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];



export default function Contractors() {
    const [contractors,setContractors] = useState([{ id: '1', userName: 'user1', email: 'user1@example.com', phoneNumber: '1234567890', firstName: 'John', lastName: 'Doe' }])
    let rows = [{ id: '1', userName: 'user1', email: 'user1@example.com', phoneNumber: '1234567890', firstName: 'John', lastName: 'Doe' }]
    useEffect(()=>{fetch(`${apiKey}/User/users-with-roles?roleName=Contractor`)
    .then(response=>response.json())
    .then((data)=>{setContractors(data) ;
         rows = data.map((c)=>{return { id: c.user.id, userName: c.user.userName, email: c.user.email, phoneNumber: c.user.phoneNumber, firstName: c.user.firstName, lastName: c.user.lastName}})
         setContractors(rows)
    })})
    
    // let rows = contractors.map((c)=>{return { id: c.id, userName: c.userName, email: c.email, phoneNumber: c.phoneNumber, firstName: c.firstName, lastName: c.lastName}})
  return (
    <div style={{ height: 400, width: '80vw' }}>
      <DataGrid
        rows={contractors}
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