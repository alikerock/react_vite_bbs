import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


export default function Write({ isModifyMode, boardId, onResetModify }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  let navigate = useNavigate();
  const [form, setForm] = useState({
    writer: '',
    title: '',
    content: '',
    image:null
  });

  // 공통 change 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target; //writer,홍길동

    setForm((prev) => ({
      ...prev,
      [name]: value, // ✅ computed property
    }));
  };

  const write = (e) => {
    e.preventDefault();
    const formData = new FormData();//빈 객체 생성
    formData.append('writer', form.writer);
    formData.append('title', form.title);
    formData.append('content', form.content);
    if(form.image){
       formData.append('image', form.image);
    }

    // console.log(formData.get("image")); 
    Axios.post(`${API_BASE}/insert`, formData, {headers:{"Content-Type":"multipart/form-data"}})
      .then((response) => {
        console.log(response);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const update = (e) => {
    e.preventDefault();

    Axios.post(`${API_BASE}/update`, {
      id:boardId,
      writer: form.writer,
      title: form.title,
      content: form.content,
    })
    .then(() => {
      onResetModify();
      navigate("/");
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    if (!boardId) return;
    if (!isModifyMode) return;
    Axios.get(`${API_BASE}/detail?id=${boardId}`)
      .then(response => {
        const { data } = response;
        console.log(data);
        setForm({
          title: data.title,
          writer: data.writer,
          content: data.content,
          date: data.date
        })
      })
      .catch(error => {
        console.log(error);
      });

  }, [boardId, isModifyMode]);

  const handleCancel = ()=>{
    onResetModify();
    navigate("/");
  }

  const handleImageChange = (e)=>{    
    const file = e.target.files[0];
    console.log(file);
    // setForm(prev=> {return {...prev,image:file}});
    setForm(prev=> ({...prev,image:file}));
  }


  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>글쓴이</Form.Label>
        <Form.Control
          type="text"
          name="writer"
          value={form.writer}
          onChange={handleChange}
          placeholder="성명을 입력하세요"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>글 제목</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="글제목을 입력하세요"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>내용</Form.Label>
        <Form.Control
          as="textarea"
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={3}
        />
      </Form.Group>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>이미지 첨부</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleImageChange}/>
      </Form.Group>      

      <div className="buttons d-flex gap-1 justify-content-end">
        <Button variant="primary" type="submit" onClick={isModifyMode ? update : write}>
          {isModifyMode ? '수정' : '입력'}
        </Button>
        <Button variant="secondary" type="button" onClick={handleCancel}>
          취소
        </Button>
      </div>
    </Form>
  );
}
