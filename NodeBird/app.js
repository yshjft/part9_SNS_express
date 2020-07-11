const express=require('express');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const path=require('path');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
require('dotenv').config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const {sequelize} = require('./models'); // ./modles는 ./models/index.js와 같다.
const passportConfig= require('./passport'); // ./passport는 ./passport/index.js와 같다. 폴더 내의 index.js 파일은 require 시 이름을 생략할 수 있습니다.

const app=express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views')); //path.join의 'views'는 views 디렉토리 의미하는 것 같다.
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8020);

app.use(morgan('dev')); // 배포 시에는 dev를 common이나 combined로 수정
app.use(express.static(path.join(__dirname, 'public'))); //정적파일 제공, 서버에 자원 중에서 브라우져에 다운로드하여 화면을 그리는 파일을 정적파일이라고 한다.
app.use('/img', express.static(path.join(__dirname, 'uploads'))); // 업로드할 이미지를 제공할 라우터(/img)도 express.static 미들웨어로 uploads 폴더와 연결한다.

//요청 본문 해석(body parser)
app.use(express.json());
app.use(express.urlencoded({extended: false})); //노드의 querystring 모듈을 사용하여 퀴리스트링을 해석

app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키가 서명되었으므로 클라이언트에서 쿠키 수정시 에러 발생
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:process.env.COOKIE_SECRET,
  cookie:{
    httpOnly:true,
    secure:false,
  },
}));

app.use(flash());
//passport 미들웨어는 무조건 expres-session보다 뒤에 연결할 것
app.use(passport.initialize()); // passport.initialize() : 요청 객체에 passport 설정을 심는다.
app.use(passport.session()); // passport.session() : req.session 객체에 passport 정보를 저장합니다.

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next)=>{
  const err= new Error('Not Found');
  err.status=404;
  next(err);
});

app.use((err, req, res, next)=>{
  //res.locals 속성에 값을 대입하여 템플릿 엔진에 변수 삽입 가능
  res.locals.message=err.message;
  res.locals.error=req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), ()=>{
  console.log(app.get('port'), '번 포트에서 대기 중');
});