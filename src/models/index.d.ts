import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";





type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly cognitoId: string;
  readonly email: string;
  readonly username?: string | null;
  readonly listings?: (Listing | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly cognitoId: string;
  readonly email: string;
  readonly username?: string | null;
  readonly listings: AsyncCollection<Listing>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly slug: string;
  readonly listings?: (Listing | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly slug: string;
  readonly listings: AsyncCollection<Listing>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Category = LazyLoading extends LazyLoadingDisabled ? EagerCategory : LazyCategory

export declare const Category: (new (init: ModelInit<Category>) => Category) & {
  copyOf(source: Category, mutator: (draft: MutableModel<Category>) => MutableModel<Category> | void): Category;
}

type EagerListing = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Listing, 'id'>;
  };
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly categoryId: string;
  readonly category?: Category | null;
  readonly condition?: string | null;
  readonly location?: string | null;
  readonly region?: string | null;
  readonly mainImageUrl: string;
  readonly galleryImageUrls?: (string | null)[] | null;
  readonly approved: boolean;
  readonly price?: number | null;
  readonly isNegotiable?: boolean | null;
  readonly userId: string;
  readonly user?: User | null;
  readonly carDetails?: CarDetails | null;
  readonly motorcycleDetails?: MotorcycleDetails | null;
  readonly sparePartDetails?: SparePartDetails | null;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

type LazyListing = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Listing, 'id'>;
  };
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly categoryId: string;
  readonly category: AsyncItem<Category | undefined>;
  readonly condition?: string | null;
  readonly location?: string | null;
  readonly region?: string | null;
  readonly mainImageUrl: string;
  readonly galleryImageUrls?: (string | null)[] | null;
  readonly approved: boolean;
  readonly price?: number | null;
  readonly isNegotiable?: boolean | null;
  readonly userId: string;
  readonly user: AsyncItem<User | undefined>;
  readonly carDetails: AsyncItem<CarDetails | undefined>;
  readonly motorcycleDetails: AsyncItem<MotorcycleDetails | undefined>;
  readonly sparePartDetails: AsyncItem<SparePartDetails | undefined>;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

export declare type Listing = LazyLoading extends LazyLoadingDisabled ? EagerListing : LazyListing

export declare const Listing: (new (init: ModelInit<Listing>) => Listing) & {
  copyOf(source: Listing, mutator: (draft: MutableModel<Listing>) => MutableModel<Listing> | void): Listing;
}

type EagerCarDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CarDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly manufacturer?: string | null;
  readonly model?: string | null;
  readonly year?: number | null;
  readonly mileage?: number | null;
  readonly fuelType?: string | null;
  readonly transmission?: string | null;
  readonly driveType?: string | null;
  readonly engineSize?: string | null;
  readonly color?: string | null;
  readonly bodyType?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCarDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CarDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly manufacturer?: string | null;
  readonly model?: string | null;
  readonly year?: number | null;
  readonly mileage?: number | null;
  readonly fuelType?: string | null;
  readonly transmission?: string | null;
  readonly driveType?: string | null;
  readonly engineSize?: string | null;
  readonly color?: string | null;
  readonly bodyType?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CarDetails = LazyLoading extends LazyLoadingDisabled ? EagerCarDetails : LazyCarDetails

export declare const CarDetails: (new (init: ModelInit<CarDetails>) => CarDetails) & {
  copyOf(source: CarDetails, mutator: (draft: MutableModel<CarDetails>) => MutableModel<CarDetails> | void): CarDetails;
}

type EagerMotorcycleDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MotorcycleDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly manufacturer?: string | null;
  readonly model?: string | null;
  readonly year?: number | null;
  readonly mileage?: number | null;
  readonly engineCapacity?: string | null;
  readonly fuelType?: string | null;
  readonly color?: string | null;
  readonly transmission?: string | null;
  readonly bikeType?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMotorcycleDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MotorcycleDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly manufacturer?: string | null;
  readonly model?: string | null;
  readonly year?: number | null;
  readonly mileage?: number | null;
  readonly engineCapacity?: string | null;
  readonly fuelType?: string | null;
  readonly color?: string | null;
  readonly transmission?: string | null;
  readonly bikeType?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MotorcycleDetails = LazyLoading extends LazyLoadingDisabled ? EagerMotorcycleDetails : LazyMotorcycleDetails

export declare const MotorcycleDetails: (new (init: ModelInit<MotorcycleDetails>) => MotorcycleDetails) & {
  copyOf(source: MotorcycleDetails, mutator: (draft: MutableModel<MotorcycleDetails>) => MutableModel<MotorcycleDetails> | void): MotorcycleDetails;
}

type EagerSparePartDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SparePartDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly partName?: string | null;
  readonly compatibleVehicles?: (string | null)[] | null;
  readonly brand?: string | null;
  readonly condition?: string | null;
  readonly origin?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazySparePartDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SparePartDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly partName?: string | null;
  readonly compatibleVehicles?: (string | null)[] | null;
  readonly brand?: string | null;
  readonly condition?: string | null;
  readonly origin?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type SparePartDetails = LazyLoading extends LazyLoadingDisabled ? EagerSparePartDetails : LazySparePartDetails

export declare const SparePartDetails: (new (init: ModelInit<SparePartDetails>) => SparePartDetails) & {
  copyOf(source: SparePartDetails, mutator: (draft: MutableModel<SparePartDetails>) => MutableModel<SparePartDetails> | void): SparePartDetails;
}

type EagerMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Message, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly listingId: string;
  readonly userId: string;
  readonly senderName: string;
  readonly senderEmail: string;
  readonly senderPhone?: string | null;
  readonly messageText: string;
  readonly messageRead: boolean;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

type LazyMessage = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Message, 'id'>;
    readOnlyFields: 'updatedAt';
  };
  readonly id: string;
  readonly listingId: string;
  readonly userId: string;
  readonly senderName: string;
  readonly senderEmail: string;
  readonly senderPhone?: string | null;
  readonly messageText: string;
  readonly messageRead: boolean;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
}

export declare type Message = LazyLoading extends LazyLoadingDisabled ? EagerMessage : LazyMessage

export declare const Message: (new (init: ModelInit<Message>) => Message) & {
  copyOf(source: Message, mutator: (draft: MutableModel<Message>) => MutableModel<Message> | void): Message;
}