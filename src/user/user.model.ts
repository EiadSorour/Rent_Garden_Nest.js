import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Garden } from "src/garden/garden.model";
import { Rent } from "src/rent/rent.model";

@Table
export class User extends Model{
    
    @Column({primaryKey: true , type: DataType.UUID , defaultValue: DataType.UUIDV4})
    userID: string;

    @Column({allowNull:false , unique: true})
    username: string;
    
    @Column({allowNull: false})
    password: string;
    
    @Column({allowNull:false}) 
    role: string;
    
    @Column({allowNull:true , type: DataType.FLOAT})
    moneyOwned: number;

    @BelongsToMany(()=>Garden , { through: {model: ()=>Rent,  unique: false } })
    rentedGardens: Garden[];

    @HasMany(()=>Garden)
    postedGardens: Garden[];
}