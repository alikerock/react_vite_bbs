import Button from 'react-bootstrap/Button';
import { Link } from "react-router";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import Axios from 'axios';

export default function View({onStartModify}){
  const [data, setData] = useState(null);
  const {id} = useParams();
  let navigate = useNavigate();

  const getData = useCallback(() => {
    Axios.get(`http://localhost:8000/detail?id=${id}`)
      .then(response => {        
        const {data} = response;
        console.log(data);
        setData({
          title: data.title,
          writer:data.writer,
          content: data.content,
          date:data.date,
          image_path:data.image_path
        })
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
      });    
  },[id]);
   
  useEffect(() => {
    getData();
  }, [getData]);

  const handleClick = ()=>{
    onStartModify(id);
    navigate("/write");
  }

  return(
    <>
      <h2>{data?.title}</h2>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <span>{data?.writer}</span>
        <span>{data?.date}</span>
      </div>
      <div className="content">{data?.content}</div>
      {
        data?.image_path && (
          <div>
            <img 
              style={{width:'100%'}}
              src={`http://localhost:8000/${data.image_path}`} 
              alt=""
            />
          </div>
        )
      }
      <hr />
      <div className="buttons d-flex gap-1 justify-content-end">
        <Link to="/" className='btn btn-primary'>홈</Link> 
        <Button variant="secondary" onClick={handleClick}>수정</Button>
        <Button variant="danger">삭제</Button>      
      </div>
    </>
  )
}