const express=require('express');
const {isLoggedIn, isNotLoggedIn}=require('./middlewares');
const {Post, User}=require('../models');

const router=express.Router();

router.get('/profile', isLoggedIn,(req, res)=>{
  res.render('profile', {
    title: '내 정보 - NodeBird',
    user:req.user,
  });
});

router.get('/join', isNotLoggedIn,(req, res)=>{
  res.render('join', {
    title : '회원 가입-NodeBird',
    user: req.user, //이거는 어디에다 쓰려고??
    joinError : req.flash('joinError'),
  });
});

router.get('/', (req, res, next)=>{
  console.log(12345);
  Post.findAll({
    include:{ // include : 연결된 모델과 JOIN할 때에 사용되
      model :User,
      attributes : ['id', 'nick'],
    },
    order:[['createdAt', 'DESC']],
  })
    .then((posts)=>{
      res.render('main', {
        title:'Nodebird',
        twits:posts,
        user:req.user,
        loginError:req.flash('loginError'),
      });
    })
    .catch((error)=>{
      console.error(error);
      next(error);
    });
});


module.exports=router;