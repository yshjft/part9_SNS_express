module.exports=(sequelize, DataTypes)=>(
  sequelize.define('post', {
    content:{
      type: DataTypes.STRING(40),
      allowNull : false,
    },
    img:{
      type:DataTypes.STRING(200),//이미지 경로 저장
      allowNull:true, //NOT NULL true(???)
    },
  },{
    timestamps:true,
    paranoid:true,  
  })
);