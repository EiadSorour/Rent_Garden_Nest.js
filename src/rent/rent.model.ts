import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Garden } from "src/garden/garden.model";
import { User } from "src/user/user.model";


@Table({paranoid:true})
export class Rent extends Model{
    
    @Column({primaryKey: true , type: DataType.UUID})
    rentID: string;

    @Column({type: DataType.UUID})
    @ForeignKey(()=>User)
    userID: String;

    @Column({type: DataType.UUID})
    @ForeignKey(()=>Garden)
    gardenID: String;

    @Column({allowNull:false , type: DataType.DATE})
    fromDate: Date;
    
    @Column({allowNull: false , type: DataType.DATE})
    toDate: Date;
    
    @Column({allowNull:false , type: DataType.FLOAT})
    cost: number;

    
}