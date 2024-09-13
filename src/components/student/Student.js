import React, { useEffect, useState } from 'react'
import { Alert, Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getAlll, deleteStudent, addStudent, resetStatusAndMessage, editStudent ,searchByName,searchByYear,searchStudentsXepLoai,searchAll} from '../../redux/studentSlice';
import ReactPaginate from 'react-paginate';
export default function Student() {
    const [currentPage, setCurrentPage] = useState(0)
    const [localMessage, setLocalMessage] = useState("")
    const [localStatus, setLocalStatus] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    const limit = 5
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAlll({ currentPage, limit }))
    }, [currentPage])
    const { totalPages, students } = useSelector((state) => state.student)
    console.log(students)
    const handlePageClick = (event) => {
        setCurrentPage(event.selected)
    }
    const handleDelete = (studentId) => {
        dispatch(deleteStudent(studentId));
    };
    const [modal, setModal] = useState(false);

    const toggle = () => {

        setModal(!modal)
        if (modal) {
            dispatch(resetStatusAndMessage)
        }
    };

    const [student, setStudent] = useState({
        "name": "awaQQQw111ttttestt",
        "thanhPho": "bbbbbbbbbbbbbbbbbbb",
        "xepLoai": "Giỏi",
        "ngaySinh": ""
    })
    const handlechange = (e) => {
        const { name, value } = e.target;
        if (name == 'ngaySinh') {

            setStudent(preStudent => (
                {
                    ...preStudent,
                    [name]: convertDateToDDMMYYYY(value)
                }
            ))
        }
        else {
            setStudent(preStudent => (
                {
                    ...preStudent,
                    [name]: value
                }
            ))
        }

    }

    const handleAdd = () => {

        console.log("trên hàm add " +  convertDateToYYYYMMDD( student.ngaySinh))
        const updatedStudentArray = 
            {
                ...student,
                ngaySinh: convertDateToYYYYMMDD(student.ngaySinh)
            }
        ;
        dispatch(addStudent(updatedStudentArray));
    };

    const status = useSelector(state => state.student.status)
    const message = useSelector(state => state.student.message)
    const error = useSelector(state => state.student.error)
    // useEffect(()=>{
    //     if(status==200){
    //         setLocalStatus(status)
    //         setLocalMessage(message)
    //         setShowMessage(true)
    //         const timer=setTimeout(()=>{
    //             setShowMessage(false);
    //         },4000)
    //         return ()=>clearTimeout(timer)
    //     }
    // },[status,message])
    useEffect(() => {
        if (status && message) {
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
                dispatch(resetStatusAndMessage())
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [status, message, dispatch])

    useEffect(() => {
        if (status) {
            if (status === 200) {
                toast.success(message)
                setModal(false)//đóng modal khí thêm thành công
            }
            else {

                toast.error(message)
            }
        }
    }, [status, message])
    console.log(message)
    //hàm sửa của thầy
    const XepLoaiEnum = {
        Gioi: "Giỏi",
        Kha: "Khá",
        TRUNG_BINH: "Trung Bình",
        YEU: "Yếu"
    };
    const convertToValue = (enumCode) => {
        switch (enumCode) {
            case "Gioi":
                return XepLoaiEnum.Gioi;
            case "Kha":
                return XepLoaiEnum.Kha;
            case "TRUNG_BINH":
                return XepLoaiEnum.TRUNG_BINH;
            case "YEU":
                return XepLoaiEnum.YEU;
            default:
                return enumCode;
        }
    };

    const [EStudent, setEStudent] = useState({ "id": "", "name": "", "thanhPho": "", ngaySinh: "", xepLoai: "" })
    const [studentEdit, setStudentEdit] = useState({ isEdit: false, id: "" })
    const handle_edit = (id, item) => {
        setStudentEdit({ isEdit: true, id })
        setEStudent(item)

    }
    const handle_save = (id) => {
        console.log(EStudent.ngaySinh)
console.log(convertDateToYYYYMMDD( EStudent.ngaySinh))
        dispatch(editStudent({
            
            id,
            student: {
                ...EStudent,
                ngaySinh:  EStudent.ngaySinh, // Sử dụng định dạng YYYY-MM-DD
                xepLoai: EStudent.xepLoai // Sử dụng giá trị phù hợp với enum
            }

        })


        );
        setStudentEdit({ isEdit: false, id: "" })

    }
    const convertDateToYYYYMMDD = (date) => {

        const [day, month, year] = date.split('-');
      
        return `${year}-${month}-${day}`;
    };

    const convertDateToDDMMYYYY = (date) => {
        const [year, month, day] = date.split('-');
       
        return `${day}-${month}-${year}`;
    };
    //nên search bằng server cho nhanh nếu có admin khác
    const [searchTerm,setSearchTerm]=useState('');
    // const filteredStudents=(students ||[]).filter(student =>
    //     student.name.toLowerCase().includes(searchTerm.toLowerCase())
    // )
    const [nameSearch,setNameSearch]=useState('');
    const handle_search_byname=()=>{
        dispatch(searchByName(nameSearch))
    }

    const[startYear,setStartYear]=useState(2022)
    const[endYear,setEndYear]=useState(2024)
    const handleSearchByYear=()=>{
        if(startYear&&endYear)
            dispatch(searchByYear({startYear,endYear}))
    }

    const[searchXepLoai,setSearchXepLoai]=useState({"xepLoai":"Giỏi"})
    useEffect(()=>{
        dispatch(searchStudentsXepLoai(searchXepLoai.xepLoai))
    },[searchXepLoai])
 
    const[searchAll1,setSearchAll1]=useState({"xepLoai":"Giỏi","name":"","startYear":2023,"endYear":2024})
    useEffect(()=>{
        console.log(searchAll1)
        dispatch(searchAll(searchAll1))
    },[searchAll1])

    //su dung useEffect để khi ấn vào là search ko cần nút search
    return (
        <div>
           <div className='searchALL'> 
            
           <Input type='select'  className='my-3'
            value={searchAll1.xepLoai}
            onChange={(e)=>setSearchAll1({...searchAll1,"xepLoai":convertToValue(e.target.value)})}
            >
                <option>Giỏi</option>
                <option>Khá</option>
                <option>Trung Bình</option>
                <option>Yếu</option>
            </Input>
            <Input type='text'  className='my-3'
            value={searchAll1.name}
            placeholder='nhap ten de search'
            onChange={(e)=>setSearchAll1({...searchAll1,"name":e.target.value})}
            />
            <div className='d-flex'>
            <Input type='number'  className='my-3'
            value={searchAll1.startYear}
       
            onChange={(e)=>setSearchAll1({...searchAll1,"startYear":e.target.value})}
            />
               <Input type='number'  className='my-3'
            value={searchAll1.endYear}
      
            onChange={(e)=>setSearchAll1({...searchAll1,"endYear":e.target.value})}
            />
            </div>
          
            </div>     














             <Input type='select'  className='my-3'
            value={searchXepLoai.xepLoai}
            onChange={(e)=>setSearchXepLoai({...searchXepLoai,"xepLoai":convertToValue(e.target.value)})}
            >
                <option>Giỏi</option>
                <option>Khá</option>
                <option>Trung Bình</option>
                <option>Yếu</option>
            </Input>
            

            <Input type='text' placeholder='search' className='my-3'
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            />
        <Input type='text' placeholder='search by name api' className='my-3'
            value={nameSearch}
            onChange={(e)=>setNameSearch(e.target.value)}
            onKeyDown={(e)=>{
                if(e.key==="Enter")
                    handle_search_byname()
            }}
            />
  <Input type='number' placeholder='start year' className='my-3'
            value={startYear}
            onChange={(e)=>setStartYear(e.target.value)}

            />
              <Input type='number' placeholder='end year' className='my-3'
            value={endYear}
            onChange={(e)=>setEndYear(e.target.value)}
           
            />
            <Button onClick={handleSearchByYear}>search year</Button>
            {
                showMessage &&
                <Alert color={status == 200 ? "success" : "danger"}>{message}</Alert>
            }

            <Modal isOpen={modal} toggle={toggle}>
                {error &&
                    <Alert color={status == 200 ? "success" : "danger"}>{error.map((e) => <p>{e}</p>)}</Alert>



                }
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for='email'>Họ tên</Label>
                        <Input
                            id='email'
                            name='name'
                            placeholder='họ tên'
                            type='text'
                            value={student.name}
                            onChange={handlechange}
                        />

                    </FormGroup>
                    <FormGroup>
                        <Label for='email'>thành phố</Label>
                        <Input
                            id='email'
                            name='thanhPho'
                            placeholder='thành phố'
                            type='text'
                            value={student.thanhPho}
                            onChange={handlechange}
                        />

                    </FormGroup>
                    <FormGroup>
                        <Label for='xeploai'>xếp loại</Label>
                        <Input
                            id='select'
                            name='xepLoai'

                            type='select'
                            value={student.xepLoai}
                            onChange={handlechange}
                        >
                            <option>
                                Giỏi
                            </option>
                            <option>
                                Khá
                            </option>
                            <option>
                            Trung Bình
                            </option>
                            <option>
                                Yếu
                            </option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for='date'>Date</Label>
                        <Input
                            id='date'
                            name='ngaySinh'

                            type='date'
                         //   value={student.ngaySinh}
                            onChange={handlechange}
                        />
                  
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAdd}>
                        save
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
            <Button color="success" onClick={toggle}>
                thêm sinh viên
            </Button>
            <h1>Total: {totalPages}</h1>
            <Table striped>
                <thead>
                    <tr>
                        <th>#</th>
                        <th> ID</th>
                        <th>Tên</th>
                        <th>Thành phố</th>
                        <th>Ngày sinh</th>
                        <th>Xếp loại</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        students && students.map((item, index) => (
                            // <tr key={index}>
                            //     <td>{index + 1}</td>
                            //     <td scope="row">
                            //         {item.name}
                            //     </td>
                            //     <td>

                            //         {item.thanhPho}
                            //     </td>
                            //     <td>
                            //         {item.xepLoai}
                            //     </td>
                            //     <td>
                            //         {item.ngaySinh}
                            //     </td>
                            //     <td>
                            //         <Button className='btn btn-danger' onClick={() => {
                            //             if(window.confirm("ban co muon xoa khong"))
                            //             handleDelete(item.id)

                            //         }}
                            //             >Delete </Button>
                            //         <Button className='btn btn-success' onClick={toggle} >update</Button>
                            //     </td>

                            // </tr>
                            <tr key={index} className={studentEdit.isEdit && item.id === studentEdit.id ? "student-item active" : "student-item"}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input type="hidden" value={EStudent.id}
                                            onChange={(e) => setEStudent({ ...EStudent, id: e.target.value })}
                                        />
                                        :
                                        item.id
                                    }
                                </td>
                                <td>
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input type="text" value={EStudent.name}
                                            onChange={(e) => setEStudent({ ...EStudent, name: e.target.value })}
                                        />
                                        :
                                        item.name
                                    }
                                </td>
                                <td>
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input type="text" value={EStudent.thanhPho}
                                            onChange={(e) => setEStudent({ ...EStudent, thanhPho: e.target.value })}
                                        />
                                        :
                                        item.thanhPho
                                    }
                                </td>
                                <td>
                                    {
                                        studentEdit.isEdit && item.id === studentEdit.id ?
                                            <Input

                                                type="date"
                                                value={EStudent.ngaySinh}
                                                onChange={(e) => setEStudent({ ...EStudent, ngaySinh: e.target.value })}
                                            />
                                            :
                                            convertDateToDDMMYYYY(item.ngaySinh)

                                    }
                                </td>

                                <td>
                                    {studentEdit.isEdit && item.id === studentEdit.id ?
                                        <Input
                                            id="xepLoai"
                                            name="xepLoai"
                                            type="select"
                                            value={convertToValue(EStudent.xepLoai)}
                                            onChange={(e) => setEStudent({ ...EStudent, xepLoai: e.target.value })}
                                        >
                                            <option>
                                                Giỏi
                                            </option>
                                            <option>
                                                Khá
                                            </option>
                                            <option>
                                            Trung Bình
                                            </option>
                                            <option>
                                                Yếu
                                            </option>
                                        </Input>
                                        :
                                        convertToValue(item.xepLoai)
                                    }
                                </td>
                                <td>
                                    {
                                        studentEdit.isEdit && item.id === studentEdit.id ?
                                            <Button className="btn btn-success"
                                                onClick={() => handle_save(item.id)}
                                            >Save </Button>
                                            :
                                            <>
                                                <Button
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this student?')) {
                                                            handleDelete(item.id);
                                                        }
                                                    }}
                                                >
                                                    delete
                                                </Button>
                                                <Button className="btn btn-success" onClick={() => handle_edit(item.id, item)}>
                                                    update
                                                </Button>
                                            </>
                                    }
                                </td>
                            </tr>
                        ))
                    }

                </tbody>
            </Table>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={Math.ceil(totalPages)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                nextClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
            />
        </div>
    )
}
