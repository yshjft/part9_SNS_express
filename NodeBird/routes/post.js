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
      //path.basename() : Extract the filename from a file path
      cb(null, path.basename(file.originalname, ext)+new Date().valueOf()+ext);
    },
  }),
  limits : {fileSize:5*1024*1024}, //허용되는 이미지 최대 크기
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res)=>{// 용도를 모르겠다??
  console.log(req.file);
  res.json({url : `/img/${req.file.filename}`});
});

const upload2=multer();
router.post('/', isLoggedIn, upload2.none(), async(req, res, next)=>{
  try{
    const post = await Post.create({
      content: req.body.content,
      img : req.body.url,
      userId : req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s]*/g);
    if (hashtags) {
      const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
        where: { title: tag.slice(1).toLowerCase() },
      })));
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  }catch(error){
    console.error(error);
    next(error);
  }
});

router.get('/hashtag', async(req, res, next)=>{
  const query=req.query.hashtag;
  if(!query){
    return res.redirect('/');
  }
  try{
    const hashtag = await Hashtag.find({where :{title:query}});
    let posts=[];
    if(hashtag){
      posts= await hashtag.getPosts({include:[{model:User}]});
    }
    return res.render('main', {
      title:`${query} | NodeBird`,
      user:req.user,
      twits:posts,
    });
  }catch(error){
    console.error(error);
    return next(error);
  }
});

module.exports=router;