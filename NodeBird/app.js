const express=require('express');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const path=require('path');
const session=require('express-session');
const flash=require('connect-flash');

require('dotenv').config();

const pageRouter = require('./routes/page');
const {sequelize} = require('./models'); // ./modles는 ./models/index.js와 같다.

const app=express();
sequelize.sync();

app.set('views', path.join(__dirname, 'views')); //path.join의 'views'는 views 디렉토리 의미하는 것 같다.
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8020);

app.use(morgan('dev')); // 배포 시에는 dev를 common이나 combined로 수정
app.use(express.static(path.join(__dirname, 'public'))); //정적파일 제공, 서버에 자원 중에서 브라우져에 다운로드하여 화면을 그리는 파일을 정적파일이라고 한다.

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

app.use('/', pageRouter);

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