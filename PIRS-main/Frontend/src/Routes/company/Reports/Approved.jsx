import Reports from "./Reports";
export default function Approved({companyId}){
    return <Reports companyId={companyId} reportStatus={3}/>
}