import mongoose , {Schema} from 'mongoose';
import autoIncrement from 'mongoose-auto-increment'; 
const GalonSchema = new Schema({
    img : {
        type : String,
        required : true
    },
    size : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    typeOfOrder : {
        type : String,
        enum : ['buying', 'substitution'],
        default : 'buying'
    },
    minimumNumberOnOrder : {
        type : Number, 
        default : 3,
    },
    user:{
        type : Number, 
        ref : "user"
    },
    creationDate : {
        type : Date, 
        default : Date.now
    }
})

GalonSchema.set('toJSON', {
    transform : (doc, ret, options)=>{
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


autoIncrement.initialize(mongoose.connection);
GalonSchema.plugin(autoIncrement.plugin, 'galon');

export default mongoose.model("galon", GalonSchema); 