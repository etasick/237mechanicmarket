// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Category, Listing, CarDetails, MotorcycleDetails, SparePartDetails, Message } = initSchema(schema);

export {
  User,
  Category,
  Listing,
  CarDetails,
  MotorcycleDetails,
  SparePartDetails,
  Message
};