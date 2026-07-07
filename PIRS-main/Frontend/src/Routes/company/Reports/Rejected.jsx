import Reports from "./Reports";
export default function Rejected({companyId}){
    return <Reports companyId={companyId} reportStatus={4}/>
}