import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Garden } from "src/garden/garden.model";
import { Rent } from "src/rent/rent.model";


@Table
export class User extends Model{
    
    @Column({primaryKey: true , type: DataType.UUID})
    userID: string;

    @Column({allowNull:false , unique: true})
    username: string;
    
    @Column({allowNull: false})
    password: string;
    
    @Column({allowNull:false})
    role: number;
    
    @Column({allowNull:true})
    moneyOwned: number;

    @BelongsToMany(()=>Garden , ()=> Rent)
    rentedGardens: Garden[];

    @HasMany(()=>Garden)
    postedGardens: Garden[];
}