import {useEffect, useState, useMemo, useRef, FC} from 'react';
import useData from './hooks/useData';
import useColumns from './hooks/useColumns';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FaCaretSquareUp, FaCaretSquareDown } from "react-icons/fa";
//@ts-ignore
import { useExportData } from 'react-table-plugins';
import Papa from 'papaparse';
import './App.css';

// interface BugProps {
//   name?: string;
//   date?: Date;
//   count: number;
//   children?: ReactNode;
// }

// const Bug = ({date, count, name, children} : {date: Date; count: number, name: string, children?: ReactNode}) => {
//   return (<div>{date}</div>)
// }

//https://randomuser.me/api/?results=20
const URL = 'https://randomuser.me/api/?';
const resultsPerPage = 20;
//page=1&results=20;

interface UserInfo{
  firstName: string;
  lastName: string;
  streetNumber: number;
  streetName: string;
  city: string;
  country: string;
  postcode: string;
  state: string;
  // [key: string] : string;
}
interface fetchData{
  info: object;
  results: Array<UserInfo>;
}

// interface userName{
//   first: string;
//   last: string;
// }

const flatternUserInfo: Function = (userInfo: any) : UserInfo => {
  const {name: {first: firstName, last: lastName}} = userInfo;
  const {location: {
        street:{
            number : streetNumber, 
            name: streetName
          }, 
        city, 
        state,
        country,
        postcode
      }
    } = userInfo;
    return {
      firstName,
      lastName,
      streetNumber,
      streetName,
      city,
      state,
      country,
      postcode
    }
} 

const flatternData : Function = (data : any) : Array<UserInfo> => {
  const flatternedData = data.map((userInfo: any) => flatternUserInfo(userInfo));
  return flatternedData;
}

const getTableHeaders : Function = (userInfos : Array<UserInfo>) : Array<string> => {
  const headers = Object.keys(userInfos[0] || {});
  return headers;
}


// const App: React.FC = (): JSX.Element => {
//   const [users, setUsers] = useState<Array<UserInfo>>([]);
//   // const [tableHeaders, setTableHeaders] = useState<Array<string>>([]);
//   const [sortingInfo, setSortingInfo] = useState<any>(null);
//   const [page, setPage] = useState<number>(1);

//   const hookData = useData();

//   const fetchUsers = useRef(() => {});

//   fetchUsers.current = async() => {
//     try{
//       const resp: Response = await fetch(URL + `page=${page}&results=${resultsPerPage}`);
//       const data: fetchData = await resp.json();
//       setUsers(flatternData(data.results));
//     }catch(err){
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchUsers.current();
//     // setTableHeaders(getTableHeaders(users));
//   }, [page, fetchUsers]);

//   // useEffect(() => {
//   //   setTableHeaders(getTableHeaders(users));
//   // }, [users]);
//   const handleSort = (header: string) : void => {
//     if(sortingInfo?.header === header){
//       setSortingInfo({header, accending: !sortingInfo.accending});
//     }else{
//       setSortingInfo({header, accending: true})
//     }
//   }
//   const sortedUsers = useMemo(() => {
//     const sortedUsers = [...users];
//     if(sortingInfo){
    
//       sortedUsers.sort((a,b) => {
//         const comprassion = a[sortingInfo.header as keyof UserInfo] > b[sortingInfo.header as keyof UserInfo].toString() ? 1 : -1;
//         return sortingInfo.accending ? comprassion : -comprassion;
//       })
//     }
//     return sortedUsers;
//   }, [users, sortingInfo])
  

//   const tableHeaders: Array<string> = getTableHeaders(users);
//   return (
//     <div className="App">
//       <table cellPadding={2}>
//         <thead>
//           <tr>
//             {
//               tableHeaders.map((header: string, idx: number) : JSX.Element => (<th key={idx} onClick={() => handleSort(header)}>{header}</th>))
//             }
//           </tr>
//         </thead>
//         <tbody>
//             {
//               sortedUsers.map((user : UserInfo, idx: number) : JSX.Element => {
//                 return (<tr key={idx}>
//                   {
//                     tableHeaders.map((header: string, idx: number) : JSX.Element => (
//                       <td>{user[header as keyof UserInfo]}</td>
//                 ))
//                   }
//                 </tr>)
//               })
//             }
//         </tbody>
//       </table>
//       <div style={{textAlign: 'center'}}>
//         {[...new Array(6)].map((btn, idx) => {
//           return <button onClick={() => setPage(idx + 1)}>{idx + 1}</button>
//         })}
//       </div>
//       {users.map((userInfo: UserInfo, idx: number) : JSX.Element => {
//         const {firstName, lastName, streetNumber} = userInfo;
//         return (<div key={idx}>{`${firstName} ${lastName} ${streetNumber}`}</div>)
//       })}
//     </div>
//   );
// }
//@ts-ignore
function getExportFileBlob({ columns, data }) {
  //@ts-ignore
  const headerNames = columns.map(col => col.exportValue);
  const csvString = Papa.unparse({ fields: headerNames, data });
  return new Blob([csvString], { type: "text/csv" });
}

const App: FC = () : JSX.Element => {

  const data = useData();
  const columns = useColumns();


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    //@ts-ignore
    page,
    //@ts-ignore
    canNextPage,
    //@ts-ignore
    canPreviousPage,
    //@ts-ignore
    previousPage,
    //@ts-ignore
    nextPage,
    //@ts-ignore
    pageOptions,
    //@ts-ignore
    state: {pageIndex, pageSize},
    //@ts-ignore
    exportData
  } = 
  //@ts-ignore
  useTable({columns, data, initialState: {pageSize: 10}, getExportFileBlob}, useSortBy, usePagination, useExportData)

  return (
    <div className="container">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                //@ts-ignore
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render("Header")}
                <span>
                  {
                    //@ts-ignore
                    column.isSorted ? column.isSortedDesc ? <FaCaretSquareUp /> : <FaCaretSquareDown /> : null
                  }
                </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          
          {//@ts-ignore
            page.map(row => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()}>
                {
                  //@ts-ignore
                row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <div>
          <button disabled={!canPreviousPage} onClick={() => previousPage()}>previous page</button>
          <button disabled={!canNextPage} onClick={() => nextPage()}>next page</button>
        </div>
        <div>Page {pageIndex + 1} of {pageOptions.length}</div>
        <div>
          <button onClick={() => exportData("csv")}>Export CSV</button>
        </div>
      </div>
    </div>
  );
}

export default App;
