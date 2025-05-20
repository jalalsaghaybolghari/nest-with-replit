import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isObject } from 'lodash';
import type { DeleteResult, UpdateResult } from 'mongodb';
import type {
  Document,
  FilterQuery,
  Model,
  ObjectId,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
  HydrateOptions,
} from 'mongoose';
import { isValidObjectId } from 'mongoose';

export class BaseRepository<T extends Document> {
  protected pk = '_id';
  protected excludeDeleted = true;
  constructor(private readonly model: Model<T>) {}

  async aggregate(aggregations?: any[]): Promise<any[]> {
    return this.model.aggregate(aggregations).exec();
  }
  /**
   * <queries>
   */
  async findWhere(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter cannot be empty for findWhere');
      }
      const modifiedFilter = this.modifyFilter(filter);
      const results = await this.model.find(modifiedFilter, undefined, options);
      return results;
    } catch (error) {
      console.error('Error during findWhere:', error);
      throw new Error('Failed to perform findWhere query');
    }
  }

  async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null> {
    try {
      const modifiedFilter = this.modifyFilter(filter);
      const result = await this.model.findOne(modifiedFilter, undefined, options);

      return result;
    } catch (error) {
      console.error('Error during findOne query:', error);
      throw new Error('Failed to perform findOne query');
    }
  }

  async findOneWithPopulate(
    filter: FilterQuery<T>,
    options?: QueryOptions,
    populateFields?: string | string[],
  ): Promise<T | null> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter cannot be empty for findOneWithPopulate');
      }
      const modifiedFilter = this.modifyFilter(filter);
      let query = this.model.findOne(modifiedFilter, undefined, options);

      if (populateFields) {
        query = query.populate(populateFields);
      }

      const result = await query;

      return result;
    } catch (error) {
      console.error('Error during findOneWithPopulate query:', error);
      throw new Error('Failed to perform findOneWithPopulate query');
    }
  }

  async findWithPopulate(
    filter: FilterQuery<T>,
    options?: QueryOptions,
    populateFields?: string | string[],
  ): Promise<T[]> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter cannot be empty for findWithPopulate');
      }

      const modifiedFilter = this.modifyFilter(filter);

      let query = this.model.find(modifiedFilter, undefined, options);

      if (populateFields) {
        query = query.populate(populateFields);
      }
      const results = await query;

      return results;
    } catch (error) {
      console.error('Error during findWithPopulate query:', error);
      throw new Error('Failed to perform findWithPopulate query');
    }
  }

  async findByIdWithPopulate(
    id: string,
    options?: QueryOptions,
    populateFields?: string | string[],
  ): Promise<T | null> {
    try {
      if (!id) {
        throw new Error('ID cannot be empty for findByIdWithPopulate');
      }

      const modifiedFilter = this.modifyFilter({ _id: id });

      let query = this.model.findById(modifiedFilter, undefined, options);

      if (populateFields) {
        query = query.populate(populateFields);
      }

      const result = await query;

      return result;
    } catch (error) {
      console.error('Error during findByIdWithPopulate query:', error);
      throw new Error('Failed to perform findByIdWithPopulate query');
    }
  }

  async findById(id: ObjectId | string, options?: QueryOptions): Promise<T | null> {
    try {
      if (!id) {
        throw new Error('ID is required to perform findById');
      }
      const modifiedFilter = this.modifyFilter({ [this.pk]: id } as FilterQuery<T>);
      const result = await this.findOne(modifiedFilter, options);

      return result;
    } catch (error) {
      console.error('Error during findById query:', error);
      throw new Error('Failed to perform findById query');
    }
  }

  async findOneAndUpdate(filter: FilterQuery<T>, updateData: UpdateQuery<T>, options?: any): Promise<T | null> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for findOneAndUpdate');
      }
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error('Update data is required for findOneAndUpdate');
      }
      const result = await this.model.findOneAndUpdate(filter, updateData, options);

      return result as unknown as T;
    } catch (error) {
      console.error('Error during findOneAndUpdate operation:', error);
      throw new Error('Failed to perform findOneAndUpdate operation');
    }
  }

  async findByIdAndUpdate(id: string, updateData: UpdateQuery<T>, options?: any): Promise<T | null> {
    try {
      if (!id) {
        throw new Error('ID is required for findByIdAndUpdate');
      }
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error('Update data is required for findByIdAndUpdate');
      }
      const result = await this.model.findByIdAndUpdate(id, updateData, {
        new: true,
        ...options,
      });

      return result as unknown as T;
    } catch (error) {
      console.error('Error during findByIdAndUpdate operation:', error);
      throw new Error('Failed to perform findByIdAndUpdate operation');
    }
  }

  async findByIdAndUpdateWithPopulate(
    id: string,
    updateData: UpdateQuery<T>,
    options?: any,
    populateFields?: string | string[],
  ): Promise<T | null> {
    try {
      if (!id) {
        throw new Error('ID is required for findByIdAndUpdateWithPopulate');
      }
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error('Update data is required for findByIdAndUpdateWithPopulate');
      }

      let query = this.model.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document by default
        ...options,
      });

      if (populateFields) {
        query = query.populate(populateFields);
      }

      const result = await query;

      return result as unknown as T;
    } catch (error) {
      console.error('Error during findByIdAndUpdateWithPopulate operation:', error);
      throw new Error('Failed to perform findByIdAndUpdateWithPopulate operation');
    }
  }
  async prepareModelData(data: Partial<T>): Promise<T> {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Data is required to prepare model instance');
      }

      const modelInstance = new this.model(data);
      return modelInstance;
    } catch (error) {
      console.error('Error during prepareModelData:', error);
      throw new Error('Failed to prepare model instance');
    }
  }

  async findOneOrCreate(filter: FilterQuery<T>, document_: Partial<T>, options?: QueryOptions): Promise<T> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for findOneOrCreate');
      }

      if (!document_ || Object.keys(document_).length === 0) {
        throw new Error('Document data is required for findOneOrCreate');
      }

      let document = await this.findOne(filter, options);

      if (!document) {
        document = await this.createOne(document_, options);
      }

      return document;
    } catch (error) {
      console.error('Error during findOneOrCreate operation:', error);
      throw new Error('Failed to perform findOneOrCreate operation');
    }
  }

  async findByIdOrFail(id: string): Promise<T> {
    try {
      if (!id) {
        throw new Error('ID is required to perform findByIdOrFail');
      }
      const document = await this.findById(id);

      if (!document) {
        this.throwNotFoundResource();
      }

      return document;
    } catch (error) {
      console.error('Error during findByIdOrFail operation:', error);
      throw new Error('Failed to find resource by ID');
    }
  }

  async findOneOrFail(filter: FilterQuery<T>, options?: QueryOptions): Promise<T> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required to perform findOneOrFail');
      }
      const document = await this.findOne(filter, options);

      if (!document) {
        this.throwNotFoundResource();
      }
      return document;
    } catch (error) {
      console.error('Error during findOneOrFail operation:', error);
      throw new Error('Failed to find resource matching the criteria');
    }
  }

  async findLast(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required to perform findLast');
      }
      const items = await this.model.find(this.modifyFilter(filter), undefined, options).sort({ _id: -1 }).limit(1);

      return items.length > 0 ? items[0] : null;
    } catch (error) {
      console.error('Error during findLast operation:', error);
      throw new Error('Failed to retrieve the last matching document');
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required to perform the exists check');
      }

      const result = await this.model.exists(this.modifyFilter(filter));

      return !!result;
    } catch (error) {
      console.error('Error during exists operation:', error);
      throw new Error('Failed to check document existence');
    }
  }

  async existsById(id: ObjectId | string): Promise<boolean> {
    try {
      if (!id) {
        throw new Error('ID is required to check existence');
      }
      return await this.exists({ [this.pk]: id } as FilterQuery<T>);
    } catch (error) {
      console.error('Error during existsById operation:', error);
      throw new Error('Failed to check document existence by ID');
    }
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required to perform the count operation');
      }
      const count = await this.model.countDocuments(this.modifyFilter(filter));

      return count;
    } catch (error) {
      console.error('Error during count operation:', error);
      throw new Error('Failed to count documents');
    }
  }

  /**
   * <Create>
   */

  async createOne(_document: Partial<T>, options?: SaveOptions): Promise<T> {
    try {
      if (!_document || Object.keys(_document).length === 0) {
        throw new Error('Document data is required to create a new document');
      }

      const document = new this.model(_document);

      const savedDocument = await document.save(options);

      return savedDocument;
    } catch (error) {
      console.error('Error during createOne operation:', error);
      throw new Error('Failed to create a new document');
    }
  }

  async bulkCreate(_documents: Partial<T>[]): Promise<T[]> {
    try {
      if (!_documents || _documents.length === 0) {
        throw new Error('Documents array is required for bulkCreate');
      }
      const promises = _documents.map(async (document) => {
        if (!document || Object.keys(document).length === 0) {
          throw new Error('Each document must contain data');
        }
        return new this.model(document);
      });

      const documents = await Promise.all(promises);
      const savedDocuments = await this.model.insertMany(documents);

      return savedDocuments as T[];
    } catch (error) {
      console.error('Error during bulkCreate operation:', error);
      throw new Error('Failed to create documents in bulk');
    }
  }

  /**
   * <Update>
   */

  async updateOne(
    filter: FilterQuery<T>,
    document: UpdateQuery<T>,
    options?: HydrateOptions & { timestamps?: boolean },
  ): Promise<UpdateResult> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for updateOne');
      }
      if (!document || Object.keys(document).length === 0) {
        throw new Error('Update data is required for updateOne');
      }

      const result = await this.model.updateOne(this.modifyFilter(filter), document, options);

      return result as UpdateResult;
    } catch (error) {
      console.error('Error during updateOne operation:', error);
      throw new Error('Failed to update the document');
    }
  }

  async updateMany(filter: FilterQuery<T>, document: UpdateQuery<T>, options?: QueryOptions): Promise<UpdateResult> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for updateMany');
      }

      if (!document || Object.keys(document).length === 0) {
        throw new Error('Update data is required for updateMany');
      }
      const result = await this.model.updateMany(this.modifyFilter(filter), document, options as HydrateOptions);

      return result as UpdateResult;
    } catch (error) {
      console.error('Error during updateMany operation:', error);
      throw new Error('Failed to update documents');
    }
  }

  async updateById(id: ObjectId | string, document: UpdateQuery<T>, options?: QueryOptions): Promise<UpdateResult> {
    try {
      if (!id) {
        throw new Error('ID is required for updateById');
      }
      if (!document || Object.keys(document).length === 0) {
        throw new Error('Update data is required for updateById');
      }

      const result = await this.updateOne(
        { [this.pk]: id } as FilterQuery<T>,
        document,
        options as HydrateOptions & { timestamps?: boolean },
      );

      return result;
    } catch (error) {
      console.error('Error during updateById operation:', error);
      throw new Error('Failed to update the document by ID');
    }
  }

  async updateAndFindOne(filter: FilterQuery<T>, document: UpdateQuery<T>, options?: QueryOptions): Promise<T | null> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for updateAndFindOne');
      }
      if (!document || Object.keys(document).length === 0) {
        throw new Error('Update data is required for updateAndFindOne');
      }
      await this.updateOne(filter, document, options as HydrateOptions & { timestamps?: boolean });
      const result = await this.model.findOne(filter).lean();
      return result as T | null;
    } catch (error) {
      console.error('Error during updateAndFindOne operation:', error);
      throw new Error('Failed to update and find the document');
    }
  }

  async updateAndFindMany(filter: FilterQuery<T>, document: Partial<T>, options?: QueryOptions): Promise<T[]> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for updateAndFindMany');
      }
      if (!document || Object.keys(document).length === 0) {
        throw new Error('Update data is required for updateAndFindMany');
      }
      await this.updateMany(filter, document, options);
      return await this.findWhere(filter);
    } catch (error) {
      console.error('Error during updateAndFindMany operation:', error);
      throw new Error('Failed to update and find documents');
    }
  }

  async updateAndFindById(id: ObjectId | string, document: Partial<T>, options?: QueryOptions): Promise<T | null> {
    try {
      if (!id) {
        throw new Error('ID is required for updateAndFindById');
      }
      if (!document || Object.keys(document).length === 0) {
        throw new Error('Update data is required for updateAndFindById');
      }
      return await this.updateAndFindOne({ [this.pk]: id } as FilterQuery<T>, document, options);
    } catch (error) {
      console.error('Error during updateAndFindById operation:', error);
      throw new Error('Failed to update and find the document by ID');
    }
  }

  async updateOneOrCreate(
    filter: FilterQuery<T>,
    document: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T | UpdateResult> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for updateOneOrCreate');
      }
      if (!document || Object.keys(document).length === 0) {
        throw new Error('Update data is required for updateOneOrCreate');
      }
      const mergedOptions = { new: true, upsert: true, setDefaultsOnInsert: true, ...options };
      return await this.updateOne(filter, document, mergedOptions as HydrateOptions & { timestamps?: boolean });
    } catch (error) {
      console.error('Error during updateOneOrCreate operation:', error);
      throw new Error('Failed to update or create the document');
    }
  }

  /**
   * <Inactive data>
   * <Actually data still store from database>
   */

  async softDeleteOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<UpdateResult> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for softDeleteOne');
      }
      return await this.updateOne(
        filter,
        { $set: { deletedAt: new Date() } } as UpdateQuery<T>,
        options as HydrateOptions & { timestamps?: boolean },
      );
    } catch (error) {
      console.error('Error during softDeleteOne operation:', error);
      throw new Error('Failed to soft delete the document');
    }
  }

  async softDeleteMany(filter: FilterQuery<T>, options?: QueryOptions): Promise<UpdateResult> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for softDeleteMany');
      }
      return await this.updateMany(filter, { $set: { deletedAt: new Date() } }, options);
    } catch (error) {
      console.error('Error during softDeleteMany operation:', error);
      throw new Error('Failed to soft delete multiple documents');
    }
  }

  async findOneAndSoftDelete(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for findOneAndSoftDelete');
      }
      return await this.updateAndFindOne(filter, { $set: { deletedAt: new Date() } }, options);
    } catch (error) {
      console.error('Error during findOneAndSoftDelete operation:', error);
      throw new Error('Failed to find and soft delete the document');
    }
  }

  async softDeleteById(id: ObjectId | string, options?: QueryOptions): Promise<T | UpdateResult> {
    try {
      if (!id) {
        throw new Error('ID is required for softDeleteById');
      }
      return await this.updateById(id, { $set: { deletedAt: new Date() } }, options);
    } catch (error) {
      console.error('Error during softDeleteById operation:', error);
      throw new Error('Failed to soft delete the document by ID');
    }
  }

  /**
   * <Destroy data from database >
   * <Be careful when using them>
   */

  async destroyOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<DeleteResult> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for destroyOne');
      }
      return await this.model.deleteOne(this.modifyFilter(filter), options as DeleteResult);
    } catch (error) {
      console.error('Error during destroyOne operation:', error);
      throw new Error('Failed to delete the document');
    }
  }

  async destroyMany(filter: FilterQuery<T>, options?: QueryOptions): Promise<DeleteResult> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for destroyMany');
      }
      return await this.model.deleteMany(this.modifyFilter(filter), options as DeleteResult);
    } catch (error) {
      console.error('Error during destroyMany operation:', error);
      throw new Error('Failed to delete multiple documents');
    }
  }

  async findByIdAndDestroy(id: string, options?: QueryOptions): Promise<T | null> {
    try {
      if (!id) {
        throw new Error('ID is required for findByIdAndDestroy');
      }
      return await this.model.findByIdAndDelete(id, options);
    } catch (error) {
      console.error('Error during findByIdAndDestroy operation:', error);
      throw new Error('Failed to delete the document by ID');
    }
  }

  async findOneAndDestroy(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null> {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw new Error('Filter is required for findOneAndDestroy');
      }
      return await this.model.findOneAndDelete(this.modifyFilter(filter), options);
    } catch (error) {
      console.error('Error during findOneAndDestroy operation:', error);
      throw new Error('Failed to delete the document');
    }
  }

  async findByIdAndDelete(id: string, options?: QueryOptions): Promise<T | null> {
    try {
      if (!id) {
        throw new Error('ID is required for findByIdAndDelete');
      }
      return await this.model.findByIdAndDelete(id, options);
    } catch (error) {
      console.error('Error during findByIdAndDelete operation:', error);
      throw new Error('Failed to delete the document by ID');
    }
  }

  async destroyById(id: ObjectId | string, options?: QueryOptions): Promise<DeleteResult> {
    try {
      if (!id) {
        throw new Error('ID is required for destroyById');
      }
      return await this.destroyOne({ [this.pk]: id } as FilterQuery<T>, options);
    } catch (error) {
      console.error('Error during destroyById operation:', error);
      throw new Error('Failed to delete the document by ID');
    }
  }

  protected throwNotFoundResource(): never {
    throw new NotFoundException(`${this.model.name} not found`);
  }

  protected modifyFilter(filter: FilterQuery<T>): FilterQuery<T> {
    try {
      if (filter._id && !isObject(filter._id) && !isValidObjectId(filter._id)) {
        throw new BadRequestException('Invalid ObjectId provided');
      }
      if (this.excludeDeleted) {
        filter = { ...filter, deletedAt: { $exists: false } };
      }
      return filter;
    } catch (error) {
      console.error('Error during filter modification:', error);
      throw new BadRequestException('Failed to modify filter');
    }
  }
}
