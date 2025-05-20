import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseModel } from '../../../shared/constants';
import { BaseRepository } from '../../../shared/mongoose';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(DatabaseModel.User)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
