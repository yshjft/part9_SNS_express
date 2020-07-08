const local=require('./localStrategy');
const {User} =require('../models');

module.exports = (passport) =>{
  passport.serializeUser((user, done)=>{ //req.session 객체에 어떤 데이터를 저장할지 선택
    done(null, user.id); // done 함수의 첫번째 매개변수는 error 발생시 사용, 두번째 인자만 사용하여 사용자의 ID만 req.session에 저장
  });

  //passport.session() 미들웨어가 아래 메서드를 호출.
  //session에 저장해 두었던 아이디를 받아 데이터 베이스에서 사용자 정보 조회
  passport.deserializeUser((id, done)=>{ 
    User.find({where:{id}})
      .then(user => done(null, user)) //조회한 정보는 req.user에 저장
      .catch(err => done(err));
  });

  local(passport);
};

