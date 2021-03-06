var { LogoModel } = require("../models/logo");
var UserModel = require("../models/user");
const { makeExecutableSchema } = require("apollo-server");
var UserModel = require("../models/user");

const typeDefs = `

scalar DateTime

type Item{
  id:String
  type:String
  z:Int
  x:Int
  y:Int
  text: String
  color: String
  fontSize:Int
  url:String
  alt:String
  imgWidth:Int
  imgHeight:Int

}


input ItemInput{
  id:String!
  type:String!
  z:Int!
  x:Int!
  y:Int!
  text: String
  color: String
  fontSize:Int
  url:String
  alt:String
  imgWidth:Int
  imgHeight:Int


}


  type Logo {
    title:String
    _id: String
    owner:String
    items: [Item]
    width: Int
    height: Int
    backgroundColor:String
    borderRadius:Int
    borderThickness :Int
    borderColor: String
    margin : Int
    padding : Int
    lastUpdate : DateTime
 }

 type User{
    _id: String
    email: String
    username:String
    password:String
    firstName:String
    lastName:String
    age: Int
    lastUpdate : DateTime
  
}


 type myBoolean{
   result: Boolean!
 }

type Query {
    logos: [Logo]
    logo(id: String!): Logo
    logosByUser(owner:String!):[Logo]
    users: [User]
    user(id:String!):User
  }

type Mutation{

    addLogo(title:String!,owner:String!,width:Int!,height:Int!, items:[ItemInput],backgroundColor:String!,borderRadius:Int!,borderThickness:Int!,borderColor:String!,margin:Int!,padding:Int!): Logo
    updateLogo(title:String!,id:String!,owner:String!,width:Int!,height:Int!, items:[ItemInput],backgroundColor:String!,borderRadius:Int!,borderThickness:Int!,borderColor:String!,margin:Int!,padding:Int!): Logo
    removeLogo(id:String!):Logo
    removeAllLogos:myBoolean
    removeLogosByUser(owner:String!):myBoolean
    addUser(email: String!,username:String!,password:String!,firstName:String!,lastName:String!,age: Int!):User
    updateUser(id:String!,email: String!,username:String!,password:String!,firstName:String!,lastName:String!,age: Int!):User
    removeUser(id:String!):User
    removeAllUsers:myBoolean

}
`;

const resolvers = {
  // DateTime: DateTimeResolver,
  Query: {
    logos: () => LogoModel.find().sort({ lastUpdate: -1 }).exec(),

    logo: (_, { id }) => LogoModel.findById(id).exec(),
    logosByUser: (_, { owner }) => {
      return LogoModel.find()
        .where("owner", owner)
        .sort({ lastUpdate: -1 })
        .exec();
    },
    users: () => UserModel.find().exec(),
    user: (_, { id }) => {
      console.log(id);
      return UserModel.findById(id).exec();
    },
  },

  Mutation: {
    addLogo: (_, params) => {
      const logoModel = new LogoModel(params);

      const newLogo = logoModel.save();
      if (!newLogo) {
        throw new Error("Error");
      }
      console.log(newLogo);
      return newLogo;
    },

    addUser: (_, params) => {
      const userModel = new UserModel(params);

      const newUser = userModel.save();
      if (!newUser) {
        throw new Error("Error");
      }
      console.log(newUser);
      return newUser;
    },

    updateLogo: (_, params) => {
      // const logoModel = new LogoModel(params);
      // console.log(logoModel)
      return LogoModel.findByIdAndUpdate(
        params.id,
        {
          title: params.title,
          texts: params.texts,
          owner: params.owner,
          images: params.images,
          width: params.width,
          height: params.height,
          items: params.items,
          backgroundColor: params.backgroundColor,
          borderRadius: params.borderRadius,
          borderThickness: params.borderThickness,
          borderColor: params.borderColor,
          margin: params.margin,
          padding: params.padding,
          lastUpdate: new Date(),
        },
        function (err) {
          if (err) return next(err);
        }
      );
    },

    updateUser: (_, params) => {
      // const UserModel = new UserModel(params);
      // console.log(UserModel)
      return UserModel.findByIdAndUpdate(
        params.id,
        {
          username: params.username,
          password: params.password,
          age: params.age,
          email: params.email,
          firstname: params.firstname,
          lastname: params.lastname,
        },
        function (err) {
          if (err) return next(err);
        }
      );
    },

    removeLogo: (_, params) => {
      const remLogo = LogoModel.findByIdAndRemove(params.id).exec();
      if (!remLogo) {
        throw new Error("Error");
      }
      return remLogo;
    },
    removeUser: (_, params) => {
      const remUser = UserModel.findByIdAndRemove(params.id).exec();
      if (!remUser) {
        throw new Error("Error");
      }
      return remUser;
    },

    removeAllLogos: () => {
      const remLogos = LogoModel.deleteMany({}).exec();
      console.log(remLogos);
      let myBoolean = { result: false };
      if (!remLogos) {
        throw new Error("Error");
      }

      console.log(remLogos);
      myBoolean.result = true;

      return myBoolean;
    },

    removeAllUsers: () => {
      const remUsers = LogoModel.deleteMany({}).exec();
      console.log(remUsers);
      let myBoolean = { result: false };
      if (!remUsers) {
        throw new Error("Error");
      }

      console.log(remUsers);
      myBoolean.result = true;

      return myBoolean;
    },
    removeLogosByUser: (_, { owner }) => {
      const remLogos = LogoModel.deleteMany({ owner: owner }).exec();
      console.log(remLogos);
      let myBoolean = { result: false };
      if (!remLogos) {
        throw new Error("Error");
      }

      console.log(remLogos);
      myBoolean.result = true;

      return myBoolean;
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
