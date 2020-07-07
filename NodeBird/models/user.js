module.exports=(sequelize, DataTypes)=>(
  sequelize.define('user', {
    email:{
      type:DataTypes.STRING(40),
      allowNull : true, //NOT NULL 옵션과 동일
      unique:true,
    },
    nick:{
      type:DataTypes.STRING(40),
      allowNull:true,
      unique:true,
    },
    password:{
      type:DataTypes.STRING(100),
      allowNull:true,
    },
    provider:{
      type:DataTypes.STRING(10),
      allowNull:false,
      defaultValue:'local',
    },
    snsId:{
      type:DataTypes.STRING(30),
      allowNull:true,
    },
  },{ //테이블 옵션
    timestamps: true, //sequelize가 createdAt, updateAt 컬럼을 추가. 로우가 생성될 때와 수정될 때의 시간이 자동으로 입력된다.
    paranoid:true, // sequelize가 deletedAt이라는 컬럼을 추가. 로우 삭제 명령시 로우를 제거하는 대신 deletedAt에 제거된 날짜 입력.
  })
);