import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/createComment.dto';
import { CreateTrackDto } from './dto/createTrack.dto';
import { Comment, CommentDocument } from './shemas/comment.schema';
import { Track, TrackDocument } from './shemas/track.schema';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
    });
    return track;
  }
  async getAll(count = 10, offset = 0): Promise<Track[]> {
    const allUser = await this.trackModel.find().skip(offset).limit(count);
    return allUser;
  }
  async getOne(id: mongoose.Schema.Types.ObjectId): Promise<Track> {
    const oneUser = await this.trackModel.findById(id).populate('comments');
    return oneUser;
  }
  async deleteOne(id: mongoose.Schema.Types.ObjectId): Promise<ObjectId> {
    const deleteUser = await this.trackModel.findByIdAndDelete(id);
    return deleteUser._id;
  }
  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const newComment = await this.commentModel.create({ ...dto });
    track.comments.push(newComment._id);
    await track.save();
    return newComment;
  }

  async listen(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    track.listens += 1;
    track.save();
  }

  async search(query: string): Promise<Track[]> {
    const searchData = await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return searchData;
  }
}
