const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; //[env] 아마 
const db = {};

const sequelize=new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User=require('./user')(sequelize, Sequelize);
db.Post=require('./post')(sequelize, Sequelize);
db.Hashtag=require('./hashtag')(sequelize, Sequelize);

db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

//post 데이터 : getHashtags, addHashtags
//hahstag 데이터 : getPosts, addPosts
db.Post.belongsToMany(db.Hashtag,{through : 'PostHahstag'});
db.Hashtag.belongsToMany(db.Post,{through : 'PostHahstag'});

//같은 테이블끼리도 N:M 관계를 가질 수 있다.
//아직 잘 모르는 부분 데이터 넣으면서 확인해야할 듯 하다.
db.User.belongsToMany(db.User, {
  foreignKey:'followingId',
  as:'Followers', // as옵션 시퀄라이즈가 JOIN 작업 시 사용하는 이름
  through: 'Follow'
});
db.User.belongsToMany(db.User, {
  foreignKey:'follwerId',
  as:'Followings', // as옵션 시퀄라이즈가 JOIN 작업 시 사용하는 이름
  through:'Follow',
});

module.exports = db;
