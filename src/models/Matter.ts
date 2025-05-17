import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import Customer from "./Customer";

interface MatterAttributes {
  id: string;
  name: string;
  description: string;
  status: string;
  openDate: Date;
  closeDate?: Date;
  practiceArea: string;
  customerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MatterCreationAttributes
  extends Optional<MatterAttributes, "id" | "closeDate"> {}

class Matter
  extends Model<MatterAttributes, MatterCreationAttributes>
  implements MatterAttributes
{
  public id!: string;
  public name!: string;
  public description!: string;
  public status!: string;
  public openDate!: Date;
  public closeDate?: Date;
  public practiceArea!: string;
  public customerId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Matter.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("open", "closed", "pending"),
      defaultValue: "open",
    },
    openDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    closeDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    practiceArea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Customer,
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Matter",
    tableName: "matters",
  }
);

Matter.belongsTo(Customer, { foreignKey: "customerId" });
Customer.hasMany(Matter, { foreignKey: "customerId" });

export default Matter;
