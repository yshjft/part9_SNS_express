const express=require('express');
const passport=require('passport');
const bcrypt = require('bcryptjs');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const {User}=require('../models');

const router=express.Router();

router.post('/join', isNotLoggedIn, async(req, res,next)=>{
  const {email, nick, password} = req.body;
  try{
    const exUser=await User.findOne({where : {email}});
    if(exUser){
      req.flash('joinError', '이미 가입된 이메일입니다.');
      return res.redirect('/join');
    }else{
      const hash=await bcrypt.hash(password, 12);
      await User.create({
        email,
        nick,
        password : hash,
      });
      return res.redirect('/');
    }
  }catch(error){
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next)=>{
  passport.authenticate('local', (authError, user, info)=>{ //passport.authenticate('local') 미들웨어가 로컬 로그인 전략을 수행한다, done 함수와 관련있다.
    if(authError){
      console.error(authError);
      return next(authError);
    }
    if(!user){
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError)=>{
      if(loginError){
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req,res, next); //미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다. passport.authenticate('local')미들웨어가 다른 미들웨어 안에 있다.
});

router.get('/logout', isLoggedIn,(req,res)=>{
  req.logout(); //req.user 객체를 제거
  req.session.destroy(); //req.session 내용 제거
  res.redirect('/');
});


module.exports=router;