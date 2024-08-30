import { Model, DataTypes } from 'sequelize';
import  {sequelize}  from '../database';

class Customer extends Model {
    public customer_code!: string;
}

Customer.init({
    customer_code: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Customer',
    timestamps: false
});

export default Customer;