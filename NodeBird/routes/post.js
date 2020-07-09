const express=require('express');
const multer=require('multer');
const path=require('path');
const fs=require('fs');

const {Post, Hashtag, User}=require('../models');
const {isLoggedIn}=require('./middlewares');

const router=express.Router();

fs.readdir('uploads', (error)=>{
  if(error){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');//동기식 폴덩 생성
  }
});

const upload=multer({
  //storage에는 파일 저장 방식과 경로, 파일명 등을 설정
  storage:multer.diskStorage({ //diskStorage를 사용해 이미지가 서버 디스크에 저장되도록 한다.
    destination(req, file, cb){
      cb(null, 'uploads/');//저장 경로를 uploads 폴더로 설정
    },
    filename(req, file, cb){
      const ext=path.extname(file.originalname); //기존 확장자
      //file.originalname : 파일 기존 이름
      //업로드 날짜값 : new Date().valueOf
      cb(null, path.basename(file.originalname, ext)+new Date().valueOf()+ext);
    },
  }),
  limits : {fileSize:5*1024*1024}, //허용되는 이미지 최대 크기
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res)=>{
  console.log(req.file);
  res.json({url : `/img/${req.file.filename}`}); // ??
});

const upload2=multer();
router.post('/', isLoggedIn, upload2.none(), async(req, res, next)=>{
  try{
    
  }catch(error){
    console.error(error);
    next(error);
  }
})