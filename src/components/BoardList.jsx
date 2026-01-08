import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { Link } from "react-router";

function Board({ id, title, write, date, onCheckboxChange}) {  

  return (
    <tr>
      <td>
        <Form.Check // prettier-ignore
          type="checkbox"
          id={`board-${id}`}
          onChange={(e)=>{
            onCheckboxChange(e.target.checked, id);
          }}
        /></td>
      <td>{id}</td>
      <td><Link to={`/view/${id}`}>{title}</Link></td>
      <td>{write}</td>
      <td>{date}</td>
    </tr>

  )
}

export default function BoardList() {
  const [list, setList] = useState([]);
  const [checkList, setCheckList] = useState([]);

  const onCheckboxChange = (checked, id)=>{
    setCheckList(prev=>{
      if(checked){
        return [...prev, id]
      }else{
        return prev.filter(item=>item !== id);
      }
    })
  }
  const getList = useCallback(() => {
    console.log('getList 실행');
    Axios.get('http://localhost:8000/list')
      .then(response => {
        const { data } = response;
        console.log(data);
        setList(data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
      });
  },[]);

  useEffect(() => {
    getList();
  }, [getList]);

  const handleDelete = ()=> {
    if(checkList.length === 0){
      alert('삭제할 게시글을 선택해주세요');
      return;
    }
    const ok = window.confirm(`선택한 ${checkList.length}개의 글을 삭제할까요?\n삭제후에는 복구할 수 없습니다.`);
    if(!ok) return;

    let boardIdList = checkList.join();

    Axios.post('http://localhost:8000/delete', {
      boardIdList
    })
    .then(() => {
      setCheckList([]);//삭제후 값 비우기
      getList();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>선택</th>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {
            list.map(item => <Board
              key={item.id}
              id={item.id}
              title={item.title}
              write={item.writer}
              date={item.date}
              onCheckboxChange={onCheckboxChange}
            />)
          }

        </tbody>
      </Table>
      <div className="buttons d-flex gap-1 justify-content-end">
        <Link to="/write" className='btn btn-primary'>글쓰기</Link> 
        <Button variant="danger" onClick={handleDelete}>삭제하기</Button>
      </div>
    </>
  )
}