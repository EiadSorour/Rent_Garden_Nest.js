import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Rent } from "src/rent/rent.model";
import { User } from "src/user/user.model";

@Table
export class Garden extends Model{
    
    @Column({primaryKey: true , type: DataType.UUID , defaultValue: DataType.UUIDV4})
    gardenID: string;

    @Column({type: DataType.UUID})
    @ForeignKey(()=>User)
    ownerID: string

    @Column({allowNull:false , unique:true})
    title: string;
    
    @Column({allowNull: false})
    description: string;
    
    @Column({allowNull:false , type: DataType.FLOAT})
    size: number;

    @Column({allowNull:false})
    location: string;
    
    @Column({allowNull: false , type: DataType.FLOAT})
    hourPrice: number;

    @Column({allowNull:true})
    image: string;

    @BelongsToMany(()=>User , { through: {model: ()=>Rent,  unique: false } })
    renters: User[];

    @BelongsTo(()=>User)
    poster: User;
}